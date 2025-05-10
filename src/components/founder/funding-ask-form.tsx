import { Button, Card, Group, NumberInput, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";

const COLORS = ["#4dabf7", "#82ca9d"];

export const FundingAskForm = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [equity, setEquity] = useState<number | "">("");

  const valuation =
    amount && equity ? (amount / (equity / 100)).toFixed(2) : null;

  const founderPercent = equity ? 100 - equity : 100;

  const data = [
    { name: "Investor", value: equity || 0 },
    { name: "Founder", value: founderPercent || 100 },
  ];

  const handleSaveStartupValuation = () => {
    notifications.show({
      title: "Start up valuation updated",
      message: "Saved required amount and equity",
      color: "green",
    });
  };

  return (
    <Card
      shadow="md"
      p="lg"
      radius="md"
      mb="lg"
      w={"100%"}
      style={{
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Title order={3} mb="md">
        Funding Ask
      </Title>
      <Group grow mb="md">
        <NumberInput
          label="Funding Amount (USD)"
          value={amount}
          w={"50%"}
          onChange={(val) => setAmount(val === "" ? "" : Number(val))}
          parser={(val) => val?.replace(/\$\s?|(,*)/g, "")}
          formatter={(val) => (!Number.isNaN(Number(val)) ? `$ ${val}` : "")}
        />
        <NumberInput
          label="Equity Offered (%)"
          value={equity}
          onChange={(val) => setEquity(val === "" ? "" : Number(val))}
          min={0}
          w={"50%"}
          max={100}
          precision={2}
          step={0.1}
        />
      </Group>

      {valuation && (
        <Text size="sm" mt="xs">
          <strong>Post-Money Valuation:</strong> ${valuation}
        </Text>
      )}

      <PieChart width={500} height={300} style={{ marginTop: "20px" }}>
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <Button
        onClick={handleSaveStartupValuation}
        style={{ marginLeft: "auto" }}
      >
        Save
      </Button>
    </Card>
  );
};

export default FundingAskForm;
