import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import DatePicker from "react-datepicker";
import { showNotification } from "@mantine/notifications";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import { useState, useImperativeHandle, forwardRef } from "react";

interface FinalizeChatRoomModalProps {
  onInvite: (startTime: Date, endTime: Date) => void;
}

export interface FinaliseChatRoomModalHandle {
  show: () => void;
}

export const FinalizeChatRoomModal = forwardRef<
  FinaliseChatRoomModalHandle,
  FinalizeChatRoomModalProps
>(function FinalizeChatRoomModal({ onInvite }, ref) {
  const [opened, setOpened] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const handleInvite = () => {
    if (!startTime) return;

    const endTime = dayjs(startTime).add(1, "hour").toDate();
    onInvite(startTime, endTime);

    showNotification({
      title: "Invite Sent",
      message: "Invite sent for chat.",
      color: "green",
    });

    setOpened(false);
    setStartTime(null);
  };

  useImperativeHandle(ref, () => ({
    show: () => setOpened(true),
  }));

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title="Finalize Pitch Room"
      centered
      overlayProps={{
        blur: 3,
      }}
    >
      <Stack>
        <Text>Select start time for the pitch room:</Text>
        <DatePicker
          selected={startTime}
          withPortal
          showTimeInput
          onChange={setStartTime}
          showTimeSelect
          dateFormat="Pp"
          className="custom-datepicker"
          popperPlacement="bottom"
        />
        {startTime && (
          <Text size="sm" color="dimmed">
            End Time: {dayjs(startTime).add(1, "hour").format("HH:mm A, MMM D")}
          </Text>
        )}
        <Group position="right" mt="md">
          <Button variant="default" onClick={() => setOpened(false)}>
            Cancel
          </Button>
          <Button onClick={handleInvite} disabled={!startTime}>
            Invite to Pitch Room
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
});
