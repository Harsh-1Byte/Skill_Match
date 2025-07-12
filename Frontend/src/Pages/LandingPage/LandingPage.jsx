import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../util/UserContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, setUser, isInitialized, isLoading } = useUser();
  const [featuredUsers, setFeaturedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState({});

  useEffect(() => {
    const getFeaturedUsers = async () => {
      try {
        setLoading(true);
        console.log("Fetching featured users...");
        console.log("Current user state:", user);
        console.log("Making request to /user/featured");
        
        const { data } = await axios.get("/user/featured");
        console.log("Featured users response:", data);
        console.log("Response data structure:", {
          success: data.success,
          message: data.message,
          dataLength: data.data?.length || 0,
          dataType: typeof data.data,
          isArray: Array.isArray(data.data)
        });
        
        if (data.data && Array.isArray(data.data)) {
          console.log("Setting featured users:", data.data.length, "users");
          console.log("Users to be set:", data.data.map(u => ({ name: u.name, username: u.username })));
          setFeaturedUsers(data.data);
        } else {
          console.log("No valid data array in response, setting empty array");
          setFeaturedUsers([]);
        }
        
        console.log("Featured users set:", data.data?.length || 0);
      } catch (error) {
        console.log("Error fetching featured users:", error);
        console.log("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText
        });
        
        // Don't show error for featured users if user is not authenticated
        if (error?.response?.data?.message && user) {
          toast.error(error.response.data.message);
          if (error.response.data.message === "Please Login") {
            localStorage.removeItem("userInfo");
            setUser(null);
            await axios.get("/auth/logout");
            navigate("/login");
          }
        }
        setFeaturedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    if (isInitialized) {
      // Test backend connectivity first
      const testBackend = async () => {
        try {
          console.log("Testing backend connectivity...");
          const testResponse = await axios.get("/auth/test");
          console.log("Backend test response:", testResponse.data);
          
          // Test cookie debug endpoint
          console.log("Testing cookie debug endpoint...");
          const debugResponse = await axios.get("/auth/debug");
          console.log("Cookie debug response:", debugResponse.data);
          
          // Test database endpoint
          console.log("Testing database endpoint...");
          const dbResponse = await axios.get("/user/test-database");
          console.log("Database test response:", dbResponse.data);
        } catch (error) {
          console.log("Backend test failed:", error);
        }
      };
      
      testBackend();
      getFeaturedUsers();
    }
  }, [isInitialized, user, setUser, navigate]);

  // Separate useEffect to handle user state changes
  useEffect(() => {
    if (user) {
      console.log("User state changed, user is now logged in:", user.name);
    }
  }, [user]);

  const handleRequest = async (userId, username) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setRequestLoading(prev => ({ ...prev, [userId]: true }));
      const { data } = await axios.post("/request/create", {
        receiverID: userId,
      });
      toast.success("Connection request sent successfully! The user will be notified via email.", {
        autoClose: 5000,
        position: "top-center"
      });
      
      // Update the user's request status
      setFeaturedUsers(prev => 
        prev.map(user => 
          user._id === userId 
            ? { ...user, requestStatus: "Pending" }
            : user
        )
      );
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        if (error.response.data.message === "Request already exists") {
          toast.info("You've already sent a request to this user. Check your chats for updates.", {
            autoClose: 4000
          });
          // Update the user's request status to show it's already pending
          setFeaturedUsers(prev => 
            prev.map(user => 
              user._id === userId 
                ? { ...user, requestStatus: "Pending" }
                : user
            )
          );
        } else {
          toast.error(error.response.data.message);
        }
        if (error.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setRequestLoading(prev => ({ ...prev, [userId]: false }));
    }
  };

  const getRequestButtonText = (user) => {
    if (!user || !user.requestStatus) return "Request";
    
    switch (user.requestStatus) {
      case "Pending":
        return "Request Pending";
      case "Connected":
        return "Connected";
      case "Rejected":
        return "Request Rejected";
      default:
        return "Request";
    }
  };

  const getRequestButtonClass = (user) => {
    if (!user || !user.requestStatus) return "action-button request-button";
    
    switch (user.requestStatus) {
      case "Pending":
        return "action-button request-button pending";
      case "Connected":
        return "action-button request-button connected";
      case "Rejected":
        return "action-button request-button rejected";
      default:
        return "action-button request-button";
    }
  };

  const isRequestDisabled = (user) => {
    return user?.requestStatus === "Pending" || user?.requestStatus === "Connected";
  };

  const ProfileCard = ({ profileImageUrl, bio, name, skills, rating, username, _id, requestStatus }) => {
    // Convert rating to stars (assuming rating is out of 5)
    const renderStars = (rating) => {
      const stars = [];
      const fullStars = Math.floor(rating || 0);
      const hasHalfStar = (rating || 0) % 1 !== 0;
      
      // Add full stars
      for (let i = 0; i < fullStars; i++) {
        stars.push(<li key={i}><i className="fas fa-star"></i></li>);
      }
      
      // Add half star if needed
      if (hasHalfStar) {
        stars.push(<li key="half"><i className="fas fa-star-half-alt"></i></li>);
      }
      
      // Add empty stars to complete 5 stars
      const emptyStars = 5 - Math.ceil(rating || 0);
      for (let i = 0; i < emptyStars; i++) {
        stars.push(<li key={`empty-${i}`}><i className="fas fa-star"></i></li>);
      }
      
      return stars;
    };

    // Ensure we have valid data
    const displayName = name || "Unknown User";
    const displayBio = bio || "No bio available";
    const displaySkills = skills && skills.length > 0 ? skills : ["No skills listed"];
    const displayRating = rating || 0;
    const displayImage = profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";

    return (
      <div className="profile-card">
        <div className="card-content">
          {/* Left side - Information */}
          <div className="card-info">
            <div className="card-header">
              <h1 className="profile-name">{displayName}</h1>
              <div className="profile-rating">
                <ul className="star-rating">
                  {renderStars(displayRating)}
                </ul>
                <span className="rating-text">{displayRating}/5</span>
              </div>
            </div>
            
            <div className="profile-profession">
              <p>{displaySkills[0] || 'Professional'}</p>
            </div>
            
            <div className="profile-bio">
              <p>{displayBio}</p>
            </div>
            
            <div className="profile-skills">
              <h3>Skills</h3>
              <div className="skills-container">
                {displaySkills.map((skill, index) => (
                  <span key={index} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right side - Profile image and buttons */}
          <div className="card-profile">
            <div className="profile-image">
              <img src={displayImage} alt={displayName} onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
              }} />
            </div>
            
            <div className="profile-actions">
              <Link to={`/profile/${username}`} className="action-button view-profile">
                View Profile
              </Link>
              <button 
                className={getRequestButtonClass({ requestStatus })}
                onClick={() => handleRequest(_id, username)}
                disabled={isRequestDisabled({ requestStatus }) || requestLoading[_id]}
              >
                {requestLoading[_id] ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  getRequestButtonText({ requestStatus })
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Show loading while checking user authentication or if not initialized
  if (!isInitialized || isLoading) {
    return (
      <div className="landing-page">
        <div className="landing-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="landing-page">
        <div className="landing-container d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Welcome Section for Logged-in Users */}
        {user && (
          <div className="welcome-section text-center mb-5">
            {/* <h1 className="welcome-title" style={{ 
              color: "#EF7C8E", 
              fontSize: "2.5rem", 
              fontWeight: "700",
              marginBottom: "1rem"
            }}>
              Welcome back, {user.name}! 
            </h1> */}
            <p style={{ 
              color: "#666666", 
              fontSize: "1.1rem",
              marginBottom: "2rem"
            }}>
              Discover amazing people to learn from and collaborate with
            </p>
            <div className="welcome-actions">
              <Link to="/discover" className="action-button view-profile me-3">
                Explore More Profiles
              </Link>
              <Link to="/chats" className="action-button request-button">
                View Messages
              </Link>
            </div>
          </div>
        )}

        {/* Hero Section for Non-logged-in Users */}
        {!user && (
          <div className="hero-section text-center mb-5">
            <h1 className="hero-title" style={{ 
              color: "#EF7C8E", 
              fontSize: "3rem", 
              fontWeight: "700",
              marginBottom: "1rem"
            }}>
              Welcome to SkillSwap 
            </h1>
            <p style={{ 
              color: "#666666", 
              fontSize: "1.2rem",
              marginBottom: "2rem"
            }}>
              Connect with skilled professionals, learn new skills, and grow together
            </p>
            <div className="hero-actions">
              <Link to="/login" className="action-button view-profile me-3">
                Get Started
              </Link>
              <Link to="/about_us" className="action-button request-button">
                Learn More
              </Link>
            </div>
          </div>
        )}

        <h1 className="page-title">
          {user ? "Featured Profiles" : "Discover Amazing People"}
        </h1>
        {user && (
          <div className="text-center mb-4">
            <p style={{ 
              color: "#666666", 
              fontSize: "0.9rem",
              backgroundColor: "rgba(239, 124, 142, 0.1)",
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              border: "1px solid rgba(239, 124, 142, 0.2)"
            }}>
              💡 <strong>Tip:</strong> Send connection requests to start learning from other users. 
              Manage your requests in the <Link to="/chats" style={{ color: "#EF7C8E", textDecoration: "underline" }}>Chats section</Link>.
            </p>
          </div>
        )}
        <div className="profiles-grid">
          {featuredUsers.length > 0 ? (
            featuredUsers.map((user) => (
              <ProfileCard
                key={user._id}
                profileImageUrl={user.picture}
                name={user.name}
                rating={user.rating}
                bio={user.bio}
                skills={user.skillsProficientAt}
                username={user.username}
                _id={user._id}
                requestStatus={user.requestStatus}
              />
            ))
          ) : (
            <div className="text-center" style={{ gridColumn: "1 / -1", padding: "3rem" }}>
              <div style={{ 
                backgroundColor: "rgba(255, 255, 255, 0.9)", 
                borderRadius: "20px", 
                padding: "2rem",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
              }}>
                <h3 style={{ color: "#EF7C8E", marginBottom: "1rem" }}>
                  {loading ? "Loading profiles..." : "No featured profiles available"}
                </h3>
                <p style={{ color: "#666666", marginBottom: "1.5rem" }}>
                  {loading 
                    ? "Please wait while we fetch amazing profiles for you..." 
                    : "We're working on bringing you the best profiles. Check back soon!"
                  }
                </p>
                {!loading && (
                  <div>
                    <p style={{ color: "#666666", fontSize: "0.9rem", marginBottom: "1rem" }}>
                      Be the first to join our community!
                    </p>
                    <Link to="/login" className="action-button view-profile">
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
