import React, { useState } from "react";
import { SimpleGrid, Container, Loader } from "@mantine/core";
import InvestmentOfferCard from "./investment-offfer-card";
import CapSimulationModal, {
  CapSimulationModalHandle,
} from "../shared/cap-simulation-modal";
import NegotiateOfferModal, {
  NegotiateOfferModalHandle,
} from "../shared/negotiation-modal";
import { InvestmentOffer } from "../../types/funding";
import { useStore } from "../../hooks/use-store";
import { useQuery } from "@tanstack/react-query";
import {
  FinaliseChatRoomModalHandle,
  FinalizeChatRoomModal,
} from "../shared/finalise-pitch-room";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

const dummyInvestmentOffers: InvestmentOffer[] = [
  {
    _id: "offer1",
    investorName: "Alice Capital",
    investorId: "inv123",
    founderId: "founder456",
    offeredAmount: 500000,
    offeredEquity: 10,
    message: "We believe in your vision and are excited to partner with you.",
    status: "pending",
    isNewOffer: true,
    lastUpdatedBy: {
      userId: "inv123",
      role: "investor",
      name: "Alice Kapoor",
    },
    createdAt: "2025-05-01T10:00:00.000Z",
    updatedAt: "2025-05-01T10:00:00.000Z",
  },
  {
    _id: "offer2",
    investorName: "NextWave Ventures",
    investorId: "inv789",
    founderId: "founder456",
    offeredAmount: 750000,
    offeredEquity: 12,
    message: "Let’s revolutionize the market together.",
    status: "accepted",
    isNewOffer: false,
    lastUpdatedBy: {
      userId: "founder456",
      role: "founder",
      name: "Tathagat",
    },
    createdAt: "2025-04-28T15:30:00.000Z",
    updatedAt: "2025-04-30T09:45:00.000Z",
  },
  {
    _id: "offer3",
    investorName: "BlueSeed Angels",
    investorId: "inv456",
    founderId: "founder789",
    offeredAmount: 1000000,
    offeredEquity: 18,
    message: "Strong potential in your space, let’s connect soon.",
    status: "rejected",
    isNewOffer: false,
    lastUpdatedBy: {
      userId: "founder789",
      role: "founder",
      name: "Sara Dev",
    },
    createdAt: "2025-04-20T08:00:00.000Z",
    updatedAt: "2025-04-25T11:00:00.000Z",
  },
  {
    _id: "offer4",
    investorName: "BrightMind Capital",
    investorId: "inv321",
    founderId: "founder456",
    offeredAmount: 300000,
    offeredEquity: 7,
    message: "Small ticket, high support. Let’s talk growth.",
    status: "pending",
    isNewOffer: true,
    lastUpdatedBy: {
      userId: "inv321",
      role: "investor",
      name: "Rajiv Mehta",
    },
    createdAt: "2025-05-03T14:10:00.000Z",
    updatedAt: "2025-05-03T14:10:00.000Z",
  },
];

export const FundingSimulationBottomPanel = () => {
  const capSimulationModalRef = React.useRef<CapSimulationModalHandle>(null);
  const NegotiateOfferModalRef = React.useRef<NegotiateOfferModalHandle>(null);
  const finaliseChatRoomRef = React.useRef<FinaliseChatRoomModalHandle>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [investmentOffers, setInvestmentOffers] = useState<InvestmentOffer[]>(
    []
  );

  const { investmentOfferStore } = useStore();

  const { isLoading } = useQuery({
    queryKey: ["investment-offers"],
    queryFn: async () => {
      const result = await investmentOfferStore.fetchOffersForCurrentUser();
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      setInvestmentOffers(data);
    },
  });

  const handleSimulateOfferClick = (
    offeredAmount: number,
    offeredEquity: number
  ) => {
    if (capSimulationModalRef.current) {
      capSimulationModalRef.current.showModal(offeredAmount, offeredEquity);
    }
  };

  const handleNegotiateOfferClick = (
    offeredAmount: number,
    offeredEquuity: number,
    offerId: string
  ) => {
    if (NegotiateOfferModalRef.current) {
      NegotiateOfferModalRef.current.showModal(
        offeredAmount,
        offeredEquuity,
        offerId
      );
    }
  };

  const handleFinaliseClick = () => {
    if (finaliseChatRoomRef.current) {
      finaliseChatRoomRef.current.show();
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <Container w={"100%"} p="lg" style={{ overflowX: "hidden" }}>
      <CapSimulationModal ref={capSimulationModalRef} />
      <NegotiateOfferModal ref={NegotiateOfferModalRef} />
      <FinalizeChatRoomModal
        ref={finaliseChatRoomRef}
        onInvite={() => {
          notifications.show({
            title: "Chat invite created",
            message: "Investor invited for pitch",
            color: "green",
          });
        }}
      />
      <SimpleGrid cols={1} spacing="lg">
        {dummyInvestmentOffers.map((offer, idx) => (
          <InvestmentOfferCard
            key={idx}
            founderId={offer.founderId}
            investorId={offer.investorId}
            status={offer.status}
            _id={offer._id}
            createdAt={offer.createdAt}
            isNewOffer={offer.isNewOffer}
            lastUpdatedBy={offer.lastUpdatedBy}
            updatedAt={offer.updatedAt}
            investorName={offer.investorName}
            offeredAmount={offer.offeredAmount}
            offeredEquity={offer.offeredEquity}
            offerId={offer._id}
            message={offer.message}
            onFinaliseClick={handleFinaliseClick}
            onSimulateOfferClick={handleSimulateOfferClick}
            onNegotiateOfferClick={handleNegotiateOfferClick}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default FundingSimulationBottomPanel;
