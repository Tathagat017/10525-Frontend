export type FundingRound = {
  _id: string;
  roundName: string;
  amount: number;
  equity: number;
  createdAt: string;
  offers: InvestmentOffer[];
  status: "active" | "finalized";
};

export type InvestmentOffer = {
  _id: string;
  investorName: string;
  investorId: string;
  founderId: string;
  offeredAmount: number;
  offeredEquity: number;
  message?: string;
  status: "pending" | "accepted" | "rejected";
  isNewOffer: boolean;
  lastUpdatedBy: {
    userId: string;
    role: "investor" | "founder";
    name: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type SimulatedCapTableData = {
  founderEquityBefore: number;
  founderEquityAfter: number;
  investors: {
    name: string;
    equity: number;
    amount: number;
  }[];
};

export type InvestmentOfferPayload = {
  investorId: string;
  investorName: string;
  founderId: string;
  offeredAmount: number;
  offeredEquity: number;
  message: string;
};
