import {
  Avatar,
  Badge,
  Button,
  createStyles,
  Group,
  Paper,
  ScrollArea,
  TextInput,
  Title,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { ChatMessage, PitchRoom } from "../../types/pitch-room";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = createStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    marginBottom: theme.spacing.md,
  },
  messageBubble: {
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.gray[0],
    marginBottom: theme.spacing.xs,
  },
  inputGroup: {
    display: "flex",
    gap: theme.spacing.sm,
  },
  pdfViewer: {
    width: "50%",
    border: `1px solid ${theme.colors.gray[3]}`,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  participant: {
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
}));

const ChatRoom = () => {
  const { classes } = useStyles();
  const navigate = useNavigate();
  const { authStore } = useStore();

  // Dummy user and role
  const user = { _id: "u1", fullName: "Demo User" };
  const role = "founder";

  // Dummy pitchRoom data
  const pitchRoom: PitchRoom = {
    _id: "room1",
    roomName: "Demo Pitch Room",
    founderId: "u1",
    investorIds: ["u2"],
    pitchPdf:
      "https://res.cloudinary.com/dpiccu05w/raw/upload/v1746329865/idoc.pub_land-of-the-seven-rivers_dflotx.pdf", // Make
    chatMessages: [],
    invitedUsers: [],
    participants: [],
    status: "live",
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 3600000).toISOString(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connectedUsers, setConnectedUsers] = useState(["u2"]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const newMsg: ChatMessage = {
      _id: Date.now().toString(),
      senderId: user._id,
      content: newMessage,
    };

    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const handleExit = () => {
    showNotification({
      title: "Exited Chat",
      message: `${user.fullName} has left the chat.`,
      color: "red",
    });
    navigate(role === "founder" ? "/founder/dashboard" : "/investor/feedback");
  };

  return (
    <div className={classes.root}>
      <div className={classes.chatContainer}>
        <div className={classes.topBar}>
          <Group>
            <Title order={4}>{pitchRoom.roomName}</Title>
            <Group>
              {[pitchRoom.founderId, ...pitchRoom.investorIds].map((id) => (
                <Group key={id} className={classes.participant}>
                  <Avatar radius="xl" size="sm" />
                  <Badge color={connectedUsers.includes(id) ? "green" : "gray"}>
                    {connectedUsers.includes(id) ? "Online" : "Offline"}
                  </Badge>
                </Group>
              ))}
            </Group>
          </Group>
          <Group>
            <Button color="gray" variant="outline" onClick={handleExit}>
              Exit Chat
            </Button>
            <Button
              color="blue"
              onClick={() =>
                navigate(
                  role === "founder"
                    ? "/founder/dashboard"
                    : "/investor/feedback"
                )
              }
            >
              Complete
            </Button>
          </Group>
        </div>

        <ScrollArea className={classes.messagesArea}>
          {messages.map((msg) => (
            <Paper key={msg._id} className={classes.messageBubble} shadow="xs">
              <strong>{msg.senderId}:</strong> {msg.content}
            </Paper>
          ))}
        </ScrollArea>

        <Group className={classes.inputGroup}>
          <TextInput
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.currentTarget.value)}
            sx={{ flex: 1 }}
          />
          <Button onClick={handleSend}>Send</Button>
        </Group>
      </div>

      <div className={classes.pdfViewer}>
        <Document file="/sample.pdf">
          <Page pageNumber={1} />
        </Document>
      </div>
    </div>
  );
};
export default ChatRoom;
