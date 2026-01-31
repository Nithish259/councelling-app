import { useEffect, useState, useContext, memo } from "react";
import axios from "axios";
import { AppContext } from "../context/Context";
import { Users, Calendar, Clock, IndianRupee, FileText } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

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
  }, [backendUrl, token]);

  if (!data) return <DashboardSkeleton />;

  const { stats, todayAppointments, recentAppointments, recentNotes } = data;

  const sortedToday = [...todayAppointments].sort((a, b) =>
    a.slotTime.localeCompare(b.slotTime),
  );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
      {/* HERO */}
      <div className="bg-white rounded-3xl border border-gray-200 p-5 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          Good to see you 👋
        </h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Here’s how your practice is doing today
        </p>

        <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent my-5 sm:my-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* PIE */}
        <InsightCard className="xl:col-span-1">
          <h3 className="font-medium text-gray-700">Session Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Visual breakdown of your sessions
          </p>

          <div className="h-44 sm:h-56 mt-6 relative">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xl sm:text-2xl font-semibold text-gray-800">
                {stats.totalAppointments}
              </p>
              <p className="text-xs text-gray-500">Total Sessions</p>
            </div>
          </div>

          <Legend />
        </InsightCard>

        {/* LINE */}
        <InsightCard className="md:col-span-2 xl:col-span-2">
          <h3 className="font-medium text-gray-700">Sessions This Week</h3>
          <p className="text-sm text-gray-500 mt-1">
            Daily completed session trend
          </p>

          <div className="h-44 sm:h-56 mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.weeklySessions}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </InsightCard>

        {/* TODAY */}
        <InsightCard className="md:col-span-2 xl:col-span-1">
          <SectionTitle>Today’s Sessions</SectionTitle>

          {sortedToday.length === 0 ? (
            <Empty text="You have no sessions today" icon={<Calendar />} />
          ) : (
            sortedToday.map((a) => <AppointmentRow key={a._id} appt={a} />)
          )}
        </InsightCard>
      </div>

      {/* RECENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InsightCard>
          <SectionTitle>Recent Appointments</SectionTitle>
          {recentAppointments.map((a) => (
            <CompactRow key={a._id} appt={a} />
          ))}
        </InsightCard>

        <InsightCard>
          <SectionTitle>Session Notes</SectionTitle>
          {recentNotes.length === 0 ? (
            <Empty text="No notes recorded yet" icon={<FileText />} />
          ) : (
            recentNotes.map((note) => <NoteCard key={note._id} note={note} />)
          )}
        </InsightCard>
      </div>
    </div>
  );
}

/* COMPONENTS */

function HeroStat({ icon, label, value, hint }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-2 text-gray-600">
        <div className="text-gray-800">{icon}</div>
        <p className="font-semibold text-sm sm:text-base">{label}</p>
      </div>
      <p className="text-2xl sm:text-3xl font-semibold text-gray-800 mt-3 sm:mt-4">
        {value}
      </p>
      <p className="text-xs text-gray-500 mt-1">{hint}</p>
    </div>
  );
}

function InsightCard({ children, className = "" }) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200 p-4 sm:p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-4">
      {children}
    </h2>
  );
}

const AppointmentRow = memo(({ appt }) => (
  <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-200 last:border-none">
    <div>
      <p className="font-medium text-gray-800 text-sm sm:text-base">
        {appt.clientId.name}
      </p>
      <p className="text-xs sm:text-sm text-gray-500">{appt.slotTime}</p>
    </div>
    <StatusBadge status={appt.status} />
  </div>
));

const CompactRow = memo(({ appt }) => (
  <div className="flex justify-between py-3 border-b border-gray-200 last:border-none text-sm">
    <p className="text-gray-700">{appt.clientId.name}</p>
    <StatusBadge status={appt.status} />
  </div>
));

const NoteCard = memo(({ note }) => (
  <div className="p-4 bg-gray-50 rounded-xl mb-3">
    <div className="flex items-center gap-2 text-gray-600">
      <FileText className="w-4 h-4" />
      <p className="text-sm font-medium">{note.client?.name || "Client"}</p>
    </div>
    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{note.notes}</p>
  </div>
));

function StatusBadge({ status }) {
  const map = {
    completed: "bg-green-100 text-green-700",
    upcoming: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${map[status]}`}
    >
      {status}
    </span>
  );
}

function Legend() {
  return (
    <div className="flex flex-wrap justify-between text-xs text-gray-500 mt-4 gap-y-2">
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

function Empty({ text, icon }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
      <div className="mb-2 opacity-40">{icon}</div>
      <p className="text-sm">{text}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      <div className="h-28 bg-gray-200 rounded-2xl" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
        <div className="h-20 bg-gray-200 rounded-xl" />
      </div>
    </div>
  );
}
