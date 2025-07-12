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

const AdminUsers = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/users");
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users data");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const handleBlockUser = async (userId, username, isCurrentlyBanned) => {
    try {
      const response = await axios.patch(`/admin/users/${userId}/ban`, {
        isBanned: !isCurrentlyBanned
      });
      
      toast.success(`User ${isCurrentlyBanned ? "unbanned" : "banned"} successfully`);
      
      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId 
            ? { ...user, isBanned: !isCurrentlyBanned }
            : user
        )
      );
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      toast.error(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

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
    <div className="admin-users" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                active
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
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>User Management 👥</h2>
            <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Manage all users on the platform.</p>
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
                placeholder="Search users by name, username, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: "#EF7C8E" }}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              style={{ borderColor: "#EF7C8E" }}
            >
              <option value="all">All Roles</option>
              <option value="user">Users</option>
              <option value="admin">Admins</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Button 
              variant="outline-primary" 
              onClick={fetchUsers}
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

        {/* Users Table */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">Users ({filteredUsers.length})</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive className="mb-0">
                  <thead style={{ backgroundColor: "#FAE8E0" }}>
                    <tr>
                      <th style={{ color: "#2d2d2d" }}>User</th>
                      <th style={{ color: "#2d2d2d" }}>Role</th>
                      <th style={{ color: "#2d2d2d" }}>Status</th>
                      <th style={{ color: "#2d2d2d" }}>Rating</th>
                      <th style={{ color: "#2d2d2d" }}>Joined</th>
                      <th style={{ color: "#2d2d2d" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} style={{ borderBottom: "1px solid #e9ecef" }}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={user.picture || "https://via.placeholder.com/40"}
                              alt={user.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                marginRight: "12px"
                              }}
                            />
                            <div>
                              <div style={{ color: "#2d2d2d", fontWeight: "600" }}>{user.name}</div>
                              <small style={{ color: "#4a4a4a" }}>@{user.username}</small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Badge 
                            bg={user.role === "admin" ? "danger" : "primary"}
                            style={{ 
                              backgroundColor: user.role === "admin" ? "#EF7C8E" : "#B6E2D3",
                              color: user.role === "admin" ? "#FAE8E0" : "#2d2d2d"
                            }}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          <Badge 
                            bg={user.isBanned ? "danger" : "success"}
                            style={{ 
                              backgroundColor: user.isBanned ? "#EF7C8E" : "#B6E2D3",
                              color: user.isBanned ? "#FAE8E0" : "#2d2d2d"
                            }}
                          >
                            {user.isBanned ? "Banned" : "Active"}
                          </Badge>
                        </td>
                        <td>
                          <span style={{ color: "#EF7C8E" }}>⭐ {user.rating || "N/A"}</span>
                        </td>
                        <td>
                          <small style={{ color: "#4a4a4a" }}>
                            {new Date(user.createdAt).toLocaleDateString()}
                          </small>
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Button
                              size="sm"
                              variant="outline-info"
                              onClick={() => handleViewUser(user)}
                              style={{ 
                                borderColor: "#B6E2D3", 
                                color: "#B6E2D3",
                                backgroundColor: "transparent"
                              }}
                            >
                              👁️
                            </Button>
                            {user.role !== "admin" && (
                              <Button
                                size="sm"
                                variant={user.isBanned ? "outline-success" : "outline-danger"}
                                onClick={() => handleBlockUser(user._id, user.username, user.isBanned)}
                                style={{ 
                                  borderColor: user.isBanned ? "#B6E2D3" : "#EF7C8E", 
                                  color: user.isBanned ? "#B6E2D3" : "#EF7C8E",
                                  backgroundColor: "transparent"
                                }}
                              >
                                {user.isBanned ? "Unban" : "Ban"}
                              </Button>
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

      {/* User Details Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="lg">
        <Modal.Header closeButton style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div>
              <Row>
                <Col md={4} className="text-center">
                  <img
                    src={selectedUser.picture || "https://via.placeholder.com/150"}
                    alt={selectedUser.name}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      marginBottom: "20px"
                    }}
                  />
                  <h4 style={{ color: "#2d2d2d" }}>{selectedUser.name}</h4>
                  <p style={{ color: "#4a4a4a" }}>@{selectedUser.username}</p>
                  <Badge 
                    bg={selectedUser.role === "admin" ? "danger" : "primary"}
                    style={{ 
                      backgroundColor: selectedUser.role === "admin" ? "#EF7C8E" : "#B6E2D3",
                      color: selectedUser.role === "admin" ? "#FAE8E0" : "#2d2d2d"
                    }}
                  >
                    {selectedUser.role}
                  </Badge>
                </Col>
                <Col md={8}>
                  <h5 style={{ color: "#2d2d2d" }}>Contact Information</h5>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Joined:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  <p><strong>Rating:</strong> ⭐ {selectedUser.rating || "N/A"}</p>
                  
                  <h5 style={{ color: "#2d2d2d", marginTop: "20px" }}>Skills Proficient At</h5>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {selectedUser.skillsProficientAt?.map((skill, index) => (
                      <Badge key={index} bg="success" style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d" }}>
                        {skill}
                      </Badge>
                    )) || <span style={{ color: "#4a4a4a" }}>No skills listed</span>}
                  </div>
                  
                  <h5 style={{ color: "#2d2d2d" }}>Skills Want To Learn</h5>
                  <div className="d-flex flex-wrap gap-1">
                    {selectedUser.skillsWantToLearn?.map((skill, index) => (
                      <Badge key={index} bg="info" style={{ backgroundColor: "#D8A7B1", color: "#2d2d2d" }}>
                        {skill}
                      </Badge>
                    )) || <span style={{ color: "#4a4a4a" }}>No skills listed</span>}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowUserModal(false)}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminUsers; 