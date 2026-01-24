import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="bg-blue-400 w-full">
      <div className="max-w-7xl mx-auto px-6 py-10 md:py-16 flex flex-col-reverse md:flex-row items-center gap-10">
        {/* LEFT CONTENT */}
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-white mb-6 leading-tight">
            Book Appointment <br className="hidden sm:block" /> With Trusted
            Counsellors
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 mb-6">
            <img src={assets.group_profiles} alt="" className="w-28 sm:w-32" />
            <p className="font-medium text-white text-sm sm:text-base text-center md:text-left">
              Simply browse through our extensive list of trusted counsellors,
              schedule your appointment hassle-free
            </p>
          </div>

          <a
            href="#sessionType"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 
              rounded-full border border-gray-300 bg-white text-gray-800
              font-medium tracking-wide shadow-sm
              hover:bg-black hover:text-white hover:border-black
              transition-all duration-300 ease-in-out"
          >
            <span>Book Appointment</span>
            <i className="fa-solid fa-arrow-right text-sm"></i>
          </a>
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={assets.header_img}
            alt="Counselling"
            className="w-full max-w-md md:max-w-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
