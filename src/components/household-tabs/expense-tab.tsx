import {
  faBalanceScale,
  faMoneyBillWave,
  faPlus,
  faUser,
  faCheck,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Loader,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { observer } from "mobx-react-lite";
import { Types } from "mongoose";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useStore } from "../../hooks/use-store";
import { ExpenseBalance, SettleUpSuggestion } from "../../types/expense";
import CreateExpenseModal from "../modals/create-expense-modal";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { User } from "../../types/user";
import { notifications } from "@mantine/notifications";
const COLORS = ["#4caf50", "#f44336", "#2196f3", "#ff9800", "#9c27b0"];

const ExpenseTab = observer(
  ({ members, householdOwner }: { members: User[]; householdOwner: User }) => {
    const { householdStore, authStore, uiViewStore } = useStore();
    const { id } = useParams();

    const [balances, setBalances] = useState<ExpenseBalance[]>([]);
    const [suggestions, setSuggestions] = useState<SettleUpSuggestion[]>([]);

    const { data: expenses, isLoading: loadingExpenses } = useQuery({
      queryKey: ["expenses"],
      queryFn: async () => {
        const result = await householdStore.getExpenses(
          id! as unknown as Types.ObjectId
        );
        return result;
      },
    });

    const { isLoading: loadingBalances } = useQuery({
      queryKey: ["balances"],
      queryFn: async () => {
        const result = await householdStore.getBalances(
          id! as unknown as Types.ObjectId
        );
        return result;
      },
      onSuccess: (data) => {
        if (!data) return;
        setBalances(data);
      },
    });

    const { isLoading: loadingSuggestions } = useQuery({
      queryKey: ["settle-up"],
      queryFn: async () => {
        const result = await householdStore.getSettleUpSuggestions(
          id! as unknown as Types.ObjectId
        );
        return result;
      },
      onSuccess: (data) => {
        if (!data) return;
        setSuggestions(data);
      },
    });

    const { data: users } = useQuery({
      queryKey: ["users"],
      queryFn: async () => {
        return await authStore.getUsers();
      },
    });

    if (loadingExpenses || loadingBalances || loadingSuggestions) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Loader />
        </div>
      );
    }

    const handleCreateExpense = () => {
      uiViewStore.toggleCreateExpenseModal(true);
    };

    const handlePayShare = async (
      expenseId: string,
      _userId: string,
      _share: number,
      amount: number
    ) => {
      try {
        const result = await householdStore.payShare(
          expenseId as unknown as Types.ObjectId,
          amount
        );
        if (result) {
          notifications.show({
            title: "Payment marked as paid",
            message: `You have paid ${amount.toFixed(2)} for ${
              expenses?.find((exp) => exp._id.toString() === expenseId)?.name
            }`,
            color: "green",
          });
        }
      } catch (error) {
        console.error("Error paying share:", error);
        notifications.show({
          title: "Error paying share",
          message: "Please try again",
          color: "red",
        });
      }
    };

    return (
      <Stack>
        <Group position="apart">
          <Title order={3}>Expenses</Title>
          <Button
            leftIcon={<FontAwesomeIcon icon={faPlus} />}
            onClick={handleCreateExpense}
          >
            Add Expense
          </Button>
        </Group>

        {expenses && expenses.length > 0 ? (
          <>
            {" "}
            <Divider label="Expenses List" labelPosition="center" my="sm" />
            <ScrollArea h={250}>
              <Stack spacing="xs">
                {expenses?.map((exp) => (
                  <Card
                    key={exp._id.toString()}
                    shadow="sm"
                    padding="md"
                    radius="md"
                    withBorder
                  >
                    <Group position="apart">
                      <Group>
                        <Text weight={500}>{exp.name}</Text>
                        {exp.isCompletelyPaid && (
                          <Badge color="green" size="sm">
                            <FontAwesomeIcon icon={faCheck} className="me-1" />
                            Expense Paid by all participants
                          </Badge>
                        )}
                      </Group>
                      <Badge color="blue">${exp.amount.toFixed(2)}</Badge>
                    </Group>
                    <Text size="sm" color="dimmed" mt={4}>
                      <FontAwesomeIcon icon={faUser} className="me-1" /> Paid
                      by:{" "}
                      {users?.find((user) => user._id == exp.payer._id)?.name}
                    </Text>
                    <Stack spacing="xs" mt="sm">
                      {exp.participants.map((p) => {
                        const user = users?.find(
                          (user) => user._id == p.user._id
                        );
                        const shareAmount = exp.amount * p.share;
                        const isPayer = p.user._id === exp.payer._id;
                        return (
                          <Group key={p.user._id.toString()} position="apart">
                            <Text size="sm">
                              {user?.name} (${shareAmount.toFixed(2)})
                              {p.isPaid && (
                                <Badge ml="xs" color="green" size="sm">
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="me-1"
                                  />
                                  Paid
                                </Badge>
                              )}
                            </Text>
                            {!p.isPaid &&
                              !isPayer &&
                              p.user._id === authStore.user?._id && (
                                <Button
                                  size="xs"
                                  leftIcon={
                                    <FontAwesomeIcon icon={faMoneyBill} />
                                  }
                                  onClick={() =>
                                    handlePayShare(
                                      exp._id.toString(),
                                      p.user._id.toString(),
                                      p.share,
                                      shareAmount
                                    )
                                  }
                                >
                                  Pay Share
                                </Button>
                              )}
                          </Group>
                        );
                      })}
                    </Stack>
                    <Text size="xs" color="dimmed" mt="sm">
                      Date: {format(new Date(exp.date), "PP")}
                    </Text>
                  </Card>
                ))}
              </Stack>
            </ScrollArea>
            <Divider label="Balances" labelPosition="center" my="sm" />
            <Stack spacing="xs">
              {balances && (
                <Box mt="md" style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={Object.entries(balances).map(([userId, amt]) => {
                          const user = users?.find(
                            (u) => u._id.toString() == userId
                          );
                          let amount: string | number = Number(amt).toFixed(2);
                          amount = Math.abs(Number(amount));
                          return {
                            name: user?.name ?? "Unknown",
                            value: amount,
                          };
                        })}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={50}
                        label
                      >
                        {Object.keys(balances).map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
              {balances &&
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                Object.entries(balances).map(([user, amt]: any) => (
                  <Text key={user}>
                    <FontAwesomeIcon icon={faBalanceScale} className="me-2" />
                    {users?.find((u) => u._id == user)?.name}:{" "}
                    <span style={{ color: amt < 0 ? "red" : "green" }}>
                      {amt < 0 ? "-" : "+"}${Math.abs(amt).toFixed(2)}
                    </span>
                  </Text>
                ))}
            </Stack>
            <Divider
              label="Settle Up Suggestions"
              labelPosition="center"
              my="sm"
            />
            <Stack spacing="xs">
              {suggestions?.length === 0 && (
                <Text size="sm">All settled up 🎉</Text>
              )}
              {suggestions?.map((tx: SettleUpSuggestion, idx: number) => (
                <Text key={idx} size="sm">
                  <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" />
                  {users?.find((user) => user._id == tx.from)?.name} pays $
                  {tx.amount.toFixed(2)} to{" "}
                  {users?.find((user) => user._id == tx.to)?.name}
                </Text>
              ))}
            </Stack>
          </>
        ) : (
          <div>No expenses</div>
        )}

        <CreateExpenseModal
          members={members}
          householdOwner={householdOwner}
          householdId={id!}
        />
      </Stack>
    );
  }
);

export default ExpenseTab;
