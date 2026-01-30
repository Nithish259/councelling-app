import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { counselorSpecialties } from "../assets/assets";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [role, setRole] = useState("client");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passType, setPassType] = useState(false);

  const [speciality, setSpeciality] = useState("");
  const [fees, setFees] = useState("");

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      let url = "";

      if (state === "Sign Up") {
        url =
          role === "client"
            ? `${backendUrl}/api/client/register`
            : `${backendUrl}/api/councellor/register`;
      } else {
        url =
          role === "client"
            ? `${backendUrl}/api/client/login`
            : `${backendUrl}/api/councellor/login`;
      }

      const payload =
        state === "Login"
          ? { email, password }
          : role === "client"
            ? { name, email, password }
            : { name, email, password, speciality, fees };

      const { data } = await axios.post(url, payload);

      if (data.status === "Success") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        setToken(data.token);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-2">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </h2>

        {/* Role Selector */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="client">Client</option>
          <option value="councellor">Counsellor</option>
        </select>

        {/* Name (Sign Up only) */}
        {state === "Sign Up" && (
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email Address"
          className="border p-2 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password Field */}
        <div className="relative">
          <input
            type={passType ? "text" : "password"}
            placeholder="Password"
            className="border p-2 rounded-lg w-full pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <i
            onClick={() => setPassType(!passType)}
            className={`fa-solid ${
              passType ? "fa-eye-slash" : "fa-eye"
            } absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500`}
          ></i>
        </div>

        {/* Counsellor Fields */}
        {role === "councellor" && state === "Sign Up" && (
          <>
            <select
              className="border p-2 rounded-lg"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            >
              <option value="">Select Speciality</option>
              {counselorSpecialties.map((item) => (
                <option key={item.category} value={item.category}>
                  {item.category}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Consultation Fees"
              className="border p-2 rounded-lg"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
            />
          </>
        )}

        <button className="bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg font-medium">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p className="text-center text-sm">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 cursor-pointer font-medium"
              >
                Login
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 cursor-pointer font-medium"
              >
                Create account
              </span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default Login;
