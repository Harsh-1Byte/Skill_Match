import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ProfileCard from "./ProfileCard";
import "./Discover.css";
import Search from "./Search";
import Spinner from "react-bootstrap/Spinner";
import { 
  FaHome, 
  FaFire, 
  FaCode, 
  FaBrain, 
  FaPalette, 
  FaUsers, 
  FaEllipsisH 
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Discover = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [loading, setLoading] = useState(false);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [webDevUsers, setWebDevUsers] = useState([]);
  const [mlUsers, setMlUsers] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);
  const [activeSection, setActiveSection] = useState("for-you");
  const [error, setError] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Memoize navItems to prevent recreation on every render
  const navItems = useMemo(() => [
    { id: "for-you", label: "For You", icon: <FaHome />, color: "cream" },
    { id: "popular", label: "Popular", icon: <FaFire />, color: "spearmint" },
    { id: "web-development", label: "Web Development", icon: <FaCode />, color: "cream" },
    { id: "machine-learning", label: "Machine Learning", icon: <FaBrain />, color: "cream" },
    { id: "others", label: "Others", icon: <FaEllipsisH />, color: "cream" },
  ], []);

  // Memoize the getUser function
  const getUser = useCallback(async () => {
    // Only fetch user details if user is authenticated and not already loaded
    if (!user || dataLoaded) {
      return;
    }
    
    try {
      const { data } = await axios.get(`/user/registered/getDetails`);
      setUser(data.data);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
    } catch (error) {
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      localStorage.removeItem("userInfo");
      setUser(null);
      await axios.get("/auth/logout");
      navigate("/login");
    }
  }, [user, setUser, navigate, dataLoaded]);

  // Memoize the getDiscoverUsers function
  const getDiscoverUsers = useCallback(async () => {
    // Prevent multiple calls
    if (dataLoaded) return;
    
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/user/discover");
      
      if (data && data.data) {
        setDiscoverUsers(data.data.forYou || []);
        setWebDevUsers(data.data.webDev || []);
        setMlUsers(data.data.ml || []);
        setOtherUsers(data.data.others || []);
      } else {
        setDiscoverUsers([]);
        setWebDevUsers([]);
        setMlUsers([]);
        setOtherUsers([]);
      }
      setDataLoaded(true);
    } catch (error) {
      setError(error.message);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      setDiscoverUsers([]);
      setWebDevUsers([]);
      setMlUsers([]);
      setOtherUsers([]);
      setDataLoaded(true);
    } finally {
      setLoading(false);
    }
  }, [dataLoaded]);

  // Memoize the handleNavClick function
  const handleNavClick = useCallback((sectionId) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Memoize the scroll handler with debouncing
  const handleScroll = useCallback(() => {
    const sections = navItems.map(item => item.id);
    const scrollPosition = window.scrollY + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section && section.offsetTop <= scrollPosition) {
        setActiveSection(sections[i]);
        break;
      }
    }
  }, [navItems]);

  // Single useEffect for initial data loading
  useEffect(() => {
    if (!dataLoaded) {
      getDiscoverUsers();
    }
  }, [getDiscoverUsers, dataLoaded]);

  // Separate useEffect for user details (only when user changes and not loaded)
  useEffect(() => {
    if (user && !dataLoaded) {
      getUser();
    }
  }, [user, getUser, dataLoaded]);

  // Add scroll detection for active section with throttling
  useEffect(() => {
    let ticking = false;
    
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });
    return () => window.removeEventListener('scroll', throttledScrollHandler);
  }, [handleScroll]);

  return (
    <>
      <div className="discover-page">
        <div className="content-container">
          <div className="nav-bar">
            <div className="nav-header">
              <h3 className="nav-title">Discover</h3>
              <p className="nav-subtitle">Find your perfect match</p>
            </div>
            
            <div className="nav-menu">
              {navItems.map((item) => (
                <Nav.Link
                  key={item.id}
                  href={`#${item.id}`}
                  className={`navlink ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.label}</span>
                </Nav.Link>
              ))}
            </div>
          </div>
          
          <div className="heading-container">
            {error && (
              <div className="alert alert-danger" role="alert" style={{ marginBottom: "2rem" }}>
                <h4>Error loading discover page</h4>
                <p>{error}</p>
                <button 
                  className="btn btn-outline-danger"
                  onClick={() => window.location.reload()}
                >
                  Reload Page
                </button>
              </div>
            )}
            
            {loading ? (
              <div className="container d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3" style={{ color: "#666666" }}>Loading amazing profiles...</p>
                </div>
              </div>
            ) : (
              <>
                <h1
                  id="for-you"
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#EF7C8E",
                    marginTop: "2rem",
                    marginBottom: "1rem",
                    textAlign: "left"
                  }}
                >
                  For You
                </h1>
                <div className="profile-cards">
                  {discoverUsers && discoverUsers.length > 0 ? (
                    discoverUsers.map((user) => (
                      <ProfileCard
                        key={user._id}
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={user?.rating || 0}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <div className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                      <div style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.9)", 
                        borderRadius: "20px", 
                        padding: "2rem",
                        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
                      }}>
                        <h3 style={{ color: "#EF7C8E", marginBottom: "1rem" }}>No profiles available</h3>
                        <p style={{ color: "#666666", marginBottom: "1.5rem" }}>
                          {user ? "Check back later for new profiles!" : "Sign up to see personalized recommendations!"}
                        </p>
                        {!user && (
                          <Link to="/login" className="action-button view-profile">
                            Get Started
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <h1
                  id="popular"
                  style={{
                    fontFamily: "Josefin Sans, sans-serif",
                    color: "#EF7C8E",
                    marginTop: "3rem",
                    marginBottom: "1rem",
                    textAlign: "left"
                  }}
                >
                  Popular
                </h1>
                
                <h2 id="web-development">Web Development</h2>
                <div className="profile-cards">
                  {webDevUsers && webDevUsers.length > 0 ? (
                    webDevUsers.map((user) => (
                      <ProfileCard
                        key={user._id}
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={user?.rating || 0}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <div className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                      <h3 style={{ color: "#EF7C8E" }}>No web development profiles available</h3>
                    </div>
                  )}
                </div>
                
                <h2 id="machine-learning">Machine Learning</h2>
                <div className="profile-cards">
                  {mlUsers && mlUsers.length > 0 ? (
                    mlUsers.map((user) => (
                      <ProfileCard
                        key={user._id}
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={user?.rating || 0}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <div className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                      <h3 style={{ color: "#EF7C8E" }}>No machine learning profiles available</h3>
                    </div>
                  )}
                </div>
                
                <h2 id="others">Others</h2>
                <div className="profile-cards">
                  {otherUsers && otherUsers.length > 0 ? (
                    otherUsers.map((user) => (
                      <ProfileCard
                        key={user._id}
                        profileImageUrl={user?.picture}
                        name={user?.name}
                        rating={user?.rating || 0}
                        bio={user?.bio}
                        skills={user?.skillsProficientAt}
                        username={user?.username}
                      />
                    ))
                  ) : (
                    <div className="text-center" style={{ gridColumn: "1 / -1", padding: "2rem" }}>
                      <h3 style={{ color: "#EF7C8E" }}>No other profiles available</h3>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Discover;
