export interface Investor {
  _id: string;
  fullName: string;
  email: string;
  profilePictureUrl?: string;
  bio?: string;
  industriesInterestedIn: string[];
  createdAt: string;
  updatedAt: string;
}
