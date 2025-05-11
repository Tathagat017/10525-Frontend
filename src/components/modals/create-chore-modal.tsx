import { Button, Group, Modal, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { observer } from "mobx-react-lite";
import { Types } from "mongoose";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useStore } from "../../hooks/use-store";
import "../../styles/date-picker.css";
import { ChoreFrequency, ChorePayload } from "../../types/chore";
import { User } from "../../types/user";

const CreateChoreModal = observer(function CreateChoreModal({
  householdId,
  members,
  householdOwner,
}: {
  householdId: string;
  members: User[];
  householdOwner: User;
}) {
  const { uiViewStore, choreStore } = useStore();

  const form = useForm<ChorePayload>({
    initialValues: {
      householdId: householdId as unknown as Types.ObjectId,
      name: "",
      frequency: "weekly",
      assignedTo: undefined,
      dueDate: new Date(),
    },
    validate: {
      name: (value) => (!value ? "Name is required" : null),
      frequency: (value) => (!value ? "Frequency is required" : null),
    },
  });

  const handleClose = () => {
    uiViewStore.toggleCreateChoreModal(false);
    form.reset();
  };

  const handleSubmit = async (values: ChorePayload) => {
    try {
      await choreStore.createChore(values);
      handleClose();
    } catch (error) {
      console.error("Error creating chore:", error);
    }
  };

  const frequencyOptions: { value: ChoreFrequency; label: string }[] = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  if (householdOwner) {
    const houseHoldOwnerPresent = members.find(
      (mem) => mem._id.toString() === householdOwner._id.toString()
    );
    if (!houseHoldOwnerPresent) {
      members.push(householdOwner);
    }
  }
  const userOptions =
    members?.map((user) => ({
      value: user._id.toString(),
      label: user.name,
    })) || [];

  return (
    <Modal
      opened={uiViewStore.IsCreateChoreModalOpen}
      onClose={handleClose}
      title="Create New Chore"
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="md">
          <TextInput
            label="Chore Name"
            placeholder="Enter chore name"
            required
            {...form.getInputProps("name")}
          />

          <Select
            label="Frequency"
            placeholder="Select frequency"
            data={frequencyOptions}
            required
            {...form.getInputProps("frequency")}
          />

          <Select
            label="Assigned To"
            placeholder="Select user"
            data={userOptions}
            clearable
            {...form.getInputProps("assignedTo")}
          />

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontSize: "14px",
              }}
            >
              Due Date
            </label>
            <DatePicker
              selected={form.values.dueDate}
              onChange={(date: Date | null) =>
                date && form.setFieldValue("dueDate", date)
              }
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
              wrapperClassName="date-picker-wrapper"
              className="mantine-Input-input"
            />
          </div>

          <Group position="right" mt="md">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Create Chore</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
});

export default CreateChoreModal;
