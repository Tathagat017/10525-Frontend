export type InvestorFeedback = {
  investorId: string;
  teamScore: number; // 1–5
  productScore: number;
  marketScore: number;
  notes?: string;
};
