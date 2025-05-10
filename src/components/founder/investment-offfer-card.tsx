import { faHandshake } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Badge, Button, Card, Flex, Group, Text } from "@mantine/core";
import { useState } from "react";
import { useStore } from "../../hooks/use-store";
import { InvestmentOffer } from "../../types/funding";

interface InvestmentOfferCardProps extends InvestmentOffer {
  investorName: string;
  offeredAmount: number;
  offeredEquity: number;
  offerId: string;
  founderId: string;
  status: "pending" | "accepted" | "rejected";
  investorId: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
  message?: string;
  onSimulateOfferClick: (amout: number, equity: number) => void;
  onFinaliseClick: () => void;
  onNegotiateOfferClick: (
    offeredAmount: number,
    offeredEquity: number,
    offerId: string
  ) => void;
}

const InvestmentOfferCard = ({
  investorName,
  offeredAmount,
  offeredEquity,
  offerId,
  onNegotiateOfferClick,
  message,
  onSimulateOfferClick,
  //founderId,
  status,
  // investorId,
  // createdAt,
  // updatedAt,
  // _id,
  lastUpdatedBy,
  isNewOffer,
  onFinaliseClick,
}: InvestmentOfferCardProps) => {
  const [newStatus, setNewStatus] = useState<
    "pending" | "accepted" | "rejected"
  >(status);
  const { authStore } = useStore();
  const { _id: userId } = authStore.User!;
  const userRole = authStore.Role!;

  const handleAccept = () => {
    setNewStatus("accepted");
  };

  const handleReject = () => {
    setNewStatus("rejected");
  };

  const handleNegotiate = () => {
    onNegotiateOfferClick(offeredAmount, offeredEquity, offerId);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" mb="sm">
      <Flex justify="space-between" mb="sm">
        <Group>
          <FontAwesomeIcon icon={faHandshake} />
          <Text weight={500}>{investorName}</Text>
        </Group>
        <Badge
          color={
            newStatus === "accepted"
              ? "green"
              : newStatus === "rejected"
              ? "red"
              : "gray"
          }
        >
          {newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}
        </Badge>
      </Flex>

      <Text size="lg" weight={500}>
        ${offeredAmount} for {offeredEquity}% equity
      </Text>
      {message && (
        <Text size="sm" color="dimmed" mt="xs">
          {message}
        </Text>
      )}

      <Group mt="md" position="apart" grow>
        {newStatus === "pending" ? (
          <>
            <Button
              variant="light"
              color="blue"
              size="xs"
              onClick={handleNegotiate}
            >
              Negotiate Offer
            </Button>

            <Button
              variant="outline"
              color="teal"
              size="xs"
              onClick={() => onSimulateOfferClick(offeredAmount, offeredEquity)}
            >
              Simulate Accepted Offer
            </Button>

            <Group>
              {(lastUpdatedBy.userId != userId &&
                lastUpdatedBy.role != userRole) ||
              isNewOffer ? (
                <Button
                  variant="outline"
                  color="green"
                  size="xs"
                  onClick={handleAccept}
                >
                  Accept
                </Button>
              ) : null}
              <Button
                variant="outline"
                color="red"
                size="xs"
                onClick={handleReject}
              >
                Reject
              </Button>
            </Group>
          </>
        ) : newStatus === "accepted" || status == "accepted" ? (
          <>
            <Button
              variant="light"
              color="green"
              size="xs"
              onClick={() => onFinaliseClick()}
            >
              Finalize Offer
            </Button>
            <Button
              variant="outline"
              color="indigo"
              size="xs"
              w={80}
              onClick={() => onSimulateOfferClick(offeredAmount, offeredEquity)}
            >
              Simulate Accepted Offer
            </Button>
          </>
        ) : (
          <Text size="sm" color="dimmed">
            Offer Rejected
          </Text>
        )}
      </Group>
    </Card>
  );
};

export default InvestmentOfferCard;
