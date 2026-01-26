import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode"; // import correctly

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currencySymbol = "₹";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const [clientData, setClientData] = useState(null);
  const [councellorData, setCouncellorData] = useState(null);
  const [councellors, setCouncellors] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState(null);

  // ================= Load Client Profile =================
  const loadClientProfileData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/client/getProfile`, {
        headers: { token },
      });

      if (data.status === "Success") {
        setClientData(data.clientData);
        setCouncellorData(null);
        setRole("client");
        localStorage.setItem("role", "client");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= Load Counsellor Profile =================
  const loadCouncellorProfileData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/councellor/getProfile`,
        { headers: { token } },
      );

      if (data.status === "Success") {
        setCouncellorData(data.councellor);
        setClientData(null);
        setRole("councellor");
        localStorage.setItem("role", "councellor");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= Get All Counsellors =================
  const getCouncellors = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/client/getCouncellors`,
      );
      setCouncellors(data.councellors || []);
    } catch (error) {
      toast.error("Failed to load counsellors");
    }
  };

  // ================= Load Appointments =================
  const loadAppointments = async () => {
    try {
      if (!role) return;
      const url =
        role === "client"
          ? `${backendUrl}/api/client/appointments`
          : `${backendUrl}/api/councellor/appointments`;

      const { data } = await axios.get(url, { headers: { token } });
      if (data.status === "Success") setAppointments(data.appointments);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ================= Sync Profile on Token Change =================
  useEffect(() => {
    const syncProfile = async () => {
      if (!token) {
        setClientData(null);
        setCouncellorData(null);
        setRole(null);
        setLoadingProfile(false);
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        return;
      }

      setLoadingProfile(true);

      try {
        // Decode token and set role immediately
        const decoded = jwtDecode(token);
        if (decoded?.role) {
          setRole(decoded.role);
          localStorage.setItem("role", decoded.role);

          if (decoded.role === "client") await loadClientProfileData();
          if (decoded.role === "councellor") await loadCouncellorProfileData();
        } else {
          // fallback: try both
          await loadClientProfileData();
          if (!clientData) await loadCouncellorProfileData();
        }
      } catch (error) {
        setClientData(null);
        setCouncellorData(null);
        setRole(null);
        localStorage.removeItem("role");
      } finally {
        setLoadingProfile(false);
      }
    };

    syncProfile();
  }, [token]);

  // ================= Load Counsellors on Mount =================
  useEffect(() => {
    getCouncellors();
  }, []);

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.id);
      setRole(decoded.role);
    }
  }, [token]);

  const value = {
    councellors,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    role,
    clientData,
    setClientData,
    councellorData,
    setCouncellorData,
    loadCouncellorProfileData,
    loadClientProfileData,
    loadingProfile,
    setRole,
    appointments,
    loadAppointments,
    userId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
