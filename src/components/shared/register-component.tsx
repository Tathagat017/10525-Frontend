import {
  Button,
  FileButton,
  Flex,
  MultiSelect,
  Paper,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";
import { PasswordWithValidation } from "./password-with-validation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImagePortrait } from "@fortawesome/free-solid-svg-icons";
import { uploadImageToCloudinary } from "../../utils/cloudinary-image-upload";

const useStyles = createStyles((theme) => ({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: theme.colors.dark[7],
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    backgroundSize: "cover",
    backgroundPosition: "center",
    overflowY: "auto",
    overflowX: "hidden",
  },
  formPaper: {
    width: 420,
    backdropFilter: "blur(10px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: theme.radius.md,
    padding: theme.spacing.xl,
    color: "white",
    marginTop: theme.spacing.sm,
  },
}));

const industries = ["Manufacturing", "IT", "Services", "Healthcare", "Finance"];

export const RegisterComponent = observer(() => {
  const { authStore, uiViewStore } = useStore();
  const navigate = useNavigate();
  const userRole = uiViewStore.UserRoleForLogin;
  const { classes } = useStyles();
  const backgroundImage = getImage(
    userRole === "founder" ? "login_founder" : "login_investor"
  );

  // Common
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicUrl, setProfilePicUrl] = useState("");

  // Founder-specific
  const [startUpName, setStartUpName] = useState("");

  // Investor-specific
  const [industriesSelected, setIndustriesSelected] = useState<string[]>([]);

  // Errors
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const validateEmail = (email: string) =>
    !email
      ? "Email required"
      : !/\S+@\S+\.\S+/.test(email)
      ? "Invalid email"
      : null;

  const validateName = (name: string) => (!name ? "Name required" : null);

  const handleFileUpload = async (file: File): Promise<string | null> => {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      notifications.show({
        title: "File Too Large",
        message: `Image size must be less than ${MAX_SIZE_MB}MB`,
        color: "red",
      });
      return null;
    }

    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file); // ✅ use the input `file`
      notifications.show({
        title: "Upload Successful",
        message: "Image uploaded successfully",
        color: "green",
      });
      return url;
    } catch {
      notifications.show({
        title: "Upload Failed",
        message: "Failed to upload image",
        color: "red",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    const nameErr = validateName(fullName);
    const emailErr = validateEmail(email);
    const passErr = password.length < 8 ? "Password too short" : null;

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passErr);

    if (nameErr || emailErr || passErr) return;

    const commonPayload = {
      fullName,
      email,
      bio,
      password,
      profilePictureUrl: profilePicUrl,
      role: userRole,
    };

    const payload =
      userRole === "founder"
        ? { ...commonPayload, startUpName: startUpName }
        : { ...commonPayload, industriesInterestedIn: industriesSelected };

    const success = await authStore.signUp(payload);

    if (success) {
      notifications.show({
        title: "Registration Successful",
        message: `Succesfully registered as ${userRole}`,
        color: "green",
      });
      navigate(`/login`);
    } else {
      notifications.show({
        title: "Registration Failed",
        message: "Please try again",
        color: "red",
      });
    }
  };

  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Paper className={classes.formPaper}>
        <Stack spacing="xs">
          <Title
            order={2}
            align="center"
            color={userRole === "founder" ? "white" : "black"}
          >
            Registering as {userRole === "founder" ? "Founder" : "Investor"}
          </Title>

          <Switch
            checked={userRole === "founder"}
            label={
              <span
                style={{ color: userRole === "founder" ? "white" : "black" }}
              >
                Register as Founder
              </span>
            }
            onChange={(e) =>
              uiViewStore.toggleUserRoleForLogin(
                e.currentTarget.checked ? "founder" : "investor"
              )
            }
          />

          <TextInput
            label="Full Name"
            size="xs"
            value={fullName}
            onChange={(e) => setFullName(e.currentTarget.value)}
            onBlur={() => setNameError(validateName(fullName))}
            error={nameError}
            required
          />

          <TextInput
            label="Email"
            size="xs"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={() => setEmailError(validateEmail(email))}
            error={emailError}
            required
          />
          <PasswordWithValidation
            password={password}
            setPassword={setPassword}
            error={passwordError}
            onBlur={() =>
              setPasswordError(
                password.length < 8 ? "Password too short" : null
              )
            }
          />

          <Text size="xs" color="black">
            Profile Picture
          </Text>
          <Flex align="center" gap={8}>
            {profilePic && (
              <Text
                size="sm"
                align="center"
                color={userRole === "founder" ? "white" : "black"}
              >
                Picked file: {profilePic.name}
              </Text>
            )}
            <FileButton
              onChange={async (file) => {
                if (!file) return;
                setProfilePic(file);
                const url = await handleFileUpload(file);
                if (url) {
                  setProfilePicUrl(url); // ✅ store Cloudinary URL in base64Image variable
                }
              }}
              accept="image/png,image/jpeg"
            >
              {(props) => (
                <Button
                  {...props}
                  size="xs"
                  loading={uploading}
                  variant={"filled"}
                  style={{ flexGrow: profilePic ? "" : 1 }}
                  leftIcon={
                    <FontAwesomeIcon icon={faImagePortrait} size="sm" />
                  }
                  rightIcon={profilePic ? null : <span>+</span>}
                >
                  {profilePic ? "Change Image" : "Upload Image"}
                </Button>
              )}
            </FileButton>
          </Flex>
          <Textarea
            size="xs"
            label="Bio"
            value={bio}
            onChange={(e) => setBio(e.currentTarget.value)}
            minRows={2}
          />

          {userRole === "founder" ? (
            <TextInput
              size="xs"
              label="Startup Name"
              value={startUpName}
              onChange={(e) => setStartUpName(e.currentTarget.value)}
            />
          ) : (
            <MultiSelect
              size="xs"
              label="Industries Interested In"
              data={industries}
              value={industriesSelected}
              onChange={setIndustriesSelected}
              placeholder="Select industries"
              searchable
            />
          )}
          <Text
            size="sm"
            align="center"
            style={{
              color: userRole === "founder" ? "white" : "black",
              marginTop: 8,
            }}
          >
            Already a user?{" "}
            <span
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login here
            </span>
          </Text>

          <Button
            fullWidth
            onClick={handleRegister}
            size="xs"
            variant="gradient"
          >
            Register
          </Button>
        </Stack>
      </Paper>
    </div>
  );
});
