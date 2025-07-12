import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer/Footer";
import Discover from "./Pages/Discover/Discover";
import Login from "./Pages/Login/Login";
import Header from "./Components/Navbar/Navbar";
import LandingPage from "./Pages/LandingPage/LandingPage";
import Chats from "./Pages/Chats/Chats";
import Report from "./Pages/Report/Report";
import Profile from "./Pages/Profile/Profile";
import NotFound from "./Pages/NotFound/NotFound";
import Register from "./Pages/Register/Register";
import Rating from "./Pages/Rating/Rating";
import EditProfile from "./Pages/EditProfile/EditProfile";
import AdminDashboard from "./Pages/Admin/AdminDashboard";
import AdminUsers from "./Pages/Admin/AdminUsers";
import AdminReports from "./Pages/Admin/AdminReports";
import AdminAnalytics from "./Pages/Admin/AdminAnalytics";
import AdminSettings from "./Pages/Admin/AdminSettings";
import PrivateRoutes from "./util/PrivateRoutes";
import useScrollToTop from "./util/useScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Scroll to top on route change
  useScrollToTop();

  return (
    <>
      <Header />
      <ToastContainer position="top-right" />
      <Routes>
        <Route element={<PrivateRoutes />}>
          <Route path="/chats" element={<Chats />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit_profile" element={<EditProfile />} />
        <Route path="/report/:username" element={<Report />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/rating/:username" element={<Rating />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
};

export default App;
