import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Context";

const TopCouncellors = () => {
  const navigate = useNavigate();
  const { councellors } = useContext(AppContext);

  return (
    <div className="py-20 bg-linear-to-br from-blue-200 via-white to-cyan-200">
      <div className="max-w-7xl mx-auto px-6 text-center text-gray-900">
        {/* HEADER */}
        <h1 className="text-4xl font-bold tracking-tight">
          Top Counsellors to Book
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto">
          Hand-picked professionals trusted by hundreds of clients
        </p>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12">
          {councellors.slice(0, 10).map((item, index) => (
            <div
              key={index}
              onClick={() => {
                navigate(`/appoinment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="
              group cursor-pointer
              bg-white/80 backdrop-blur
              border border-gray-200
              rounded-2xl
              overflow-hidden
              shadow-sm
              transition-all duration-300
              hover:-translate-y-3
              hover:shadow-xl
            "
            >
              {/* IMAGE */}
              <div className="relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-44 object-contain bg-cyan-100"
                />

                {/* STATUS */}
                <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Available
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-5 text-left">
                <p className="text-lg font-semibold text-gray-900">
                  {item.name}
                </p>

                <p className="text-sm text-gray-600 mt-1">{item.speciality}</p>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">View profile</span>

                  <span className="text-blue-600 text-sm font-medium group-hover:underline">
                    Book →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => {
            navigate("/councellors");
            scrollTo(0, 0);
          }}
          className="
          mt-14 px-8 py-3 rounded-full
          bg-linear-to-r from-blue-600 to-cyan-600
          text-white font-semibold
          shadow-md
          hover:shadow-lg
          hover:scale-105
          transition-all
        "
        >
          View all counsellors
        </button>
      </div>
    </div>
  );
};

export default TopCouncellors;
