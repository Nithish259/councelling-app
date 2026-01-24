const Message = require("./../models/messageModel");
const Conversation = require("./../models/conversationModel");

module.exports = (io) => {
  io.on("connection", (socket) => {
    /* ---------------- JOIN CHAT ---------------- */
    socket.on("join-chat", async ({ appointmentId }) => {
      try {
        const conversation = await Conversation.findOne({ appointmentId });
        if (conversation) {
          socket.join(conversation._id.toString());
        }
      } catch (err) {
        console.error("Join chat error:", err);
      }
    });

    /* ---------------- SEND MESSAGE ---------------- */
    socket.on("send-message", async ({ appointmentId, message }) => {
      try {
        const conversation = await Conversation.findOne({ appointmentId });
        if (!conversation) return;

        const newMessage = await Message.create({
          conversationId: conversation._id,
          senderId: socket.userId,
          senderRole: socket.role,
          message,
        });

        conversation.lastMessage = message;
        await conversation.save();

        io.to(conversation._id.toString()).emit("receive-message", newMessage);
      } catch (err) {
        console.error("Chat send error:", err);
      }
    });
  });
};
