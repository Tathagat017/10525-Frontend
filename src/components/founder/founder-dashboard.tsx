import {
  faBusinessTime,
  faComments,
  faEdit,
  faEnvelopeOpenText,
  faFilePdf,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Flex,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../hooks/use-store";

export const FounderDashboard = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { uiViewStore, founderStore } = useStore();

  const { data: profile } = useQuery({
    queryKey: ["startup-profile"],
    queryFn: async () => {
      const result = await founderStore.getProfile();
      return result;
    },
    onSuccess(data) {
      if (!data) {
        navigate("/founder/createStartUpProfile"); // Redirect to create profile if not found
      }
    },
  });

  const cardGradients: Record<string, string> = {
    gradient1: "linear-gradient(135deg, #a8c0ff, #3f2b96)",
    gradient2: "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
    gradient3: "linear-gradient(135deg, #d4fc79, #96e6a1)",
    gradient4: "linear-gradient(135deg, #f6d365,rgb(240, 131, 100))",
    gradient5: "linear-gradient(135deg, #c3cfe2, #c3cfe2)",
    gradient6: "linear-gradient(135deg, #ffecd2, #fcb69f)",
    gradient7: "linear-gradient(135deg, #e0c3fc, #8ec5fc)",
  };

  const cards = [
    {
      icon: faRocket,
      title: "Startup Profile",
      gradient: cardGradients["gradient1"],
      description: profile?.companyVision || "No profile yet",
      action: (
        <Button
          size="xs"
          onClick={() => uiViewStore.toggleEditStartUpProfile(true)}
        >
          Edit
        </Button>
      ),
      footer: profile?.pitchPdf && (
        <Anchor href={profile.pitchPdf} target="_blank" download>
          <FontAwesomeIcon icon={faFilePdf} size="lg" />
        </Anchor>
      ),
    },
    {
      icon: faBusinessTime,
      title: "Funding Simulation",
      gradient: cardGradients["gradient1"],
      onClick: () => navigate("/founder/funding-simulation"),
    },

    {
      icon: faEnvelopeOpenText,
      gradient: cardGradients["gradient4"],
      title: "Chat-Pitch History",
      onClick: () => navigate("/founder/pitch-history"),
    },
    {
      icon: faEdit,
      gradient: cardGradients["gradient4"],
      title: "Upcoming Chats",
      onClick: () => navigate("/founder/pitch-room/scheduled"),
    },
    {
      icon: faComments,
      gradient: cardGradients["gradient4"],
      title: "Live Chat Room",
      onClick: () => navigate("/founder/pitch-room/:roomId"), // Replace with actual roomId
    },
  ];

  return (
    <Box
      style={{
        backgroundColor: theme.colors.indigo[1],
        height: "100%",
        width: "100%",
        overflowX: "hidden",
      }}
    >
      <Container py="xl">
        <Breadcrumbs mb="lg">
          <Text color="dimmed">Dashboard</Text>
        </Breadcrumbs>

        <SimpleGrid
          cols={3}
          spacing="xl"
          breakpoints={[
            { maxWidth: 980, cols: 2, spacing: "lg" },
            { maxWidth: 755, cols: 1 },
          ]}
        >
          {cards.map((card, idx) => (
            <Card
              key={idx}
              shadow="md"
              radius="md"
              p="lg"
              style={{
                background: card.gradient,
                color: "white",
                cursor: card.onClick ? "pointer" : "default",
                transition: "transform 0.2s ease",
                height: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                overflow: "hidden",
              }}
              onClick={card.onClick}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <Flex justify="space-between" mb="sm">
                <Group>
                  <FontAwesomeIcon icon={card.icon} />
                  <Title
                    order={4}
                    c="white"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {card.title}
                  </Title>
                </Group>
                {card.action}
              </Flex>

              {card.description && (
                <Text
                  size="sm"
                  style={{
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {card.description}
                </Text>
              )}

              {card.footer && <Group mt="sm">{card.footer}</Group>}
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

export default FounderDashboard;
