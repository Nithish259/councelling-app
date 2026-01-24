import { useContext, useEffect } from "react";
import { AppContext } from "../context/Context";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, IndianRupee } from "lucide-react";

const statusStyles = {
  upcoming: "text-emerald-700 bg-emerald-50",
  completed: "text-slate-700 bg-slate-100",
  cancelled: "text-rose-700 bg-rose-50",
};

const statusAccent = {
  upcoming: "from-emerald-400 to-emerald-600",
  completed: "from-slate-300 to-slate-400",
  cancelled: "from-rose-400 to-rose-600",
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const MyAppointments = () => {
  const { appointments, loadAppointments, role } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* HEADER */}
        <div className="mb-6 md:mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
            Your Appointments
          </h2>
          <p className="text-gray-500 text-sm md:text-base mt-1">
            Manage your counseling sessions & payments
          </p>
        </div>

        {/* EMPTY STATE */}
        {appointments.length === 0 ? (
          <div className="mt-20 md:mt-32 flex flex-col items-center text-center px-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-100 flex items-center justify-center mb-5 text-2xl md:text-3xl">
              📅
            </div>
            <p className="text-gray-800 font-medium">No appointments yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Book a session to begin your journey
            </p>
          </div>
        ) : (
          /* LIST */
          <div className="space-y-5 md:space-y-6">
            {appointments.map((item) => {
              const counselor =
                role === "client" ? item.councellorId : item.clientId;

              return (
                <div
                  key={item._id}
                  onClick={() => navigate(`/appointmentDetail/${item._id}`)}
                  className="relative bg-white rounded-2xl md:rounded-3xl border overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* STATUS ACCENT STRIP */}
                  <div
                    className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${statusAccent[item.status]}`}
                  />

                  <div className="p-5 md:p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    {/* TOP PROFILE */}
                    <div className="flex items-center gap-4">
                      <img
                        src={counselor?.image}
                        alt={counselor?.name}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-4 ring-white shadow-md"
                      />

                      <div>
                        <p className="text-base md:text-lg font-semibold text-gray-900">
                          {counselor?.name}
                        </p>

                        {counselor?.speciality && (
                          <p className="text-sm text-gray-500">
                            {counselor.speciality}
                          </p>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          Booked on {formatDate(item.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* DATE & TIME */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 md:justify-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{item.slotDate}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{item.slotTime}</span>
                      </div>
                    </div>

                    {/* STATUS + PAYMENT */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusStyles[item.status]}`}
                      >
                        {item.status}
                      </span>

                      {item.amount && (
                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-xl border">
                          <img
                            src="https://razorpay.com/assets/razorpay-glyph.svg"
                            alt="Razorpay"
                            className="w-4 h-4"
                          />
                          <span className="text-xs text-gray-600">Paid</span>
                          <span className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                            <IndianRupee className="w-3 h-3" />
                            {item.amount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
