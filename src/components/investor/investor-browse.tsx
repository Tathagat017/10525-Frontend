import { Button, Card, Grid, Group, Text, Title } from "@mantine/core";
import { useStore } from "../../hooks/use-store";

import { faFilePdf, faRocket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { StartUpProfile } from "../../types/start-up-profile";
import NegotiateOfferModal, {
  InvesterOfferModalHandle,
} from "./invester-offer-modal";
import { useRef } from "react";

const dummyStartups: StartUpProfile[] = [
  {
    _id: "1",
    founderId: "68166c4c5f33330ed9ad6fb1", // Example ObjectId
    startUpName: "Tathagat's LaunchPad",
    companyVision: "A startup platform.",
    productDescription:
      "platform where users play the role of a startup founder creating pitch decks, financials, and business ideas—while investors simulate funding rounds..",
    marketSize: "large",
    businessModel: "SaaS",
    pitchPdf:
      "https://res.cloudinary.com/dpiccu05w/raw/upload/v1746329865/idoc.pub_land-of-the-seven-rivers_dflotx.pdf",
    requestedFunding: 2000000,
    requestedEquity: 15,
  },
  {
    founderId: "681679ec026e6ffaa746a3af",
    startUpName: "GreenBloom AgriTech",
    companyVision:
      "Revolutionizing sustainable agriculture with AI-driven solutions for small and mid-size farmers.",
    productDescription:
      "Uses IoT sensors and AI predictions to optimize yield and resource use for farms.",
    marketSize: "large",
    businessModel: "Hardware + Subscription",
    pitchPdf:
      "https://res.cloudinary.com/dpiccu05w/raw/upload/v1746329865/idoc.pub_land-of-the-seven-rivers_dflotx.pdf",
    requestedFunding: 1500000,
    requestedEquity: 12,
    _id: "2",
  },
  {
    founderId: "68167b12d967d7182b3fc4a6",
    startUpName: "NeuroNest Health",
    companyVision:
      "Making mental health support more accessible via personalized digital therapy tools.",
    productDescription:
      "An app combining AI therapy bots, journaling, and anonymous peer groups for better mental health.",
    marketSize: "medium",
    businessModel: "Freemium",
    pitchPdf:
      "https://res.cloudinary.com/dpiccu05w/raw/upload/v1746329865/idoc.pub_land-of-the-seven-rivers_dflotx.pdf",
    requestedFunding: 1000000,
    requestedEquity: 10,
    _id: "3",
  },
  {
    founderId: "68167b7ed967d7182b3fc4a9",
    startUpName: "ByteMarket",
    companyVision:
      "Enabling small businesses to set up digital storefronts with zero code.",
    productDescription:
      "Drag-and-drop e-commerce website builder for regional businesses with integrated local payments.",
    marketSize: "large",
    businessModel: "Subscription + Transaction fee",
    pitchPdf:
      "https://res.cloudinary.com/dpiccu05w/raw/upload/v1746329865/idoc.pub_land-of-the-seven-rivers_dflotx.pdf",
    requestedFunding: 800000,
    requestedEquity: 8,
    _id: "4",
  },
];

export default function InvestorBrowse() {
  const { investerStore } = useStore();
  const NegotiateOfferModalRef = useRef<InvesterOfferModalHandle>(null);
  const { data: profiles, isLoading } = useQuery({
    queryKey: ["startup-profiles"],
    queryFn: async () => {
      const result = await investerStore.getAllProfiles();
      return result;
    },
  });

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const result = await investerStore.getAllUsers();
      return result;
    },
  });

  if (isLoading) return <Text>Loading startups...</Text>;

  const openModal = () => {
    if (NegotiateOfferModalRef.current) {
      NegotiateOfferModalRef.current.showModal("0");
    }
  };

  return (
    <div style={{ overflowX: "hidden", height: "100%", width: "100%" }}>
      <Title order={2} mb="md">
        Browse Startups
      </Title>
      <Grid>
        {dummyStartups?.map((profile) => (
          <Grid.Col xs={12} sm={6} md={4} key={profile._id}>
            <Card shadow="md" radius="lg" withBorder p="lg">
              <Group position="apart" mb="sm">
                <Title order={4}>{profile.startUpName}</Title>
                <FontAwesomeIcon icon={faRocket} />
              </Group>

              <Text size="sm" c="dimmed">
                <strong>Founder:</strong>{" "}
                {
                  users?.find((user) => user._id === profile.founderId)
                    ?.fullName
                }
              </Text>
              <Text size="sm" c="dimmed">
                <strong>Founder email:</strong>{" "}
                {users?.find((user) => user._id === profile.founderId)?.email}
              </Text>
              <Text size="sm" mt="xs">
                <strong>Business Model:</strong> {profile.businessModel}
              </Text>
              <Text size="sm" mt="xs">
                <strong>Company Vision:</strong> {profile.companyVision}
              </Text>

              <Group mt="md" position="apart">
                <Button
                  variant="light"
                  rightIcon={<FontAwesomeIcon icon={faFilePdf} />}
                  component="a"
                  href={profile.pitchPdf}
                  download
                  target="_blank"
                >
                  Download Pitch
                </Button>
                <Button onClick={openModal}>Send Investment Offer</Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <NegotiateOfferModal ref={NegotiateOfferModalRef} />
    </div>
  );
}
