import { Server as SocketIOServer, Socket } from "socket.io";

interface BookingNotification {
  booking_id: string;
  package_name: string;
  city_name: string;
  traveler_name: string;
  start_date: string;
  end_date: string;
  total_price: string;
  currency: string;
  status: string;
  guide_id: string;
}

export function initializeBookingsSocket(io: SocketIOServer) {
  const guideSockets = new Map<string, Set<string>>();
  const socketGuideMap = new Map<string, string>(); // socketId -> guide_id

  io.on("connection", (socket: Socket) => {
    console.log("[Socket.io] Client connected:", socket.id);

    socket.on("guide:join", (data: { guide_id: string }) => {
      const { guide_id } = data;
      if (!guideSockets.has(guide_id)) {
        guideSockets.set(guide_id, new Set());
      }
      guideSockets.get(guide_id)!.add(socket.id);
      socketGuideMap.set(socket.id, guide_id);
      console.log(`[Socket.io] Guide ${guide_id} joined (socket: ${socket.id})`);
    });

    socket.on("guide:leave", () => {
      const guideId = socketGuideMap.get(socket.id);
      if (guideId && guideSockets.has(guideId)) {
        guideSockets.get(guideId)!.delete(socket.id);
      }
      socketGuideMap.delete(socket.id);
    });

    socket.on("booking:new", (notification: BookingNotification) => {
      const guideId = notification.guide_id;
      const guideSocketIds = guideSockets.get(guideId);
      if (guideSocketIds) {
        for (const sid of guideSocketIds) {
          io.to(sid).emit("booking:new", notification);
        }
        console.log(`[Socket.io] New booking ${notification.booking_id} sent to guide ${guideId}`);
      }
    });

    socket.on("booking:status", (data: { booking_id: string; status: string; guide_id: string }) => {
      const guideSocketIds = guideSockets.get(data.guide_id);
      if (guideSocketIds) {
        for (const sid of guideSocketIds) {
          io.to(sid).emit("booking:status", data);
        }
      }
    });

    socket.on("disconnect", () => {
      const guideId = socketGuideMap.get(socket.id);
      if (guideId && guideSockets.has(guideId)) {
        guideSockets.get(guideId)!.delete(socket.id);
      }
      socketGuideMap.delete(socket.id);
      console.log("[Socket.io] Client disconnected:", socket.id);
    });
  });
}
