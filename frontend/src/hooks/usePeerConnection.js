// import { useEffect, useRef } from "react";
// import { socket } from "../socket/socket";

// const ICE_SERVERS = {
//   iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
// };

// const usePeerConnection = (localStream, roomId) => {
//   const peerRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const iceQueue = useRef([]);

//   useEffect(() => {
//     if (!localStream || !roomId) return;

//     const peer = new RTCPeerConnection(ICE_SERVERS);
//     peerRef.current = peer;

//     localStream
//       .getTracks()
//       .forEach((track) => peer.addTrack(track, localStream));

//     peer.ontrack = (e) => {
//       console.log("🎥 ONTRACK fired", e.streams);
//       remoteVideoRef.current.srcObject = e.streams[0];
//     };

//     peer.onicecandidate = (e) => {
//       if (e.candidate) {
//         console.log("🧊 ICE candidate sent");
//         socket.emit("ice-candidate", { roomId, candidate: e.candidate });
//       }
//     };

//     socket.on("ready", async ({ caller }) => {
//       if (socket.id === caller) {
//         console.log("I am caller → creating offer");

//         const offer = await peer.createOffer();
//         await peer.setLocalDescription(offer);
//         socket.emit("offer", { roomId, offer });
//       }
//     });

//     socket.on("offer", async (offer) => {
//       console.log("📩 OFFER RECEIVED");
//       await peer.setRemoteDescription(offer);

//       const answer = await peer.createAnswer();
//       await peer.setLocalDescription(answer);
//       socket.emit("answer", { roomId, answer });

//       iceQueue.current.forEach((c) => peer.addIceCandidate(c));
//       iceQueue.current = [];
//     });

//     socket.on("answer", async (answer) => {
//       console.log("📩 ANSWER RECEIVED");
//       await peer.setRemoteDescription(answer);

//       iceQueue.current.forEach((c) => peer.addIceCandidate(c));
//       iceQueue.current = [];
//     });

//     socket.on("ice-candidate", async (candidate) => {
//       if (peer.remoteDescription) {
//         console.log("🧊 ICE candidate received");
//         await peer.addIceCandidate(candidate);
//       } else {
//         iceQueue.current.push(candidate);
//       }
//     });

//     return () => peer.close();
//   }, [localStream, roomId]);

//   return { remoteVideoRef };
// };

// export default usePeerConnection;
