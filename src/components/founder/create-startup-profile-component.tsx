import {
  ActionIcon,
  Breadcrumbs,
  Button,
  FileButton,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  createStyles,
} from "@mantine/core";
import { useState } from "react";
import { useStore } from "../../hooks/use-store";
import {
  MarketSize,
  StartUpProfilePayload,
} from "../../types/start-up-profile";
import { uploadPdfToCloudinary } from "../../utils/cloudinary-pdf-upload";

import { notifications } from "@mantine/notifications";
import { getImage } from "../../utils/image-map"; // Assuming getImage exists

import { faFile, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

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

const marketSizes: MarketSize[] = ["small", "medium", "large"];

export const CreateStartupProfilePageComponent = () => {
  const { founderStore, authStore } = useStore();
  const { classes } = useStyles();
  const navigate = useNavigate();
  const [payload, setPayload] = useState<StartUpProfilePayload>({
    companyVision: "",
    productDescription: "",
    marketSize: "medium",
    businessModel: "",
    pitchPdf: "",
    founderId:
      authStore.Role === "founder" && authStore.User != null
        ? authStore?.User._id
        : "",
    startUpName:
      authStore.Role === "founder" &&
      authStore.User &&
      "startUpName" in authStore.User
        ? authStore.User.startUpName || ""
        : "",
  });

  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      notifications.show({
        title: "File Too Large",
        message: `PDF size must be less than ${MAX_SIZE_MB}MB`,
        color: "red",
      });
      return;
    }

    try {
      setUploading(true);
      const url = await uploadPdfToCloudinary(file);
      setPayload((prev) => ({ ...prev, pitchPdf: url }));
      setPdfUrl(url);
      notifications.show({
        title: "Upload Successful",
        message: "PDF uploaded successfully",
        color: "green",
      });
    } catch {
      notifications.show({
        title: "Upload Failed",
        message: "Failed to upload PDF",
        color: "red",
      });
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!payload.companyVision.trim()) newErrors.CompanyVision = "Required";
    if (!payload.productDescription.trim())
      newErrors.ProductDescription = "Required";
    if (!payload.businessModel.trim()) newErrors.BusinessModel = "Required";
    if (!payload.pitchPdf) newErrors.pitchPdf = "Upload required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateStartupProfile = async () => {
    if (!validate()) return;
    const result = await founderStore.createProfile(payload);
    if (result) {
      notifications.show({
        title: "Success",
        message: "Startup profile created!",
        color: "green",
      });
      navigate("/founder/dashboard"); // Assuming you have a navigate function
    }
  };

  const breadcrumbItems = [
    { title: "Dashboard", href: "#" },
    { title: "Start Up Profile", href: "#" },
  ].map((item, idx, arr) => (
    <Text
      key={item.title}
      size="xs"
      fw={500}
      c={idx === arr.length - 1 ? "blue" : "dimmed"}
    >
      {item.title}
    </Text>
  ));

  return (
    <div
      style={{
        backgroundImage: `url(${getImage(
          "create_startup_profile_background"
        )})`,
      }}
      className={classes.container}
    >
      <Breadcrumbs>{breadcrumbItems}</Breadcrumbs>

      <Paper
        shadow="xl"
        radius="md"
        p="xl"
        mt="md"
        mx="auto"
        className={classes.loginPaper}
      >
        <Title order={3} mb="md">
          Create Startup Profile
        </Title>
        <Stack spacing="sm">
          <TextInput
            label="Startup Name"
            value={payload.startUpName}
            onChange={(e) =>
              setPayload({ ...payload, startUpName: e.currentTarget.value })
            }
            error={errors.startUpName}
            withAsterisk
          />
          <TextInput
            label="Company Vision"
            value={payload.companyVision}
            onChange={(e) =>
              setPayload({ ...payload, companyVision: e.currentTarget.value })
            }
            error={errors.CompanyVision}
            withAsterisk
          />
          <Textarea
            label="Product Description"
            value={payload.productDescription}
            onChange={(e) =>
              setPayload({
                ...payload,
                productDescription: e.currentTarget.value,
              })
            }
            error={errors.ProductDescription}
            withAsterisk
          />
          <Select
            label="Market Size"
            data={marketSizes}
            value={payload.marketSize}
            onChange={(value) =>
              setPayload({ ...payload, marketSize: value as MarketSize })
            }
          />
          <Textarea
            label="Business Model"
            value={payload.businessModel}
            onChange={(e) =>
              setPayload({ ...payload, businessModel: e.currentTarget.value })
            }
            minRows={3}
            error={errors.BusinessModel}
            withAsterisk
          />

          {payload.pitchPdf ? (
            <Group spacing="xs">
              <FontAwesomeIcon icon={faFile} size="sm" />
              <Text
                size="sm"
                lineClamp={1}
                style={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => window.open(pdfUrl ?? undefined, "_blank")}
              >
                {new URL(payload.pitchPdf).pathname.split("/").pop()}
              </Text>
              <ActionIcon
                variant="subtle"
                color="red"
                onClick={() =>
                  setPayload((prev) => ({ ...prev, pitchPdf: "" }))
                }
              >
                <FontAwesomeIcon icon={faTimes} size="sm" />
              </ActionIcon>
            </Group>
          ) : (
            <FileButton
              accept="application/pdf"
              onChange={(file) => file && handleFileUpload(file)}
            >
              {(props) => (
                <Button
                  {...props}
                  loading={uploading}
                  variant="light"
                  color="blue"
                  fullWidth
                >
                  Upload Pitch PDF
                </Button>
              )}
            </FileButton>
          )}
          {errors.pitchPdf && (
            <Text size="xs" c="red">
              {errors.pitchPdf}
            </Text>
          )}

          <Button
            onClick={handleCreateStartupProfile}
            loading={uploading}
            fullWidth
            mt="sm"
          >
            Create Profile
          </Button>
        </Stack>
      </Paper>
    </div>
  );
};
