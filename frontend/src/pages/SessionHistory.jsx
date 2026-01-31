import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Context";

const formatDuration = (seconds) => {
  if (!seconds) return "Not recorded";
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m} min ${s} sec`;
};

export default function SessionHistory() {
  const { backendUrl, token, role } = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/session/history`, { headers: { token } })
      .then((res) => {
        if (res.data.status === "Success") {
          setSessions(res.data.history);
        }
      })
      .finally(() => setLoading(false));
  }, [sessions]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <i className="fa-solid fa-spinner animate-spin mr-2" />
        Loading sessions
      </div>
    );
  }

  if (!sessions.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-400 text-center px-4">
        <i className="fa-regular fa-calendar-xmark text-4xl mb-4" />
        <p>No completed sessions</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 space-y-10 md:space-y-12">
        {/* HEADER */}
        <header className="space-y-2 text-center md:text-left">
          <h1 className="text-2xl md:text-4xl font-semibold tracking-tight text-gray-900">
            Session History
          </h1>
          <p className="text-gray-500 text-sm md:text-lg">
            A confidential record of completed consultations
          </p>
        </header>

        {/* SESSIONS */}
        <section className="space-y-6 md:space-y-10">
          {sessions.map((session) => {
            const person =
              role === "client" ? session.councellor : session.client;

            return (
              <article
                key={session._id}
                className="bg-white rounded-2xl px-5 py-6 md:px-8 md:py-7 shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              >
                {/* TOP */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                    />
                    <div className="space-y-1">
                      <p className="text-lg md:text-xl font-medium text-gray-900">
                        {person.name}
                      </p>
                      <p className="text-xs md:text-sm text-gray-400">
                        {role === "client" ? "Licensed Counsellor" : "Client"}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs uppercase tracking-wide text-gray-400">
                    Completed
                  </span>
                </div>

                {/* META */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 text-sm">
                  <Meta
                    icon="fa-hashtag"
                    label="Session ID"
                    value={session.roomId}
                  />
                  <Meta
                    icon="fa-calendar"
                    label="Date"
                    value={
                      session.date
                        ? new Date(session.date).toLocaleDateString()
                        : "N/A"
                    }
                  />
                  <Meta
                    icon="fa-clock"
                    label="Duration"
                    value={formatDuration(session.duration)}
                  />
                </div>

                {/* NOTES */}
                {role === "councellor" && (
                  <>
                    <div className="mt-6 border-t border-gray-100" />

                    <button
                      onClick={() =>
                        setExpanded(
                          expanded === session._id ? null : session._id,
                        )
                      }
                      className="mt-4 flex items-center justify-between w-full text-left text-gray-600 hover:text-gray-900 transition"
                    >
                      <span className="flex items-center gap-2 text-sm">
                        <i className="fa-regular fa-note-sticky" />
                        Session notes
                      </span>
                      <i
                        className={`fa-solid fa-chevron-down transition-transform ${
                          expanded === session._id ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {expanded === session._id && (
                      <div className="mt-5 space-y-4">
                        <p className="text-gray-700 leading-relaxed text-sm md:text-[15px]">
                          {session.notes || (
                            <span className="italic text-gray-400">
                              No notes recorded for this session
                            </span>
                          )}
                        </p>

                        {session.attachments?.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {session.attachments.map((file, i) => (
                              <a
                                key={i}
                                href={file.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-full border text-xs md:text-sm text-gray-600 hover:bg-gray-50"
                              >
                                <i className="fa-regular fa-file-pdf" />
                                {file.originalName}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </article>
            );
          })}
        </section>
      </div>
    </div>
  );
}

const Meta = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <i className={`fa-solid ${icon} text-gray-300 mt-1`} />
    <div>
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="font-medium text-gray-800 text-sm md:text-base wrap-break-word">
        {value}
      </p>
    </div>
  </div>
);
