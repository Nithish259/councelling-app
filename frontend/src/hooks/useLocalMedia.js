// import { useEffect, useRef, useState } from "react";

// const useLocalMedia = () => {
//   const videoRef = useRef(null);
//   const [stream, setStream] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const start = async () => {
//       try {
//         const media = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true, // 🔴 AUDIO ENABLED
//         });

//         setStream(media);

//         if (videoRef.current) {
//           videoRef.current.srcObject = media;
//         }
//       } catch (err) {
//         console.error(err);
//         setError(err.name);
//       }
//     };

//     start();

//     return () => {
//       stream?.getTracks().forEach((t) => t.stop());
//     };
//   }, []);

//   return { videoRef, stream, error };
// };

// export default useLocalMedia;
