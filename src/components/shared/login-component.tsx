import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { getImage } from "../../utils/image-map";

const useStyles = createStyles((theme) => ({
  container: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: theme.spacing.xl,
  },
  loginPaper: {
    width: 400,
    padding: theme.spacing.xl,
    backdropFilter: "blur(15px)",
    backgroundColor: "rgba(255, 255, 255, 0.26)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: theme.radius.lg,
    boxShadow: theme.shadows.md,
  },
  switchWrapper: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  linkText: {
    cursor: "pointer",
    color: theme.colors.blue[6],
    textDecoration: "underline",
  },
}));

export const LoginComponent = observer(function LoginComponent() {
  const { authStore, uiViewStore } = useStore();
  const navigate = useNavigate();
  const { classes, theme } = useStyles();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const userRole = uiViewStore.UserRoleForLogin;
  const backgroundImage = getImage(
    userRole === "founder" ? "login_founder" : "login_investor"
  );

  const validateEmail = (value: string) => {
    if (!value) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(value)) return "Invalid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passErr);

    if (emailErr || passErr) return;

    const payload = { email, password, role: userRole };
    const success = await authStore.loginUser(payload);

    if (success) {
      notifications.show({
        title: "Login successful",
        message: `Welcome, ${userRole}!`,
        color: "green",
      });
      navigate(`/${userRole}/dashboard`);
    } else {
      notifications.show({
        title: "Login failed",
        message: "Invalid credentials",
        color: "red",
      });
    }
  };

  return (
    <div
      className={classes.container}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <Paper className={classes.loginPaper} radius="lg" shadow="md">
        <Stack spacing="md">
          <Title order={2} align="center">
            {userRole === "founder" ? "Founder Login" : "Investor Login"}
          </Title>

          <TextInput
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onBlur={() => setEmailError(validateEmail(email))}
            error={emailError}
            required
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onBlur={() => setPasswordError(validatePassword(password))}
            error={passwordError}
            required
          />

          <div className={classes.switchWrapper}>
            <Switch
              checked={userRole === "founder"}
              labelPosition="left"
              onChange={(e) =>
                uiViewStore.toggleUserRoleForLogin(
                  e.currentTarget.checked ? "founder" : "investor"
                )
              }
              label={`Login as ${"Founder"}`}
            />
          </div>

          <Button onClick={handleLogin} fullWidth variant="gradient">
            Login
          </Button>

          <Text align="center" size="sm">
            New user?{" "}
            <Text
              span
              className={classes.linkText}
              onClick={() => navigate("/register")}
              style={{
                color:
                  userRole === "founder"
                    ? theme.colors.gray[0]
                    : theme.colors.blue[6],
              }}
            >
              Sign up here
            </Text>
          </Text>
        </Stack>
      </Paper>
    </div>
  );
});
