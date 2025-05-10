/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { observer } from "mobx-react-lite";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

export interface InvesterOfferModalHandle {
  showModal: (founderId: string) => void;
}

const COLORS = ["#4caf50", "#2196f3"];

const NegotiateOfferModal = observer(
  forwardRef<InvesterOfferModalHandle>((_, ref) => {
    const [opened, setOpened] = useState(false);
    const [amount, setAmount] = useState<number>(0);
    const [equity, setEquity] = useState<number>(0);
    const [founderId, setFounderId] = useState<string>("");

    useImperativeHandle(ref, () => ({
      showModal(founderId: string) {
        setFounderId(founderId);
        setOpened(true);
      },
    }));

    const valuation =
      amount && equity ? (amount / (equity / 100)).toFixed(2) : null;

    const data = [
      { name: "Founder", value: 100 - equity },
      { name: "Investor", value: equity },
    ];

    const handleSubmit = () => {
      //

      setOpened(false);
      notifications.show({
        title: "Offer creation successful",
        message: `Offer created!`,
        color: "green",
      });
    };

    return (
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Negotiate Offer"
        size="lg"
        centered
      >
        <Stack>
          <Title order={5}>Counter Offer</Title>
          <NumberInput
            label="Amount (USD)"
            value={amount}
            onChange={(val) => setAmount(val || 0)}
            min={0}
            step={1000}
          />
          <NumberInput
            label="Equity (%)"
            value={equity}
            onChange={(val) => setEquity(val || 0)}
            min={0}
            max={100}
            precision={2}
            step={0.1}
          />

          {valuation && (
            <Text>
              <strong>Implied Valuation:</strong> ${valuation}
            </Text>
          )}

          <PieChart width={300} height={220}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>

          <Group position="right">
            <Button onClick={handleSubmit} color="blue">
              Send Offer
            </Button>
          </Group>
        </Stack>
      </Modal>
    );
  })
);

export default NegotiateOfferModal;
