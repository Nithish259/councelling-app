import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/Context";

const AppointmentDetail = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const { backendUrl, token, role } = useContext(AppContext);

  const [appointment, setAppointment] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [canJoin, setCanJoin] = useState(false);

  const handleJoinSession = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/session/create`,
        { appointmentId },
        { headers: { token } },
      );

      if (data.status !== "Success") return;

      const roomId = data.session.roomId;

      await axios.get(`${backendUrl}/api/session/join/${roomId}`, {
        headers: { token },
      });

      navigate(`/session/${roomId}/join`);
    } catch (error) {
      console.error("Failed to create/join session", error);
    }
  };

  const fetchAppointment = async () => {
    const { data } = await axios.get(
      `${backendUrl}/api/appointments/${appointmentId}`,
      { headers: { token } },
    );

    if (data.status === "Success") setAppointment(data.appointment);
  };

  useEffect(() => {
    fetchAppointment();
  }, []);

  useEffect(() => {
    if (!appointment) return;

    const interval = setInterval(() => {
      const sessionTime = new Date(
        `${appointment.slotDate} ${appointment.slotTime}`,
      );
      const now = new Date();
      const diff = sessionTime - now;

      if (diff <= 5 * 60 * 1000) {
        setCanJoin(true);
        setTimeLeft("Session is ready to join");
        clearInterval(interval);
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [appointment]);

  if (!appointment) return null;

  const otherPerson =
    role === "client" ? appointment.councellorId : appointment.clientId;

  const isSessionCompleted = appointment.status === "completed";
  const isJoinDisabled = !canJoin || isSessionCompleted;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-cyan-50 py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 md:px-6">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
          {/* HEADER */}
          <div className="px-5 py-5 md:px-8 md:py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-linear-to-r from-blue-600 to-cyan-600 text-white">
            <div className="flex items-center gap-3">
              <img
                src={otherPerson.image}
                alt={otherPerson.name}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-4 ring-white/30"
              />
              <div>
                <h2 className="text-lg md:text-xl font-semibold">
                  {otherPerson.name}
                </h2>
                <p className="text-xs md:text-sm opacity-90">
                  {role === "client" ? "Assigned Counselor" : "Client"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate(`/chat/${appointment._id}`)}
              className="w-full sm:w-auto justify-center text-white text-sm font-medium bg-green-600 px-4 py-2.5 rounded-lg flex items-center gap-2"
            >
              <i className="fa-solid fa-message"></i>
              <span>Chat</span>
            </button>
          </div>

          {/* BODY */}
          <div className="px-5 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
            {/* SESSION META */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Session Date
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                  {appointment.slotDate}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 p-4 md:p-5 bg-white">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Session Time
                </p>
                <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">
                  {appointment.slotTime}
                </p>
              </div>
            </div>

            {/* STATUS */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium capitalize w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {appointment.status}
              </span>

              <span className="text-xs sm:text-sm text-gray-500">
                Appointment ID: {appointment.meetingRoomId || "—"}
              </span>
            </div>

            {/* COUNTDOWN */}
            <div className="text-center border border-dashed border-blue-300 rounded-2xl py-6 md:py-8 px-3 bg-blue-50">
              <p className="text-sm text-blue-600 font-medium">
                Session Availability
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 wrap-break-word">
                {timeLeft}
              </p>
            </div>

            {/* CTA */}
            <button
              disabled={isJoinDisabled}
              onClick={handleJoinSession}
              className={`w-full py-3.5 md:py-4 rounded-xl text-sm md:text-base font-semibold transition-all duration-300 ${
                !isJoinDisabled
                  ? "bg-linear-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:scale-[1.01]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isSessionCompleted ? "Session Completed" : "Join Secure Session"}
            </button>

            {!canJoin && !isSessionCompleted && (
              <p className="text-center text-xs text-gray-400 px-4">
                You can join the session 5 minutes before the scheduled time
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
