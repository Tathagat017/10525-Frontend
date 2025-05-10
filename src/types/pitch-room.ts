export type ChatMessage = {
  _id: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export type PitchRoom = {
  _id: string;
  roomName: string;
  founderId: string;
  investorIds: string[];
  startTime: string;
  endTime: string;
  pitchPdf: string;
  offeredAmount: number;
  offeredEquity: number;
  status: string;
  chatMessages: ChatMessage[];
};
