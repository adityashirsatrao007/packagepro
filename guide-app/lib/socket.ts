import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3456";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(API_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function joinGuideRoom(guideId: string) {
  const s = getSocket();
  if (s.connected) {
    s.emit("guide:join", { guide_id: guideId });
  } else {
    s.on("connect", () => {
      s.emit("guide:join", { guide_id: guideId });
    });
  }
}

export function leaveGuideRoom() {
  if (socket) {
    socket.emit("guide:leave");
  }
}

export function onNewBooking(callback: (data: any) => void) {
  const s = getSocket();
  s.on("booking:new", callback);
  return () => s.off("booking:new", callback);
}

export function onBookingStatus(callback: (data: any) => void) {
  const s = getSocket();
  s.on("booking:status", callback);
  return () => s.off("booking:status", callback);
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
