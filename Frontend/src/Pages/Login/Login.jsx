import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import { FaGoogle } from "react-icons/fa";
import { Container, Row, Col, Card, Navbar } from "react-bootstrap";

const Login = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleGoogleLogin = () => {
    console.log("Google login button clicked, redirecting to:", "http://localhost:8000/auth/google");
    window.location.href = "http://localhost:8000/auth/google";
  };

  return (
    <div className="login-page" style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #FAE8E0 0%, #B6E2D3 100%)",
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ backgroundColor: "#EF7C8E" }}>
        <Container fluid>
          <Navbar.Brand className="fw-bold" style={{ color: "#FAE8E0" }}>
            <span className="me-2">🚀</span>
            SkillSwap
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        <Row className="justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
          <Col lg={6} md={8} sm={10} xs={12}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold" style={{ 
                color: "#1a1a1a", 
                fontSize: "3rem", 
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                marginBottom: "0.5rem"
              }}>
                Welcome Back! 👋
              </h1>
              <p style={{ 
                color: "#333333", 
                fontSize: "1.2rem", 
                fontWeight: "500",
                marginBottom: "2rem"
              }}>
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Login Card */}
            <Card className="border-0 shadow-lg" style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)"
            }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: "#EF7C8E",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem",
                    boxShadow: "0 4px 20px rgba(239, 124, 142, 0.3)"
                  }}>
                    <span style={{ fontSize: "2rem", color: "#FAE8E0" }}>🔐</span>
                  </div>
                  <h2 className="fw-bold" style={{ 
                    color: "#1a1a1a", 
                    fontSize: "2rem",
                    marginBottom: "0.5rem"
                  }}>
                    Sign In
                  </h2>
                  <p style={{ 
                    color: "#666666", 
                    fontSize: "1rem",
                    marginBottom: "2rem"
                  }}>
                    Choose your preferred login method
                  </p>
                </div>

                {/* Google Login Button */}
                <div className="d-grid gap-3">
                  <Button
                    size="lg"
                    onClick={handleGoogleLogin}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                      backgroundColor: isHovered ? "#d86a7a" : "#EF7C8E",
                      border: "none",
                      color: "#FAE8E0",
                      fontWeight: "600",
                      fontSize: "1.1rem",
                      padding: "15px 30px",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                      transform: isHovered ? "translateY(-2px)" : "translateY(0)",
                      boxShadow: isHovered 
                        ? "0 8px 25px rgba(239, 124, 142, 0.4)" 
                        : "0 4px 15px rgba(239, 124, 142, 0.2)"
                    }}
                  >
                    <FaGoogle style={{ 
                      marginRight: "12px", 
                      fontSize: "1.2rem" 
                    }} />
                    Continue with Google
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="text-center mt-4">
                  <p style={{ 
                    color: "#666666", 
                    fontSize: "0.9rem",
                    marginBottom: "1rem"
                  }}>
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                  
                  <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1rem",
                    marginTop: "2rem",
                    paddingTop: "2rem",
                    borderTop: "1px solid #B6E2D3"
                  }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#B6E2D3",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>🎓</span>
                    </div>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#D8A7B1",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>💡</span>
                    </div>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      backgroundColor: "#EF7C8E",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}>
                      <span style={{ fontSize: "1.2rem" }}>🚀</span>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Footer */}
            <div className="text-center mt-4">
              <p style={{ 
                color: "#666666", 
                fontSize: "0.9rem",
                marginBottom: "0.5rem"
              }}>
                New to SkillSwap?
              </p>
              <p style={{ 
                color: "#EF7C8E", 
                fontSize: "1rem",
                fontWeight: "600",
                margin: "0"
              }}>
                Start your learning journey today! ✨
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
