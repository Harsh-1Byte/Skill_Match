import React from "react";
import Card from "react-bootstrap/Card";
import "./Card.css";
import { Link } from "react-router-dom";

const ProfileCard = ({ profileImageUrl, bio, name, skills, rating, username }) => {
  // Ensure we have valid data with fallbacks
  const displayName = name || "Unknown User";
  const displayBio = bio || "No bio available";
  const displaySkills = skills && Array.isArray(skills) ? skills : ["No skills listed"];
  const displayRating = rating || 0;
  const displayImage = profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
  const displayUsername = username || "unknown";

  return (
    <div className="card-container">
      <img 
        className="img-container" 
        src={displayImage} 
        alt={displayName}
        onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
        }}
      />
      <h3>{displayName}</h3>
      <h6>Rating: {displayRating} ⭐</h6>
      <p style={{ 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis", 
        width: "100%", 
        maxWidth: "250px",
        margin: "0 auto",
        padding: "0 10px"
      }}>{displayBio}</p>
      <div className="prof-buttons">
        <Link to={`/profile/${displayUsername}`}>
          <button className="primary ghost">View Profile</button>
        </Link>
      </div>
      <div className="profskills">
        <h6>Skills</h6>
        <div className="profskill-boxes">
          {displaySkills.map((skill, index) => (
            <div key={index} className="profskill-box">
              <span className="skill">{skill}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
