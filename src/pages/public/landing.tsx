import { Box, Button, Center, Flex, Stack, Text, Title } from "@mantine/core";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { getImage } from "../../utils/image-map"; // Assumed path

export default function LandingPage() {
  const navigate = useNavigate();
  const backgroundImage = getImage("landing_background_image");

  return (
    <Box
      style={{
        height: "100%",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",

        padding: "2rem",
        overflow: "hidden",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Center>
          <Stack align="center">
            <Title
              order={1}
              size="3rem"
              sx={(theme) => ({
                color: theme.white,
                textShadow: "0 4px 12px rgba(0,0,0,0.4)",
              })}
            >
              Welcome to LaunchPad 🚀
            </Title>
            <Text
              size="lg"
              align="center"
              sx={(theme) => ({
                maxWidth: 600,
                color: theme.colors.gray[0],
                textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              })}
            >
              Simulate your startup journey or fund the innovations of tomorrow.
              Step into the future, today.
            </Text>
            <Flex mt="xl" gap={100}>
              <Button
                size="lg"
                w={250}
                h={60}
                radius="xl"
                variant="light"
                gradient={{ from: "yellow", to: "orange" }}
                onClick={() => navigate("/login")}
              >
                Invest in the Future
              </Button>
              <Button
                size="lg"
                w={250}
                h={60}
                radius="xl"
                variant="filled"
                gradient={{ from: "teal", to: "blue" }}
                onClick={() => navigate("/login")}
              >
                Start Startup Journey
              </Button>
            </Flex>
          </Stack>
        </Center>
      </motion.div>
    </Box>
  );
}
