import { Container, Divider, Title } from "@mantine/core";
import { FundingAskForm } from "../../components/founder/funding-ask-form";
import { FundingSimulationBottomPanel } from "../../components/founder/funding-simulation-bottom-panel";

const FundingSimulationPage = () => {
  return (
    <Container w={"100%"} p="lg" style={{ overflowX: "hidden" }}>
      <Title order={2} mb="lg">
        Funding Simulation
      </Title>
      <FundingAskForm />
      <Divider my="lg" />
      <FundingSimulationBottomPanel />
    </Container>
  );
};

export default FundingSimulationPage;
