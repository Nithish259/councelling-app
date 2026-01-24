import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../context/Context";
import { assets } from "../assets/assets";
import RelatedCouncellors from "../components/RelatedCouncellors";
import axios from "axios";
import { toast } from "react-toastify";

const Appoinment = () => {
  const [councInfo, setCouncInfo] = useState(null);
  const [councSlots, setCouncSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const { councellors, currencySymbol, backendUrl, token, role } =
    useContext(AppContext);
  const { councellorId } = useParams();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  useEffect(() => {
    const info = councellors.find((c) => c._id === councellorId);
    setCouncInfo(info);
  }, [councellors, councellorId]);

  useEffect(() => {
    if (!councInfo) return;

    const generateSlots = () => {
      let today = new Date();
      let allDays = [];

      for (let i = 0; i < 7; i++) {
        let currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

        let endTime = new Date(currentDate);
        endTime.setHours(21, 0, 0, 0);

        if (i === 0) {
          currentDate.setHours(Math.max(10, currentDate.getHours() + 1));
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        } else {
          currentDate.setHours(10, 0, 0, 0);
        }

        const dateKey = currentDate.toISOString().split("T")[0];
        const rawBooked = councInfo.slots_booked?.[dateKey] || [];

        const bookedTimes = rawBooked.map((time) => {
          const [t, modifier] = time.split(" ");
          let [hours, minutes] = t.split(":");
          if (modifier === "PM" && hours !== "12") hours = String(+hours + 12);
          if (modifier === "AM" && hours === "12") hours = "00";
          return `${hours.padStart(2, "0")}:${minutes}`;
        });

        let daySlots = [];

        while (currentDate < endTime) {
          const formattedTime = currentDate.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });

          daySlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
            isBooked: bookedTimes.includes(formattedTime),
          });

          currentDate.setMinutes(currentDate.getMinutes() + 30);
        }

        allDays.push(daySlots);
      }

      setCouncSlots(allDays);
    };

    generateSlots();
  }, [councInfo]);

  const bookAppointment = async () => {
    if (!token) return toast.error("Please login to book appointment");
    if (!slotTime) return toast.error("Please select a time slot");

    setLoading(true);
    try {
      const slotDate = councSlots[slotIndex][0].datetime
        .toISOString()
        .split("T")[0];

      const { data } = await axios.post(
        `${backendUrl}/api/payment/create-order`,
        { councellorId, slotDate, slotTime },
        { headers: { token } },
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Counseling Session",
        description: `Session on ${slotDate} at ${slotTime}`,
        order_id: data.order.id,
        handler: async function (response) {
          const verifyRes = await axios.post(
            `${backendUrl}/api/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              councellorId,
              slotDate,
              slotTime,
            },
            { headers: { token } },
          );

          if (verifyRes.data.status === "Success") {
            toast.success("Appointment booked!");
            setPaymentDone(true);
          }
        },
        theme: { color: "#14b8a6" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!councInfo) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-8">
      {/* Counsellor Info */}
      <div className="flex flex-col md:flex-row gap-6 bg-white shadow-lg rounded-xl p-5 md:p-6">
        <img
          className="w-full md:w-64 h-64 md:h-auto rounded-xl object-cover"
          src={councInfo.image}
          alt=""
        />
        <div className="flex-1">
          <p className="text-xl md:text-2xl font-semibold flex items-center gap-2">
            {councInfo.name}
            <img src={assets.verified_icon} className="w-5" />
          </p>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            {councInfo.degree} - {councInfo.speciality}
          </p>
          <p className="text-gray-500 mt-3 text-sm leading-relaxed">
            {councInfo.about}
          </p>
          <p className="mt-4 font-medium text-base">
            Fee: {currencySymbol}
            {councInfo.fees}
          </p>

          {paymentDone && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-sm">
              Payment successful! Appointment booked.
            </div>
          )}
        </div>
      </div>

      {/* Booking Section */}
      {!paymentDone && (
        <div>
          <p className="text-lg font-medium mb-3">Booking Slots</p>

          {/* Days */}
          <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
            {councSlots.map((day, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`p-3 border rounded-lg cursor-pointer text-center min-w-17.5 shrink-0 ${
                  slotIndex === index
                    ? "bg-blue-500 text-white"
                    : "border-gray-300"
                }`}
              >
                <p className="text-xs">
                  {daysOfWeek[day[0].datetime.getDay()]}
                </p>
                <p className="font-semibold">{day[0].datetime.getDate()}</p>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {councSlots[slotIndex]?.map((item, index) => (
              <p
                key={index}
                onClick={() => !item.isBooked && setSlotTime(item.time)}
                className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap shrink-0
                ${
                  item.isBooked
                    ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                    : item.time === slotTime
                      ? "bg-blue-500 text-white border-blue-500 cursor-pointer"
                      : "border-gray-300 cursor-pointer"
                }`}
              >
                {item.time}
              </p>
            ))}
          </div>

          <button
            onClick={bookAppointment}
            disabled={loading || role !== "client"}
            className="mt-6 w-full md:w-auto bg-blue-500 text-white px-8 py-3 rounded-full disabled:opacity-50"
          >
            {loading ? "Processing..." : "Pay & Book"}
          </button>
        </div>
      )}

      <RelatedCouncellors
        counId={councellorId}
        speciality={councInfo.speciality}
      />
    </div>
  );
};

export default Appoinment;
