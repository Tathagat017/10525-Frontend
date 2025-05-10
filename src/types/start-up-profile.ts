export type MarketSize = "small" | "medium" | "large";

export interface StartUpProfile {
  _id: string;
  founderId: string;
  startUpName: string;
  companyVision: string;
  productDescription: string;
  marketSize: MarketSize;
  businessModel: string;
  pitchPdf: string; // This will be a Cloudinary URL
  requestedFunding?: number;
  requestedEquity?: number;
}

export type StartUpProfilePayload = Omit<StartUpProfile, "_id">;
