import React, { useState, useEffect } from "react";
import { useUser } from "../../util/UserContext";
import { useNavigate } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Navbar, 
  Nav,
  Spinner,
  ProgressBar,
  Badge
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AdminAnalytics = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7d");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchAnalytics();
  }, [user, navigate, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/analytics?timeRange=${timeRange}`);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast.error("Failed to load analytics data");
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

  const calculatePercentage = (value, total) => {
    return total > 0 ? Math.round((value / total) * 100) : 0;
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
      <div className="admin-analytics" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                  onClick={() => navigate("/admin/dashboard")}
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
                  active
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Analytics
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
              <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>Analytics Dashboard 📊</h2>
              <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Comprehensive insights into platform performance.</p>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <h4 style={{ color: "#2d2d2d" }}>No Analytics Data Available</h4>
                  <p style={{ color: "#4a4a4a" }}>Unable to load analytics data. Please try again later.</p>
                  <Button 
                    variant="primary" 
                    onClick={fetchAnalytics}
                    style={{ backgroundColor: "#EF7C8E", border: "none" }}
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
    <div className="admin-analytics" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                onClick={() => navigate("/admin/dashboard")}
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
                active
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Analytics
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
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>Analytics Dashboard 📊</h2>
            <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Comprehensive insights into platform performance.</p>
          </Col>
          <Col xs="auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: "8px 12px",
                border: "2px solid #EF7C8E",
                borderRadius: "8px",
                backgroundColor: "white",
                color: "#2d2d2d"
              }}
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>
          </Col>
        </Row>

        {/* Key Metrics */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Card className="h-100 border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className="fw-bold mb-1" style={{ color: "#B6E2D3" }}>
                      {analytics?.overview?.totalUsers?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Total Users</p>
                    <small style={{ color: "#B6E2D3" }}>+{analytics?.overview?.newUsers || "0"} new this period</small>
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
                    <h3 className="fw-bold mb-1" style={{ color: "#EF7C8E" }}>
                      {analytics?.overview?.activeUsers?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Active Users</p>
                    <small style={{ color: "#EF7C8E" }}>
                      {analytics?.overview?.totalUsers ? calculatePercentage(analytics.overview.activeUsers, analytics.overview.totalUsers) : "0"}% of total
                    </small>
                  </div>
                  <div style={{ backgroundColor: "#EF7C8E", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">🟢</span>
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
                    <h3 className="fw-bold mb-1" style={{ color: "#D8A7B1" }}>
                      {analytics?.overview?.averageRating || "N/A"}
                    </h3>
                    <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Avg Rating</p>
                    <small style={{ color: "#D8A7B1" }}>From {analytics?.overview?.totalRatings || "0"} ratings</small>
                  </div>
                  <div style={{ backgroundColor: "#D8A7B1", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">⭐</span>
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
                    <h3 className="fw-bold mb-1" style={{ color: "#B6E2D3" }}>
                      {analytics?.overview?.totalChats?.toLocaleString() || "N/A"}
                    </h3>
                    <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Total Chats</p>
                    <small style={{ color: "#B6E2D3" }}>Active conversations</small>
                  </div>
                  <div style={{ backgroundColor: "#B6E2D3", opacity: 0.2, padding: "12px", borderRadius: "8px" }}>
                    <span className="fs-4">💬</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* User Activity Breakdown */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">User Activity Breakdown</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Active Users</span>
                    <span style={{ color: "#EF7C8E" }}>{analytics?.userActivity?.activeUsers || "N/A"}</span>
                  </div>
                  <ProgressBar 
                    now={analytics?.userActivity?.activeUsers ? calculatePercentage(analytics.userActivity.activeUsers, analytics.overview.totalUsers) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="success"
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Inactive Users</span>
                    <span style={{ color: "#D8A7B1" }}>{analytics?.userActivity?.inactiveUsers || "N/A"}</span>
                  </div>
                  <ProgressBar 
                    now={analytics?.userActivity?.inactiveUsers ? calculatePercentage(analytics.userActivity.inactiveUsers, analytics.overview.totalUsers) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="warning"
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Banned Users</span>
                    <span style={{ color: "#EF7C8E" }}>{analytics?.userActivity?.bannedUsers || "N/A"}</span>
                  </div>
                  <ProgressBar 
                    now={analytics?.userActivity?.bannedUsers ? calculatePercentage(analytics.userActivity.bannedUsers, analytics.overview.totalUsers) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="danger"
                  />
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Premium Users</span>
                    <span style={{ color: "#B6E2D3" }}>{analytics?.userActivity?.premiumUsers || "N/A"}</span>
                  </div>
                  <ProgressBar 
                    now={analytics?.userActivity?.premiumUsers ? calculatePercentage(analytics.userActivity.premiumUsers, analytics.overview.totalUsers) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="info"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0">Report Status</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Pending Reports</span>
                    <Badge bg="warning" style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
                      {analytics?.reports?.pending || "N/A"}
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={analytics?.reports?.pending ? calculatePercentage(analytics.reports.pending, analytics.reports.total) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="warning"
                  />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Resolved Reports</span>
                    <Badge bg="success" style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d" }}>
                      {analytics?.reports?.resolved || "N/A"}
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={analytics?.reports?.resolved ? calculatePercentage(analytics.reports.resolved, analytics.reports.total) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="success"
                  />
                </div>
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span style={{ color: "#2d2d2d" }}>Dismissed Reports</span>
                    <Badge bg="secondary" style={{ backgroundColor: "#D8A7B1", color: "#2d2d2d" }}>
                      {analytics?.reports?.dismissed || "N/A"}
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={analytics?.reports?.dismissed ? calculatePercentage(analytics.reports.dismissed, analytics.reports.total) : 0} 
                    style={{ backgroundColor: "#FAE8E0" }}
                    variant="secondary"
                  />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Recent Activity */}
        <Row className="mb-4">
          <Col lg={12} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">Recent Activity</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col lg={6}>
                    <h6 style={{ color: "#2d2d2d" }}>New Users</h6>
                    {analytics?.recentActivity?.newUsers?.map((user, index) => (
                      <div key={index} className="mb-2 p-2" style={{ backgroundColor: "#FAE8E0", borderRadius: "8px" }}>
                        <div style={{ color: "#2d2d2d", fontWeight: "600" }}>{user.name}</div>
                        <small style={{ color: "#4a4a4a" }}>@{user.username} • {user.time}</small>
                      </div>
                    ))}
                  </Col>
                  <Col lg={6}>
                    <h6 style={{ color: "#2d2d2d" }}>New Reports</h6>
                    {analytics?.recentActivity?.newReports?.map((report, index) => (
                      <div key={index} className="mb-2 p-2" style={{ backgroundColor: "#FAE8E0", borderRadius: "8px" }}>
                        <div style={{ color: "#2d2d2d", fontWeight: "600" }}>{report.reason}</div>
                        <small style={{ color: "#4a4a4a" }}>
                          {report.reporter} → {report.reported} • {report.time}
                        </small>
                      </div>
                    ))}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Export and Actions */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0">Export & Actions</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex gap-2 flex-wrap">
                  <Button 
                    variant="outline-primary" 
                    style={{ 
                      borderColor: "#EF7C8E", 
                      color: "#EF7C8E",
                      backgroundColor: "transparent"
                    }}
                    onClick={() => toast.info("Export feature coming soon!")}
                  >
                    📊 Export Analytics
                  </Button>
                  <Button 
                    variant="outline-success" 
                    style={{ 
                      borderColor: "#B6E2D3", 
                      color: "#B6E2D3",
                      backgroundColor: "transparent"
                    }}
                    onClick={() => toast.info("Report generation coming soon!")}
                  >
                    📄 Generate Report
                  </Button>
                  <Button 
                    variant="outline-warning" 
                    style={{ 
                      borderColor: "#D8A7B1", 
                      color: "#D8A7B1",
                      backgroundColor: "transparent"
                    }}
                    onClick={() => toast.info("Data backup coming soon!")}
                  >
                    💾 Backup Data
                  </Button>
                  <Button 
                    variant="outline-info" 
                    style={{ 
                      borderColor: "#EF7C8E", 
                      color: "#EF7C8E",
                      backgroundColor: "transparent"
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
      </Container>
    </div>
  );
};

export default AdminAnalytics; 