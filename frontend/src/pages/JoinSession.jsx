import { useEffect, useRef, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { AppContext } from "../context/Context";

const ICE = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export default function JoinSession() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, token, role } = useContext(AppContext);

  const socketRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const iceQueue = useRef([]);
  const saveTimer = useRef(null);
  const chatEndRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [notes, setNotes] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [callTime, setCallTime] = useState(0);
  const [typingUser, setTypingUser] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [networkQuality, setNetworkQuality] = useState("Good");

  useEffect(() => {
    const interval = setInterval(() => setCallTime((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const h = String(Math.floor(callTime / 3600)).padStart(2, "0");
    const m = String(Math.floor((callTime % 3600) / 60)).padStart(2, "0");
    const s = String(callTime % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  /* SOCKET */
  useEffect(() => {
    if (!token) return;
    socketRef.current = io(backendUrl, { auth: { token } });
    return () => socketRef.current.disconnect();
  }, [token]);

  /* WEBRTC */
  useEffect(() => {
    if (!socketRef.current) return;
    let localStream;
    let peer;

    const start = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = localStream;

      peer = new RTCPeerConnection(ICE);
      peerRef.current = peer;
      localStream.getTracks().forEach((t) => peer.addTrack(t, localStream));

      peer.ontrack = (e) => (remoteVideoRef.current.srcObject = e.streams[0]);

      peer.onicecandidate = (e) => {
        if (e.candidate)
          socketRef.current.emit("ice-candidate", {
            roomId,
            candidate: e.candidate,
          });
      };

      socketRef.current.emit("join-room", { roomId });

      socketRef.current.on("ready", async ({ caller }) => {
        if (socketRef.current.id === caller) {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socketRef.current.emit("offer", { roomId, offer });
        }
      });

      socketRef.current.on("offer", async (offer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        while (iceQueue.current.length)
          await peer.addIceCandidate(iceQueue.current.shift());
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socketRef.current.emit("answer", { roomId, answer });
      });

      socketRef.current.on("answer", async (answer) => {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
        while (iceQueue.current.length)
          await peer.addIceCandidate(iceQueue.current.shift());
      });

      socketRef.current.on("ice-candidate", async (candidate) => {
        if (peer.remoteDescription)
          await peer.addIceCandidate(new RTCIceCandidate(candidate));
        else iceQueue.current.push(candidate);
      });

      socketRef.current.on("chat", ({ message, sender, timestamp }) =>
        setMessages((prev) => [...prev, { message, sender, timestamp }]),
      );

      socketRef.current.on("peer-left", endSession);
    };

    start();

    return () => {
      localStream?.getTracks().forEach((t) => t.stop());
      peer?.close();
      socketRef.current?.emit("leave-room", { roomId });
      socketRef.current?.removeAllListeners();
    };
  }, [roomId, token]);

  /* NOTES LOAD + SAVE */
  useEffect(() => {
    if (role !== "councellor") return;
    axios
      .get(`${backendUrl}/api/session-notes/${roomId}`, { headers: { token } })
      .then((res) => {
        if (res.data?.note) {
          setNotes(res.data.note.notes || "");
          setAttachments(res.data.note.attachments || []);
        }
      });
  }, [roomId, role]);

  useEffect(() => {
    if (role !== "councellor") return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      axios.post(
        `${backendUrl}/api/session-notes/${roomId}`,
        { notes },
        { headers: { token } },
      );
    }, 800);
    return () => clearTimeout(saveTimer.current);
  }, [notes]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);
    const res = await axios.post(
      `${backendUrl}/api/session-notes/${roomId}/attachment`,
      formData,
      {
        headers: { token, "Content-Type": "multipart/form-data" },
      },
    );
    setAttachments((p) => [...p, res.data.attachment]);
    setUploading(false);
  };

  const toggleMic = () => {
    const track = localVideoRef.current.srcObject.getAudioTracks()[0];
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  };

  const toggleCamera = () => {
    const track = localVideoRef.current.srcObject.getVideoTracks()[0];
    track.enabled = !track.enabled;
    setCamOn(track.enabled);
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    const msg = {
      roomId,
      message: text,
      sender: socketRef.current.id,
      timestamp: new Date(),
    };
    socketRef.current.emit("chat", msg);
    setMessages((p) => [...p, msg]);
    setText("");
  };

  const endSession = () => {
    peerRef.current?.close();
    socketRef.current?.emit("leave-room", { roomId });
    navigate("/");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeTab]);

  return (
    <div className="h-screen bg-[#0a0f1f] text-gray-200 flex">
      {/* VIDEO AREA */}
      <div className="flex-1 relative overflow-hidden">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />

        <div className="absolute bottom-24 right-6 rounded-xl overflow-hidden shadow-lg border border-white/10">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-48 h-32 object-cover"
          />
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
          <ControlButton
            icon={micOn ? "fa-microphone" : "fa-microphone-slash"}
            onClick={toggleMic}
            active={micOn}
          />
          <ControlButton
            icon={camOn ? "fa-video" : "fa-video-slash"}
            onClick={toggleCamera}
            active={camOn}
          />
          <button
            onClick={endSession}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-600 hover:bg-red-700"
          >
            <i className="fa-solid fa-phone-slash text-white" />
          </button>
        </div>
      </div>

      {/* SIDE PANEL */}
      <div className="w-96 bg-[#0b1228] border-l border-white/5 flex flex-col">
        <div className="flex border-b border-white/10">
          {role === "councellor" && (
            <TabButton
              label="Notes"
              icon="fa-note-sticky"
              active={activeTab === "notes"}
              onClick={() => setActiveTab("notes")}
            />
          )}
          <TabButton
            label="Chat"
            icon="fa-comments"
            active={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
            full={!role || role !== "councellor"}
          />
        </div>

        {activeTab === "notes" && role === "councellor" && (
          <div className="flex-1 p-5 space-y-4 overflow-y-auto">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-48 resize-none rounded-xl bg-white/5 border border-white/10 p-4"
            />
            <input type="file" onChange={handleFileUpload} />
            {uploading && <p className="text-xs text-gray-400">Uploading...</p>}
            {attachments.map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noreferrer"
                className="block text-sm text-blue-400"
              >
                {a.originalName}
              </a>
            ))}
          </div>
        )}

        {activeTab === "chat" && (
          <>
            <div className="flex-1 p-5 space-y-3 overflow-y-auto">
              {messages.map((m, i) => {
                const isMe = m.sender === socketRef.current?.id;
                return (
                  <div
                    key={i}
                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isMe ? "bg-blue-600 text-white" : "bg-white/10 text-gray-200"}`}
                    >
                      {m.message}
                    </div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-white/10">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="w-full rounded-full bg-white/5 border border-white/10 px-5 py-3"
                placeholder="Type a message…"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const ControlButton = ({ icon, onClick, active }) => (
  <button
    onClick={onClick}
    className={`w-12 h-12 flex items-center justify-center rounded-full ${active ? "bg-white/10" : "bg-white/5"}`}
  >
    <i className={`fa-solid ${icon}`} />
  </button>
);

const TabButton = ({ label, icon, active, onClick, full }) => (
  <button
    onClick={onClick}
    className={`${full ? "w-full" : "w-1/2"} py-4 flex items-center justify-center gap-2 text-sm ${active ? "text-white border-b-2 border-blue-500" : "text-gray-400"}`}
  >
    <i className={`fa-regular ${icon}`} /> {label}
  </button>
);
