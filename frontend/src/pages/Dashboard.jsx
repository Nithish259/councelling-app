import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/Context";
import { Users, Calendar, Clock, IndianRupee, FileText } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#ef4444"];

export default function CouncellorDashboard() {
  const { backendUrl, token } = useContext(AppContext);
  const [data, setData] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/councellor/dashboard`, {
        headers: { token },
      })
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <DashboardSkeleton />;

  const { stats, todayAppointments, recentAppointments, recentNotes } = data;

  const pieData = [
    { name: "Completed", value: stats.completedSessions },
    { name: "Upcoming", value: stats.upcomingSessions },
    {
      name: "Cancelled",
      value:
        stats.totalAppointments -
        stats.completedSessions -
        stats.upcomingSessions,
    },
  ];

  return (
    <div className="min-h-screen bg-white from-p-8 space-y-10">
      {/* HERO */}
      <div
        className="bg-white rounded-3xl border border-gray-300
       p-8"
      >
        <h1 className="text-3xl font-semibold text-gray-800">
          Good to see you 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Here’s how your practice is doing today
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <HeroStat
            icon={<Users />}
            label="Active Clients"
            value={stats.totalClients}
            hint="Patients you are currently supporting"
          />
          <HeroStat
            icon={<Calendar />}
            label="Total Sessions"
            value={stats.totalAppointments}
            hint="All sessions conducted"
          />
          <HeroStat
            icon={<Clock />}
            label="Upcoming"
            value={stats.upcomingSessions}
            hint="Scheduled sessions ahead"
          />
          <HeroStat
            icon={<IndianRupee />}
            label="Earnings"
            value={`₹${stats.totalEarnings}`}
            hint="Lifetime platform earnings"
          />
        </div>
      </div>

      {/* INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <InsightCard>
          <h3 className="font-medium text-gray-700">Session Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Visual breakdown of your sessions
          </p>

          <div className="h-56 mt-6">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <Legend />
        </InsightCard>

        <InsightCard className="lg:col-span-2">
          <SectionTitle>Today’s Sessions</SectionTitle>

          {todayAppointments.length === 0 ? (
            <Empty text="You have no sessions today" />
          ) : (
            todayAppointments.map((a) => (
              <AppointmentRow key={a._id} appt={a} />
            ))
          )}
        </InsightCard>
      </div>

      {/* RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <InsightCard>
          <SectionTitle>Recent Appointments</SectionTitle>
          {recentAppointments.map((a) => (
            <CompactRow key={a._id} appt={a} />
          ))}
        </InsightCard>

        <InsightCard>
          <SectionTitle>Session Notes</SectionTitle>
          {recentNotes.length === 0 ? (
            <Empty text="No notes recorded yet" />
          ) : (
            recentNotes.map((note) => <NoteCard key={note._id} note={note} />)
          )}
        </InsightCard>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function HeroStat({ icon, label, value, hint }) {
  return (
    <div
      className="p-6 rounded-2xl bg-linear-to-b from-gray-100 to-white border border-gray-300
    "
    >
      <div className="flex items-center gap-3 text-gray-600">
        <div className="text-gray-800">{icon}</div>
        <p className="font-bold">{label}</p>
      </div>
      <p className="text-3xl font-semibold text-gray-800 mt-4">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

function InsightCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-300
         p-6 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return <h2 className="text-lg font-medium text-gray-800 mb-4">{children}</h2>;
}

function AppointmentRow({ appt }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-300 last:border-none">
      <div>
        <p className="font-medium text-gray-800">{appt.clientId.name}</p>
        <p className="text-sm text-gray-500">{appt.slotTime}</p>
      </div>
      <StatusBadge status={appt.status} />
    </div>
  );
}

function CompactRow({ appt }) {
  return (
    <div className="flex justify-between py-3 border-b border-gray-300 last:border-none">
      <p className="text-sm text-gray-700">{appt.clientId.name}</p>
      <StatusBadge status={appt.status} />
    </div>
  );
}

function NoteCard({ note }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl mb-3">
      <div className="flex items-center gap-2 text-gray-600">
        <FileText className="w-4 h-4" />
        <p className="text-sm font-medium">{note.client?.name || "Client"}</p>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.notes}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Legend() {
  return (
    <div className="flex justify-between text-xs text-gray-500 mt-4">
      <span className="flex gap-2 items-center">
        <i className="w-2 h-2 bg-green-500 rounded-full" /> Completed
      </span>
      <span className="flex gap-2 items-center">
        <i className="w-2 h-2 bg-blue-500 rounded-full" /> Upcoming
      </span>
      <span className="flex gap-2 items-center">
        <i className="w-2 h-2 bg-red-500 rounded-full" /> Cancelled
      </span>
    </div>
  );
}

function Empty({ text }) {
  return <p className="text-sm text-gray-500">{text}</p>;
}

function DashboardSkeleton() {
  return <div className="p-8 text-gray-400">Loading your workspace…</div>;
}
