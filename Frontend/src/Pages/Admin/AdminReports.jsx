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
  Form,
  InputGroup,
  Spinner,
  Modal
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AdminReports = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchReports();
  }, [user, navigate]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/reports");
      setReports(response.data.data.reports || []);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports data");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const handleResolveReport = async (reportId, status) => {
    try {
      const response = await axios.patch(`/admin/reports/${reportId}/status`, {
        status: status
      });
      
      toast.success(`Report ${status === "resolved" ? "resolved" : "dismissed"} successfully`);
      
      // Update the report in the local state
      setReports(prevReports => 
        prevReports.map(report => 
          report._id === reportId 
            ? { ...report, status: status, updatedAt: new Date().toISOString() }
            : report
        )
      );
    } catch (error) {
      console.error("Error resolving report:", error);
      toast.error(error.response?.data?.message || "Failed to update report status");
    }
  };

  const handleBanReportedUser = async (userId, username) => {
    try {
      const response = await axios.patch(`/admin/users/${userId}/ban`, {
        isBanned: true
      });
      
      toast.success(`User ${username} has been banned`);
    } catch (error) {
      console.error("Error banning user:", error);
      toast.error(error.response?.data?.message || "Failed to ban user");
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = 
      report.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reporter.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reported.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || report.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#EF7C8E", color: "#FAE8E0" };
      case "resolved":
        return { backgroundColor: "#B6E2D3", color: "#2d2d2d" };
      case "dismissed":
        return { backgroundColor: "#D8A7B1", color: "#2d2d2d" };
      default:
        return { backgroundColor: "#6c757d", color: "#FAE8E0" };
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

  return (
    <div className="admin-reports" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                active
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
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>Report Management 📊</h2>
            <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Review and manage user reports.</p>
          </Col>
        </Row>

        {/* Filters */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                🔍
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search reports by user names or reason..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: "#EF7C8E" }}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ borderColor: "#EF7C8E" }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button 
              variant="outline-primary" 
              onClick={fetchReports}
              style={{ 
                borderColor: "#EF7C8E", 
                color: "#EF7C8E",
                backgroundColor: "transparent"
              }}
            >
              🔄 Refresh
            </Button>
          </Col>
        </Row>

        {/* Reports Table */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">Reports ({filteredReports.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead style={{ backgroundColor: "#FAE8E0" }}>
                    <tr>
                      <th style={{ color: "#2d2d2d" }}>Reporter</th>
                      <th style={{ color: "#2d2d2d" }}>Reported User</th>
                      <th style={{ color: "#2d2d2d" }}>Reason</th>
                      <th style={{ color: "#2d2d2d" }}>Status</th>
                      <th style={{ color: "#2d2d2d" }}>Date</th>
                      <th style={{ color: "#2d2d2d" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredReports.map((report) => (
                      <tr key={report._id} style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td>
                          <div>
                            <div style={{ color: "#2d2d2d", fontWeight: "600" }}>{report.reporter.name}</div>
                            <small style={{ color: "#4a4a4a" }}>@{report.reporter.username}</small>
                          </div>
                        </td>
                        <td>
                          <div>
                            <div style={{ color: "#2d2d2d", fontWeight: "600" }}>{report.reported.name}</div>
                            <small style={{ color: "#4a4a4a" }}>@{report.reported.username}</small>
                          </div>
                        </td>
                        <td>
                          <div style={{ color: "#2d2d2d" }}>{report.reason}</div>
                          <small style={{ color: "#4a4a4a" }}>
                            {report.description.length > 50 
                              ? `${report.description.substring(0, 50)}...` 
                              : report.description}
                          </small>
                        </td>
                        <td>
                          <Badge style={getStatusBadgeColor(report.status)}>
                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                          </Badge>
                        </td>
                        <td>
                          <small style={{ color: "#4a4a4a" }}>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleViewReport(report)}
                              style={{ 
                                borderColor: "#B6E2D3", 
                                color: "#B6E2D3",
                                backgroundColor: "transparent"
                              }}
                            >
                              👁️
                            </Button>
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline-success"
                                  onClick={() => handleResolveReport(report._id, "resolved")}
                                  style={{ 
                                    borderColor: "#B6E2D3", 
                                    color: "#B6E2D3",
                                    backgroundColor: "transparent"
                                  }}
                                >
                                  ✓
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-warning"
                                  onClick={() => handleResolveReport(report._id, "dismissed")}
                                  style={{ 
                                    borderColor: "#D8A7B1", 
                                    color: "#D8A7B1",
                                    backgroundColor: "transparent"
                                  }}
                                >
                                  ✗
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline-danger"
                                  onClick={() => handleBanReportedUser(report.reported._id, report.reported.username)}
                                  style={{ 
                                    borderColor: "#EF7C8E", 
                                    color: "#EF7C8E",
                                    backgroundColor: "transparent"
                                  }}
                                >
                                  🚫
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Report Details Modal */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
          <Modal.Title>Report Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <div>
              <Row className="mb-4">
                <Col md={6}>
                  <h5 style={{ color: "#2d2d2d" }}>Reporter</h5>
                  <Card style={{ backgroundColor: "#FAE8E0", border: "none" }}>
                    <Card.Body>
                      <h6 style={{ color: "#2d2d2d" }}>{selectedReport.reporter.name}</h6>
                      <p style={{ color: "#4a4a4a", marginBottom: "5px" }}>@{selectedReport.reporter.username}</p>
                      <p style={{ color: "#4a4a4a", marginBottom: "0" }}>{selectedReport.reporter.email}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <h5 style={{ color: "#2d2d2d" }}>Reported User</h5>
                  <Card style={{ backgroundColor: "#FAE8E0", border: "none" }}>
                    <Card.Body>
                      <h6 style={{ color: "#2d2d2d" }}>{selectedReport.reported.name}</h6>
                      <p style={{ color: "#4a4a4a", marginBottom: "5px" }}>@{selectedReport.reported.username}</p>
                      <p style={{ color: "#4a4a4a", marginBottom: "0" }}>{selectedReport.reported.email}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              
              <Row className="mb-4">
                <Col>
                  <h5 style={{ color: "#2d2d2d" }}>Report Information</h5>
                  <Card style={{ backgroundColor: "#FAE8E0", border: "none" }}>
                    <Card.Body>
                      <p><strong style={{ color: "#2d2d2d" }}>Reason:</strong> {selectedReport.reason}</p>
                      <p><strong style={{ color: "#2d2d2d" }}>Description:</strong></p>
                      <p style={{ color: "#4a4a4a" }}>{selectedReport.description}</p>
                      <p><strong style={{ color: "#2d2d2d" }}>Status:</strong> 
                        <Badge className="ms-2" style={getStatusBadgeColor(selectedReport.status)}>
                          {selectedReport.status.charAt(0).toUpperCase() + selectedReport.status.slice(1)}
                        </Badge>
                      </p>
                      <p><strong style={{ color: "#2d2d2d" }}>Reported on:</strong> {new Date(selectedReport.createdAt).toLocaleString()}</p>
                      {selectedReport.updatedAt !== selectedReport.createdAt && (
                        <p><strong style={{ color: "#2d2d2d" }}>Last updated:</strong> {new Date(selectedReport.updatedAt).toLocaleString()}</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedReport && selectedReport.status === "pending" && (
            <>
              <Button 
                variant="success" 
                onClick={() => {
                  handleResolveReport(selectedReport._id, "resolved");
                  setShowReportModal(false);
                }}
                style={{ backgroundColor: "#B6E2D3", border: "none", color: "#2d2d2d" }}
              >
                Resolve Report
              </Button>
              <Button 
                variant="warning" 
                onClick={() => {
                  handleResolveReport(selectedReport._id, "dismissed");
                  setShowReportModal(false);
                }}
                style={{ backgroundColor: "#D8A7B1", border: "none", color: "#2d2d2d" }}
              >
                Dismiss Report
              </Button>
              <Button 
                variant="danger" 
                onClick={() => {
                  handleBanReportedUser(selectedReport.reported._id, selectedReport.reported.username);
                  setShowReportModal(false);
                }}
                style={{ backgroundColor: "#EF7C8E", border: "none" }}
              >
                Ban User
              </Button>
            </>
          )}
          <Button 
            variant="secondary" 
            onClick={() => setShowReportModal(false)}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminReports; 