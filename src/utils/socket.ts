// utils/socket.ts
import { io } from "socket.io-client";

const baseUrl = import.meta.env.VITE_API_BASE_URL; // Backend URL
const socket = io(baseUrl, { autoConnect: false }); // Backend URL

export default socket;
