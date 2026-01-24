import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import { useNavigate } from "react-router-dom";

const RelatedCouncellors = ({ counId, speciality }) => {
  const { councellors } = useContext(AppContext);
  const navigate = useNavigate();

  const [relCounc, setRelCounc] = useState([]);

  useEffect(() => {
    if (councellors.length > 0 && speciality) {
      const counselorsData = councellors.filter(
        (counc) => counc.speciality === speciality && counc._id !== counId,
      );
      setRelCounc(counselorsData);
    }
  }, [councellors, counId, speciality]);

  return (
    <div className="flex flex-col items-center my-12 md:my-16 gap-4 text-gray-900 px-4 md:px-10">
      <h1 className="text-2xl md:text-3xl font-medium text-center">
        Related Councellors
      </h1>
      <p className="text-sm text-center max-w-md">
        Simply browse through our extensive list of trusted councellors.
      </p>

      {/* Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 pt-6">
        {relCounc.slice(0, 5).map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appoinment/${item._id}`);
              scrollTo(0, 0);
            }}
            key={index}
            className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300 bg-white"
          >
            <img
              className="bg-blue-50 w-full h-48 object-cover"
              src={item.image}
              alt={item.name}
            />

            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-green-500 mb-1">
                <i className="fa-solid fa-circle-dot text-xs"></i>
                <p>Available</p>
              </div>

              <p className="text-gray-900 text-base font-semibold truncate">
                {item.name}
              </p>
              <p className="text-gray-600 text-sm truncate">
                {item.speciality}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          navigate("/councellors");
          scrollTo(0, 0);
        }}
        className="rounded-full w-full sm:w-40 px-6 py-3 mt-8 bg-blue-200 hover:bg-blue-300 transition"
      >
        More
      </button>
    </div>
  );
};

export default RelatedCouncellors;
