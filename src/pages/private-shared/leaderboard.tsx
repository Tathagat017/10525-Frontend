import React, { useState } from "react";
import {
  Container,
  Title,
  Card,
  Text,
  Select,
  SimpleGrid,
  Group,
  Badge,
} from "@mantine/core";

type StartupProfile = {
  name: string;
  founder: string;
  vision: string;
  valuation: number; // in millions
  fundingReceived: number; // in millions
  feedbackRating: number; // out of 5
};

const dummyStartups: StartupProfile[] = [
  {
    name: "Tathagat's LaunchPad",
    founder: "Tathagat",
    vision:
      "A platform where users play the role of a startup founder creating pitch decks, financials, and business ideas—while investors simulate funding rounds.",
    valuation: 120,
    fundingReceived: 75,
    feedbackRating: 4.9,
  },
  {
    name: "Healthify Future",
    founder: "Aanya Mehta",
    vision: "AI-powered preventive healthcare for urban populations.",
    valuation: 95,
    fundingReceived: 60,
    feedbackRating: 4.6,
  },
  {
    name: "AgroSmart",
    founder: "Ravi Kumar",
    vision: "IoT devices and smart analytics to revolutionize Indian farming.",
    valuation: 110,
    fundingReceived: 80,
    feedbackRating: 4.7,
  },
  {
    name: "EduLeap",
    founder: "Sneha Jain",
    vision: "Gamified learning for rural students with offline access.",
    valuation: 85,
    fundingReceived: 55,
    feedbackRating: 4.8,
  },
];

const sortOptions = [
  { label: "Valuation", value: "valuation" },
  { label: "Funding Received", value: "fundingReceived" },
  { label: "Feedback Rating", value: "feedbackRating" },
];

const LeaderBoardPage = () => {
  const [sortBy, setSortBy] = useState<keyof StartupProfile>("valuation");

  const sortedStartups = [...dummyStartups].sort(
    (a, b) => Number(b[sortBy]) - Number(a[sortBy])
  );

  return (
    <Container>
      <Group position="apart" mt="lg" mb="md">
        <Title order={2}>🏆 Startup Leaderboard</Title>
        <Select
          label="Sort by"
          value={sortBy}
          onChange={(value) => setSortBy(value as keyof StartupProfile)}
          data={sortOptions}
        />
      </Group>

      <SimpleGrid cols={1} spacing="lg">
        {sortedStartups.map((startup, index) => (
          <Card key={index} shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mb="sm">
              <Title order={4}>
                #{index + 1} - {startup.name}
              </Title>
              <Badge color="blue" variant="light">
                {sortBy === "valuation"
                  ? `$${startup.valuation}M Valuation`
                  : sortBy === "fundingReceived"
                  ? `$${startup.fundingReceived}M Funding`
                  : `${startup.feedbackRating}/5 Rating`}
              </Badge>
            </Group>
            <Text weight={500}>Founder: {startup.founder}</Text>
            <Text size="sm" mt="xs" color="dimmed">
              {startup.vision}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default LeaderBoardPage;
