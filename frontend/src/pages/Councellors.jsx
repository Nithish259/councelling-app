import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/Context";
import { counselorSpecialties } from "../assets/assets";
import axios from "axios";

const Councellors = () => {
  const [councellors, setCouncellors] = useState([]);
  const [filterCouncellor, setFilterCouncellor] = useState([]);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const { backendUrl } = useContext(AppContext);
  const { speciality } = useParams();
  const navigate = useNavigate();

  /* ================= FETCH COUNSELLORS ================= */
  useEffect(() => {
    const fetchCouncellors = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/client/getCouncellors`,
        );
        setCouncellors(data.councellors);
        setFilterCouncellor(data.councellors);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCouncellors();
  }, []);

  /* ================= FILTER BY SPECIALITY ================= */
  useEffect(() => {
    if (speciality) {
      const filtered = councellors.filter(
        (item) => item.speciality === speciality,
      );
      setFilterCouncellor(filtered);
    } else {
      setFilterCouncellor(councellors);
    }
  }, [speciality, councellors]);

  const handleFilterClick = (category) => {
    setShowMobileFilter(false);
    speciality === category
      ? navigate("/councellors")
      : navigate(`/councellors/${category}`);
  };

  return (
    <div className="min-h-screen py-6 md:py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* HEADER */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Find Your Counsellor
          </h2>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Browse and choose a professional based on your needs
          </p>
        </div>

        {/* MOBILE FILTER BUTTON */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowMobileFilter((p) => !p)}
            className="w-full py-2 rounded-lg bg-blue-600 text-white text-sm font-medium"
          >
            Filter by Specialty
          </button>
        </div>

        {/* MOBILE FILTER DROPDOWN */}
        {showMobileFilter && (
          <div className="md:hidden mb-4 bg-white border rounded-xl shadow p-3 space-y-2">
            {counselorSpecialties.map((item, index) => (
              <button
                key={index}
                onClick={() => handleFilterClick(item.category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                  speciality === item.category
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {item.category}
              </button>
            ))}
          </div>
        )}

        {/* MOBILE HORIZONTAL SCROLL FILTERS */}
        <div className="md:hidden flex gap-2 overflow-x-auto pb-3 mb-4">
          {counselorSpecialties.map((item, index) => (
            <button
              key={index}
              onClick={() => handleFilterClick(item.category)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs border ${
                speciality === item.category
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {item.category}
            </button>
          ))}
        </div>

        <div className="flex gap-8">
          {/* DESKTOP SIDEBAR FILTER */}
          <div className="hidden md:block w-1/4 sticky top-24 h-fit">
            <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-4 space-y-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Specialties
              </h3>

              {counselorSpecialties.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleFilterClick(item.category)}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                    speciality === item.category
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {item.category}
                </button>
              ))}
            </div>
          </div>

          {/* COUNSELLOR LIST */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 w-full">
            {filterCouncellor.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/appoinment/${item._id}`)}
                className="group cursor-pointer bg-white border rounded-2xl shadow-sm overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 md:h-52 object-contain bg-blue-100"
                  />
                  <span className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Available
                  </span>
                </div>

                <div className="p-4 md:p-5">
                  <p className="text-base md:text-lg font-semibold text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.speciality}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-gray-400">View profile</span>
                    <span className="text-blue-600 text-sm font-medium group-hover:underline">
                      Book →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Councellors;
