import { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/Context";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);

  const [state, setState] = useState("Sign Up");
  const [role, setRole] = useState("client");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // counsellor-only
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
        role === "client"
          ? { name, email, password }
          : {
              name,
              email,
              password,
              speciality,
              fees,
            };

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
  }, [token]);

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto p-8 min-w-85 border rounded-xl text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>

        {/* ROLE SELECT */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="client">Client</option>
          <option value="councellor">Counsellor</option>
        </select>

        {state === "Sign Up" && (
          <input
            type="text"
            placeholder="Full Name"
            className="border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* COUNSELLOR EXTRA FIELDS */}
        {role === "councellor" && state === "Sign Up" && (
          <>
            <input
              type="text"
              placeholder="Speciality"
              className="border p-2 rounded"
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              required
            />

            <input
              type="number"
              placeholder="Fees"
              className="border p-2 rounded"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
            />
          </>
        )}

        <button className="bg-blue-400 text-white py-2 rounded">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        <p className="text-center">
          {state === "Sign Up" ? (
            <>
              Already have an account?{" "}
              <span
                onClick={() => setState("Login")}
                className="text-blue-600 cursor-pointer underline"
              >
                Login
              </span>
            </>
          ) : (
            <>
              New here?{" "}
              <span
                onClick={() => setState("Sign Up")}
                className="text-blue-600 cursor-pointer underline"
              >
                Create account
              </span>
            </>
          )}
        </p>
      </div>
    </form>
  );
};

export default Login;
