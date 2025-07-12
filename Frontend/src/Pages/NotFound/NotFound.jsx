import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #FAE8E0 0%, #B6E2D3 100%)",
      color: "#2d2d2d",
      fontFamily: "Montserrat, sans-serif"
    }}>
      <h1 style={{ 
        fontSize: "6rem", 
        color: "#EF7C8E", 
        marginBottom: "1rem",
        fontWeight: "bold"
      }}>
        404
      </h1>
      <h2 style={{ 
        color: "#2d2d2d", 
        marginBottom: "1rem",
        fontWeight: "600"
      }}>
        Page Not Found
      </h2>
      <p style={{ 
        color: "#4a4a4a", 
        marginBottom: "2rem",
        textAlign: "center",
        maxWidth: "500px"
      }}>
        The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
      </p>
      <Link to="/" style={{
        background: "linear-gradient(45deg, #EF7C8E 0%, #D8A7B1 100%)",
        color: "#FAE8E0",
        padding: "12px 24px",
        borderRadius: "25px",
        textDecoration: "none",
        fontWeight: "600",
        textTransform: "uppercase",
        letterSpacing: "0.5px",
        transition: "all 0.3s ease",
        border: "2px solid #EF7C8E"
      }}>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
