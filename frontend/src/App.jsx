import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Councellors from "./pages/Councellors";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import MyProfile from "./pages/MyProfile";
import MyAppoinments from "./pages/MyAppoinments";
import Appoinment from "./pages/Appoinment";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import AppointmentDetail from "./pages/AppointmentDetail";
import JoinSession from "./pages/JoinSession";
import SessionHistory from "./pages/SessionHistory";
import CouncellorDashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/councellors" element={<Councellors />} />
        <Route path="/councellors/:speciality" element={<Councellors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/chat/:appointmentId" element={<Chat />} />
        <Route path="/myProfile" element={<MyProfile />} />
        <Route path="/myAppoinments" element={<MyAppoinments />} />
        <Route path="/session-history" element={<SessionHistory />} />
        <Route path="/appoinment/:councellorId" element={<Appoinment />} />
        <Route
          path="/appointmentDetail/:appointmentId"
          element={<AppointmentDetail />}
        />
        <Route path="/session/:roomId/join" element={<JoinSession />} />
        <Route path="/counsellor/dashboard" element={<CouncellorDashboard />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;
