import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useState, useContext } from "react";
import { AppContext } from "../context/Context";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken, clientData, councellorData, role, loadingProfile } =
    useContext(AppContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      <div className="md:mx-3 flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400 px-2 md:px-0">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-44 cursor-pointer"
          src={assets.healspacelogo}
          alt="logo"
        />

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-start gap-6 font-medium">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            <li className="py-1">Home</li>
          </NavLink>

          {role === "councellor" && (
            <NavLink
              to="/counsellor/dashboard"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-gray-700"
              }
            >
              <li className="py-1">Dashboard</li>
            </NavLink>
          )}

          {role === "client" && (
            <NavLink
              to="/councellors"
              className={({ isActive }) =>
                isActive ? "text-blue-600 font-bold" : "text-gray-700"
              }
            >
              <li className="py-1">Councellors</li>
            </NavLink>
          )}

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            <li className="py-1">About</li>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? "text-blue-600 font-bold" : "text-gray-700"
            }
          >
            <li className="py-1">Contact</li>
          </NavLink>
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i
              className={
                mobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"
              }
            ></i>
          </button>

          {/* Profile / Login */}
          {!loadingProfile ? (
            token && (clientData || councellorData) ? (
              <div
                className="flex items-center gap-2 cursor-pointer relative"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <img
                  className="w-8 h-8 rounded-full object-cover"
                  src={
                    role === "client"
                      ? clientData?.image
                      : councellorData?.image
                  }
                  alt="profile"
                />
                <i className="fa-solid fa-caret-down"></i>

                {profileOpen && (
                  <div className="absolute top-0 right-0 mt-12 text-base text-gray-600 z-20 font-medium">
                    <div className="min-w-48 bg-stone-100 flex flex-col gap-4 p-4 rounded shadow">
                      <p
                        onClick={() => {
                          navigate("/myProfile");
                          setProfileOpen(false);
                        }}
                        className="hover:text-black cursor-pointer"
                      >
                        My Profile
                      </p>
                      <p
                        onClick={() => {
                          navigate("/myAppoinments");
                          setProfileOpen(false);
                        }}
                        className="hover:text-black cursor-pointer"
                      >
                        My Appoinments
                      </p>
                      <p
                        onClick={() => {
                          navigate("/session-history");
                          setProfileOpen(false);
                        }}
                        className="hover:text-black cursor-pointer"
                      >
                        Session History
                      </p>
                      <p
                        onClick={logOut}
                        className="hover:text-black cursor-pointer"
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="bg-blue-600 rounded-full font-light hidden md:block text-white px-8 py-3"
                onClick={() => navigate("/login")}
              >
                Login/Register
              </button>
            )
          ) : null}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-4 text-gray-700 font-medium border-b border-gray-200">
          <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>

          {role === "councellor" && (
            <NavLink
              to="/counsellor/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}

          {role === "client" && (
            <NavLink to="/councellors" onClick={() => setMobileMenuOpen(false)}>
              Councellors
            </NavLink>
          )}

          <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
            About
          </NavLink>

          <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
            Contact
          </NavLink>

          {!token && (
            <button
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="bg-blue-600 text-white rounded-full py-2 mt-2"
            >
              Login/Register
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
