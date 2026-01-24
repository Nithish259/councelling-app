import { Link } from "react-router-dom";
import { counselorSpecialties } from "../assets/assets";

const SessionType = () => {
  return (
    <section
      id="sessionType"
      className="py-20 bg-linear-to-br from-blue-50 via-white to-cyan-50 border border-gray-100"
    >
      <div className="max-w-7xl mx-auto px-6 text-center text-gray-900">
        {/* HEADER */}
        <h2 className="text-4xl font-bold tracking-tight">
          Find By Session Type
        </h2>
        <p className="mt-3 max-w-2xl mx-auto text-gray-600">
          Explore different counseling options and connect with trusted
          professionals for personalized care.
        </p>

        {/* GRID */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
          {counselorSpecialties.map((item, index) => (
            <Link
              key={index}
              to={`/councellors/${item.category}`}
              onClick={() => scrollTo(0, 0)}
              className="
              group
              bg-white/80 backdrop-blur
              border border-gray-200
              rounded-2xl
              p-5
              flex flex-col items-center
              cursor-pointer
              shadow-sm
              transition-all duration-300
              hover:-translate-y-2
              hover:shadow-xl
            "
            >
              {/* IMAGE */}
              <img
                src={item.image}
                alt={item.category}
                className="w-28 h-28 object-contain"
              />

              {/* TEXT */}
              <p className="mt-4 text-sm font-semibold text-gray-800 text-center group-hover:text-blue-600 transition">
                {item.category}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SessionType;
