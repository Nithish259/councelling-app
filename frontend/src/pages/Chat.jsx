import { useEffect, useRef, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../context/Context";

let socket;

const Chat = () => {
  const { appointmentId } = useParams();
  const { backendUrl, token, role, userId } = useContext(AppContext);

  const [appointment, setAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  /* LOAD APPOINTMENT */
  useEffect(() => {
    const fetchAppointment = async () => {
      const { data } = await axios.get(
        `${backendUrl}/api/appointments/${appointmentId}`,
        { headers: { token } },
      );
      if (data.status === "Success") setAppointment(data.appointment);
    };
    fetchAppointment();
  }, [appointmentId]);

  /* SOCKET INIT */
  useEffect(() => {
    if (!appointment) return;

    socket = io(backendUrl, { auth: { token } });

    socket.emit("join-chat", { appointmentId: appointment._id });

    socket.on("receive-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => socket.disconnect();
  }, [appointment]);

  /* LOAD CHAT HISTORY */
  useEffect(() => {
    if (!appointment) return;

    const fetchChat = async () => {
      const { data } = await axios.get(
        `${backendUrl}/api/chat/conversation/${appointment._id}`,
        { headers: { token } },
      );
      setMessages(data.messages || []);
    };

    fetchChat();
  }, [appointment]);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* SEND MESSAGE */
  const sendMessage = () => {
    if (!text.trim()) return;

    const payload = {
      appointmentId: appointment._id,
      senderId: userId,
      senderRole: role,
      message: text,
    };

    socket.emit("send-message", payload);
    setText("");
  };

  if (!appointment) {
    return (
      <div className="p-10 text-center text-gray-500">Loading chat...</div>
    );
  }

  const otherUser =
    role === "client" ? appointment.councellorId : appointment.clientId;

  return (
    <div className="flex flex-col h-screen mx-2 md:mx-24 sm:h-[80vh] bg-white sm:rounded-xl shadow sm:border border-gray-200">
      {/* HEADER */}
      <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-200">
        <img
          src={otherUser.image}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover"
          alt="user"
        />
        <div>
          <p className="font-semibold text-sm sm:text-base">{otherUser.name}</p>
          <p className="text-[11px] sm:text-xs text-gray-500">
            {role === "client" ? "Counsellor" : "Client"}
          </p>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-3 sm:py-4 space-y-2 sm:space-y-3 bg-gray-50">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === userId;

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[85%] sm:max-w-[70%] 
                  px-3 py-2 sm:px-4 sm:py-2.5 
                  rounded-2xl text-sm shadow
                  ${
                    isMe
                      ? "bg-indigo-600 text-white rounded-br-none"
                      : "bg-white text-gray-800 rounded-bl-none"
                  }
                `}
              >
                <p className="wrap-break-word">{msg.message}</p>
                <div
                  className={`text-[10px] mt-1 ${
                    isMe
                      ? "text-indigo-200 text-right"
                      : "text-gray-400 text-left"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 px-3 py-2 sm:px-4 sm:py-3 flex items-center gap-2 sm:gap-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 sm:py-2.5 border border-gray-300 rounded-full focus:outline-none text-sm"
        />
        <button
          onClick={sendMessage}
          className="flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-indigo-600 text-white text-sm hover:bg-indigo-700 active:scale-95 transition"
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
