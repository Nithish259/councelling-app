module.exports = (io) => {
  const rooms = new Map();

  io.on("connection", (socket) => {
    /* ---------------- JOIN ROOM ---------------- */
    socket.on("join-room", ({ roomId }) => {
      if (!roomId) return;

      if (!rooms.has(roomId)) rooms.set(roomId, []);
      const room = rooms.get(roomId);

      if (room.length >= 2) {
        socket.emit("room-full");
        return;
      }

      room.push(socket.id);
      socket.join(roomId);

      if (room.length === 2) {
        io.to(roomId).emit("ready", { caller: room[0] });
      }
    });

    /* ---------------- LEAVE ROOM ---------------- */
    socket.on("leave-room", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) return;

      rooms.set(
        roomId,
        room.filter((id) => id !== socket.id),
      );

      socket.leave(roomId);
      socket.to(roomId).emit("peer-left");

      if (rooms.get(roomId).length === 0) {
        rooms.delete(roomId);
      }
    });

    /* ---------------- WEBRTC SIGNALS ---------------- */
    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", candidate);
    });

    /* ---------------- TEMP SESSION CHAT ---------------- */
    socket.on("chat", ({ roomId, message, sender, timestamp }) => {
      socket.to(roomId).emit("chat", { message, sender, timestamp });
    });

    /* ---------------- DISCONNECT CLEANUP ---------------- */
    socket.on("disconnect", () => {
      for (const [roomId, room] of rooms.entries()) {
        if (room.includes(socket.id)) {
          rooms.set(
            roomId,
            room.filter((id) => id !== socket.id),
          );

          socket.to(roomId).emit("peer-left");

          if (rooms.get(roomId).length === 0) {
            rooms.delete(roomId);
          }
        }
      }
    });
  });
};
