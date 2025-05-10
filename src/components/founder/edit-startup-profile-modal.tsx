import {
  ActionIcon,
  Anchor,
  Button,
  FileButton,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { useReducer, useState } from "react";

import {
  faEye,
  faFile,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { notifications } from "@mantine/notifications";
import { useStore } from "../../hooks/use-store";

import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { StartUpProfile } from "../../types/start-up-profile";
import { uploadPdfToCloudinary } from "../../utils/cloudinary-pdf-upload";

const initialState: StartUpProfile = {
  _id: "",
  founderId: "",
  startUpName: "",
  companyVision: "",
  productDescription: "",
  marketSize: "small",
  businessModel: "",
  pitchPdf: "",
};

type Action =
  | { type: "SET_PROFILE"; payload: StartUpProfile }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  | { type: "UPDATE_FIELD"; payload: { key: keyof StartUpProfile; value: any } }
  | { type: "RESET" };

function reducer(state: StartUpProfile, action: Action): StartUpProfile {
  switch (action.type) {
    case "SET_PROFILE":
      return action.payload;
    case "UPDATE_FIELD":
      return { ...state, [action.payload.key]: action.payload.value };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const EditStartUpProfileModal = observer(function EditStartUpProfileModal() {
  const { founderStore, uiViewStore } = useStore();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [editable, setEditable] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { isLoading } = useQuery({
    queryKey: ["startup-profile"],
    queryFn: async () => {
      const result = await founderStore.getProfile();
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      dispatch({ type: "SET_PROFILE", payload: data });
    },
  });

  const handleClose = () => {
    dispatch({ type: "RESET" });
    setEditable(false);
    uiViewStore.toggleEditStartUpProfile(false);
  };

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
      dispatch({
        type: "UPDATE_FIELD",
        payload: { key: "pitchPdf", value: url },
      });
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

  const handleSave = async () => {
    const success = await founderStore.updateProfile(state);
    if (success) {
      notifications.show({
        title: "Success",
        message: "Startup profile updated successfully.",
        color: "green",
      });
      handleClose();
    } else {
      notifications.show({
        title: "Error",
        message: "Failed to update startup profile.",
        color: "red",
      });
    }
  };

  return (
    <Modal
      opened={uiViewStore.EditStartUpProfileModal}
      onClose={handleClose}
      title={
        <Group position="apart" style={{ width: "100%" }}>
          <Text size="lg" weight={500}>
            Edit Startup Profile
          </Text>
          <Tooltip
            label={editable ? "View" : "Edit"}
            withArrow
            position="right"
            withinPortal
          >
            <ActionIcon
              variant="light"
              onClick={() => setEditable((prev) => !prev)}
              aria-label="Edit"
            >
              <FontAwesomeIcon icon={!editable ? faPen : faEye} />
            </ActionIcon>
          </Tooltip>
        </Group>
      }
      size="lg"
      overlayProps={{ blur: 3 }}
    >
      <Stack spacing="sm">
        <TextInput
          label="Startup Name"
          value={state.companyVision}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "startUpName", value: e.currentTarget.value },
            })
          }
          disabled={!editable}
        />
        <Textarea
          label="Company Vision"
          value={state.companyVision}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "companyVision", value: e.currentTarget.value },
            })
          }
          disabled={!editable}
        />
        <Textarea
          label="Product Description"
          value={state.productDescription}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: {
                key: "productDescription",
                value: e.currentTarget.value,
              },
            })
          }
          disabled={!editable}
        />
        <Select
          label="Market Size"
          data={["small", "medium", "large"]}
          value={state.marketSize}
          onChange={(value) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "marketSize", value },
            })
          }
          disabled={!editable}
        />
        <Textarea
          label="Business Model"
          value={state.businessModel}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              payload: { key: "businessModel", value: e.currentTarget.value },
            })
          }
          disabled={!editable}
        />

        {state.pitchPdf ? (
          <Group position="apart">
            <Anchor
              href={state.pitchPdf}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Group spacing="xs">
                <FontAwesomeIcon icon={faFile} />
                <Text>View Uploaded Pitch PDF</Text>
              </Group>
            </Anchor>
            {editable && (
              <ActionIcon
                color="red"
                onClick={() =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    payload: { key: "pitchPdf", value: "" },
                  })
                }
              >
                <FontAwesomeIcon icon={faTimes} />
              </ActionIcon>
            )}
          </Group>
        ) : (
          editable && (
            <FileButton
              onChange={handleFileUpload}
              accept="application/pdf"
              disabled={uploading}
            >
              {(props) => (
                <Button
                  {...props}
                  loading={uploading}
                  variant="light"
                  color="blue"
                >
                  Upload Pitch PDF
                </Button>
              )}
            </FileButton>
          )
        )}

        <Group position="right" mt="md">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={isLoading} disabled={!editable}>
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
});

export default EditStartUpProfileModal;
