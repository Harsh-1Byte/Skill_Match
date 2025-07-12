import React, { useState, useEffect } from "react";
import { useUser } from "../../util/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Table, 
  Badge, 
  Navbar, 
  Nav,
  ProgressBar,
  Spinner
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AdminDashboard = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchAnalytics();
  }, [user, navigate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/dashboard");
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load dashboard data");
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const handleViewProfile = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleBlockUser = async (userId, username, isCurrentlyBanned) => {
    try {
      const action = isCurrentlyBanned ? "unban" : "ban";
      const response = await axios.patch(`/admin/users/${userId}/ban`, {
        isBanned: !isCurrentlyBanned
      });
      
      toast.success(`User ${isCurrentlyBanned ? "unbanned" : "banned"} successfully`);
      
      // Refresh analytics to update the data
      fetchAnalytics();
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="admin-dashboard" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
        {/* Admin Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar shadow-sm" style={{ backgroundColor: "#EF7C8E" }}>
          <Container fluid>
            <Navbar.Brand className="fw-bold" style={{ color: "#FAE8E0" }}>
              <span className="me-2">🛡️</span>
              SkillSwap Admin Panel
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="admin-nav" />
            <Navbar.Collapse id="admin-nav">
              <Nav className="me-auto">
                <Nav.Link
                  active={activeTab === "dashboard"}
                  onClick={() => setActiveTab("dashboard")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Dashboard
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/admin/users")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Users
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/admin/reports")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Reports
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/admin/analytics")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Analytics
                </Nav.Link>
                <Nav.Link
                  onClick={() => navigate("/admin/settings")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Settings
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link onClick={() => navigate("/")} className="fw-medium" style={{ color: "#FAE8E0" }}>
                  Back to Site
                </Nav.Link>
                <Nav.Link onClick={handleLogout} className="fw-medium" style={{ color: "#FAE8E0" }}>
                  Logout
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container fluid className="mt-4">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold" style={{ color: "#1a1a1a", fontSize: "2.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                Welcome back, {user?.name}! 👋
              </h2>
              <p style={{ color: "#333333", marginBottom: "0", fontSize: "1.1rem", fontWeight: "500" }}>
                Here's what's happening with your platform today.
              </p>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <h4 style={{ color: "#1a1a1a", fontSize: "1.8rem", fontWeight: "700", marginBottom: "1rem" }}>No Dashboard Data Available</h4>
                  <p style={{ color: "#333333", fontSize: "1.1rem", fontWeight: "500", marginBottom: "2rem" }}>Unable to load dashboard data. Please try again later.</p>
                  <Button 
                    variant="primary" 
                    onClick={fetchAnalytics}
                    style={{ backgroundColor: "#EF7C8E", border: "none", fontWeight: "600", fontSize: "1rem", padding: "0.75rem 2rem" }}
                  >
                    🔄 Retry
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  return (
    <div className="admin-dashboard" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
      {/* Admin Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="admin-navbar shadow-sm" style={{ backgroundColor: "#EF7C8E" }}>
        <Container fluid>
          <Navbar.Brand className="fw-bold" style={{ color: "#FAE8E0" }}>
            <span className="me-2">🛡️</span>
            SkillSwap Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="admin-nav" />
          <Navbar.Collapse id="admin-nav">
            <Nav className="me-auto">
              <Nav.Link
                active={activeTab === "dashboard"}
                onClick={() => setActiveTab("dashboard")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Dashboard
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/admin/users")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Users
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/admin/reports")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Reports
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/admin/analytics")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Analytics
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/admin/settings")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Settings
              </Nav.Link>
            </Nav>
            <Nav>
              <Nav.Link onClick={() => navigate("/")} className="fw-medium" style={{ color: "#FAE8E0" }}>
                Back to Site
              </Nav.Link>
              <Nav.Link onClick={handleLogout} className="fw-medium" style={{ color: "#FAE8E0" }}>
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid className="mt-4">
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            {/* <h2 className="fw-bold" style={{ color: "#1a1a1a", fontSize: "2.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
              Welcome back, {user?.name}! 👋
            </h2> */}
            <p style={{ color: "#333333", marginBottom: "0", fontSize: "1.1rem", fontWeight: "500" }}>
              Here's what's happening with your platform today.
            </p>
          </Col>
        </Row>

        {/* Analytics Cards */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#B6E2D3", fontSize: "2.2rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      {analytics?.overview?.totalUsers?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#1a1a1a", marginBottom: "0", fontSize: "1rem", fontWeight: "600" }}>Total Users</p>
                    <small style={{ color: "#B6E2D3", fontSize: "0.9rem", fontWeight: "500" }}>+{analytics?.overview?.newUsersThisWeek || "0"} new this week</small>
                  </div>
                  <div style={{ backgroundColor: "#B6E2D3", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">👥</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#EF7C8E", fontSize: "2.2rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      {analytics?.overview?.pendingReports || "0"}
                    </h3>
                    <p style={{ color: "#1a1a1a", marginBottom: "0", fontSize: "1rem", fontWeight: "600" }}>Pending Reports</p>
                    <small style={{ color: "#EF7C8E", fontSize: "0.9rem", fontWeight: "500" }}>Requires attention</small>
                  </div>
                  <div style={{ backgroundColor: "#EF7C8E", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">⚠️</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#D8A7B1", fontSize: "2.2rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      {analytics?.overview?.totalChats?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#1a1a1a", marginBottom: "0", fontSize: "1rem", fontWeight: "600" }}>Total Chats</p>
                    <small style={{ color: "#D8A7B1", fontSize: "0.9rem", fontWeight: "500" }}>Active conversations</small>
                  </div>
                  <div style={{ backgroundColor: "#D8A7B1", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">💬</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#B6E2D3", fontSize: "2.2rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                      {analytics?.overview?.totalRatings?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#1a1a1a", marginBottom: "0", fontSize: "1rem", fontWeight: "600" }}>Total Ratings</p>
                    <small style={{ color: "#B6E2D3", fontSize: "0.9rem", fontWeight: "500" }}>User feedback</small>
                  </div>
                  <div style={{ backgroundColor: "#B6E2D3", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">⭐</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity and Top Users */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>Recent Users</h5>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  {analytics?.recentActivity?.recentUsers?.map((user, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold" style={{ color: "#1a1a1a", fontSize: "1.1rem" }}>{user.name}</h6>
                          <small style={{ color: "#333333", fontSize: "0.95rem", fontWeight: "500" }}>@{user.username}</small>
                        </div>
                        <small style={{ color: "#B6E2D3", fontSize: "0.9rem", fontWeight: "600" }}>{user.createdAt}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>Top Rated Users</h5>
              </Card.Header>
              <Card.Body>
                <div className="list-group list-group-flush">
                  {analytics?.topRatedUsers?.map((user, index) => (
                    <div key={index} className="list-group-item border-0 px-0">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-1 fw-bold" style={{ color: "#1a1a1a", fontSize: "1.1rem" }}>{user.name}</h6>
                          <small style={{ color: "#333333", fontSize: "0.95rem", fontWeight: "500" }}>@{user.username}</small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span style={{ color: "#EF7C8E", fontSize: "1rem", fontWeight: "600" }}>⭐ {user.rating}</span>
                          <Badge 
                            bg={user.isBanned ? "danger" : "success"}
                            style={{ backgroundColor: user.isBanned ? "#EF7C8E" : "#B6E2D3", color: user.isBanned ? "#FAE8E0" : "#2d2d2d", fontWeight: "600" }}
                          >
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Quick Actions */}
        <Row className="mb-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#D8A7B1", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>Quick Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="outline-primary" 
                    style={{ 
                      borderColor: "#EF7C8E", 
                      color: "#EF7C8E",
                      backgroundColor: "transparent",
                      fontWeight: "600",
                      fontSize: "0.95rem"
                    }}
                    onClick={() => navigate("/admin/users")}
                  >
                    👥 Manage Users
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    style={{ 
                      borderColor: "#B6E2D3", 
                      color: "#B6E2D3",
                      backgroundColor: "transparent",
                      fontWeight: "600",
                      fontSize: "0.95rem"
                    }}
                    onClick={() => navigate("/admin/reports")}
                  >
                    📊 View Reports
                  </Button>
                  <Button 
                    variant="outline-info" 
                    style={{ 
                      borderColor: "#D8A7B1", 
                      color: "#D8A7B1",
                      backgroundColor: "transparent",
                      fontWeight: "600",
                      fontSize: "0.95rem"
                    }}
                    onClick={() => navigate("/admin/analytics")}
                  >
                    📈 Analytics
                  </Button>
                  <Button 
                    variant="outline-success" 
                    style={{ 
                      borderColor: "#EF7C8E", 
                      color: "#EF7C8E",
                      backgroundColor: "transparent",
                      fontWeight: "600",
                      fontSize: "0.95rem"
                    }}
                    onClick={() => navigate("/admin/settings")}
                  >
                    ⚙️ Settings
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* System Status */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0 fw-bold" style={{ fontSize: "1.2rem" }}>System Status</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3}>
                    <div className="text-center">
                      <h6 style={{ color: "#1a1a1a", fontSize: "1.1rem", fontWeight: "600" }}>Server Status</h6>
                      <Badge bg="success" style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", fontWeight: "600", fontSize: "0.9rem" }}>Online</Badge>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6 style={{ color: "#1a1a1a", fontSize: "1.1rem", fontWeight: "600" }}>Database</h6>
                      <Badge bg="success" style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", fontWeight: "600", fontSize: "0.9rem" }}>Connected</Badge>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6 style={{ color: "#1a1a1a", fontSize: "1.1rem", fontWeight: "600" }}>API Status</h6>
                      <Badge bg="success" style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", fontWeight: "600", fontSize: "0.9rem" }}>Healthy</Badge>
                    </div>
                  </Col>
                  <Col md={3}>
                    <div className="text-center">
                      <h6 style={{ color: "#1a1a1a", fontSize: "1.1rem", fontWeight: "600" }}>Uptime</h6>
                      <span style={{ color: "#333333", fontSize: "1rem", fontWeight: "600" }}>99.9%</span>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard; 