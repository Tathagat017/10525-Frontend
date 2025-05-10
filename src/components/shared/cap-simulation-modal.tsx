import { Modal, Stack, Text, Title } from "@mantine/core";
import { observer } from "mobx-react-lite";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
  useState,
} from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

export interface CapSimulationModalHandle {
  showModal: (offerAmount: number, offerEquity: number) => void;
}

const COLORS = ["#4dabf7", "#82ca9d"]; // Investor, Founder

const CapSimulationModal: ForwardRefRenderFunction<CapSimulationModalHandle> = (
  _,
  ref
) => {
  const [visible, setVisible] = useState(false);
  const [offerAmount, setOfferAmount] = useState(0);
  const [offerEquity, setOfferEquity] = useState(0);

  useImperativeHandle(ref, () => ({
    showModal: (amount: number, equity: number) => {
      setOfferAmount(amount);
      setOfferEquity(equity);
      setVisible(true);
    },
  }));

  const founderEquity = 100 - offerEquity;
  const valuation = (offerAmount / (offerEquity / 100)).toFixed(2);

  const data = [
    { name: "Investor", value: offerEquity },
    { name: "Founder", value: founderEquity },
  ];

  return (
    <Modal
      opened={visible}
      onClose={() => setVisible(false)}
      title={"Cap Table Simulation"}
      size="lg"
      centered
    >
      <Stack spacing="md" align="center">
        <Title order={5} mb="xs">
          Post-Money Valuation: ${valuation}
        </Title>
        <Text mb="md">
          ${offerAmount} for {offerEquity}% equity
        </Text>

        <PieChart width={500} height={260}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }: { name: string; percent: number }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </Stack>
    </Modal>
  );
};

export default observer(forwardRef(CapSimulationModal));
