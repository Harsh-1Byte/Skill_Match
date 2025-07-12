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
  Form,
  Spinner,
  Alert,
  Badge,
  Modal
} from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const AdminSettings = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    fetchSettings();
  }, [user, navigate]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/settings");
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings data");
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      const response = await axios.put("/admin/settings", settings);
      toast.success("Settings saved successfully!");
      // Update the local settings with the response data
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(error.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleResetSettings = async () => {
    try {
      setSaving(true);
      const response = await axios.post("/admin/settings/reset");
      toast.success("Settings reset to defaults!");
      // Update the local settings with the response data
      setSettings(response.data.data);
    } catch (error) {
      console.error("Error resetting settings:", error);
      toast.error(error.response?.data?.message || "Failed to reset settings");
    } finally {
      setSaving(false);
      setShowResetModal(false);
    }
  };

  const handleBackupData = async () => {
    try {
      setSaving(true);
      const response = await axios.post("/admin/backup");
      const backupInfo = response.data.data;
      toast.success(`Data backup completed successfully! Backup ID: ${backupInfo.backupId}`);
    } catch (error) {
      console.error("Error creating backup:", error);
      toast.error(error.response?.data?.message || "Failed to create backup");
    } finally {
      setSaving(false);
      setShowBackupModal(false);
    }
  };

  const updateSetting = (section, key, value) => {
    setSettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value
        }
      };
    });
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

  if (!settings) {
    return (
      <div className="admin-settings" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                  onClick={() => navigate("/admin/analytics")}
                  className="fw-medium"
                  style={{ color: "#FAE8E0" }}
                >
                  Analytics
                </Nav.Link>
                <Nav.Link
                  active
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
              <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>Platform Settings ⚙️</h2>
              <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Configure platform behavior and system preferences.</p>
            </Col>
          </Row>
          
          <Row>
            <Col>
              <Card className="border-0 shadow-sm">
                <Card.Body className="text-center py-5">
                  <h4 style={{ color: "#2d2d2d" }}>No Settings Data Available</h4>
                  <p style={{ color: "#4a4a4a" }}>Unable to load settings data. Please try again later.</p>
                  <Button 
                    variant="primary" 
                    onClick={fetchSettings}
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
    <div className="admin-settings" style={{ backgroundColor: "#FAE8E0", minHeight: "100vh" }}>
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
                onClick={() => navigate("/admin/analytics")}
                className="fw-medium"
                style={{ color: "#FAE8E0" }}
              >
                Analytics
              </Nav.Link>
              <Nav.Link
                active
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
            <h2 className="fw-bold" style={{ color: "#2d2d2d" }}>Platform Settings ⚙️</h2>
            <p style={{ color: "#4a4a4a", marginBottom: "0" }}>Configure platform behavior and system preferences.</p>
          </Col>
          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button 
                variant="outline-warning" 
                onClick={() => setShowResetModal(true)}
                style={{ 
                  borderColor: "#D8A7B1", 
                  color: "#D8A7B1",
                  backgroundColor: "transparent"
                }}
              >
                🔄 Reset to Defaults
              </Button>
              <Button 
                variant="outline-info" 
                onClick={() => setShowBackupModal(true)}
                style={{ 
                  borderColor: "#B6E2D3", 
                  color: "#B6E2D3",
                  backgroundColor: "transparent"
                }}
              >
                💾 Backup Data
              </Button>
              <Button 
                variant="success" 
                onClick={handleSaveSettings}
                disabled={saving}
                style={{ backgroundColor: "#EF7C8E", border: "none" }}
              >
                {saving ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving...
                  </>
                ) : (
                  "💾 Save Settings"
                )}
              </Button>
            </div>
          </Col>
        </Row>

        {/* Platform Settings */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">Platform Configuration</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Site Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={settings?.platform?.siteName || ""}
                    onChange={(e) => updateSetting("platform", "siteName", e.target.value)}
                    style={{ borderColor: "#EF7C8E" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Site Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={settings?.platform?.siteDescription || ""}
                    onChange={(e) => updateSetting("platform", "siteDescription", e.target.value)}
                    style={{ borderColor: "#EF7C8E" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="maintenanceMode"
                    label="Maintenance Mode"
                    checked={settings?.platform?.maintenanceMode || false}
                    onChange={(e) => updateSetting("platform", "maintenanceMode", e.target.checked)}
                  />
                  <Form.Text style={{ color: "#4a4a4a" }}>
                    When enabled, only admins can access the platform
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="registrationEnabled"
                    label="Allow New Registrations"
                    checked={settings?.platform?.registrationEnabled || false}
                    onChange={(e) => updateSetting("platform", "registrationEnabled", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="emailVerification"
                    label="Require Email Verification"
                    checked={settings?.platform?.emailVerification || false}
                    onChange={(e) => updateSetting("platform", "emailVerification", e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0">Security Settings</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Minimum Password Length</Form.Label>
                  <Form.Control
                    type="number"
                    min="6"
                    max="20"
                    value={settings?.security?.passwordMinLength || 6}
                    onChange={(e) => updateSetting("security", "passwordMinLength", parseInt(e.target.value))}
                    style={{ borderColor: "#B6E2D3" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="requireSpecialChars"
                    label="Require Special Characters"
                    checked={settings?.security?.requireSpecialChars || false}
                    onChange={(e) => updateSetting("security", "requireSpecialChars", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Session Timeout (hours)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="168"
                    value={settings?.security?.sessionTimeout || 1}
                    onChange={(e) => updateSetting("security", "sessionTimeout", parseInt(e.target.value))}
                    style={{ borderColor: "#B6E2D3" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Max Login Attempts</Form.Label>
                  <Form.Control
                    type="number"
                    min="3"
                    max="10"
                    value={settings?.security?.maxLoginAttempts || 3}
                    onChange={(e) => updateSetting("security", "maxLoginAttempts", parseInt(e.target.value))}
                    style={{ borderColor: "#B6E2D3" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="enableTwoFactor"
                    label="Enable Two-Factor Authentication"
                    checked={settings?.security?.enableTwoFactor || false}
                    onChange={(e) => updateSetting("security", "enableTwoFactor", e.target.checked)}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Content and System Settings */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#D8A7B1", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0">Content Moderation</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="autoModeration"
                    label="Auto Moderation"
                    checked={settings?.content?.autoModeration || false}
                    onChange={(e) => updateSetting("content", "autoModeration", e.target.checked)}
                  />
                  <Form.Text style={{ color: "#4a4a4a" }}>
                    Automatically flag potentially inappropriate content
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="profanityFilter"
                    label="Profanity Filter"
                    checked={settings?.content?.profanityFilter || false}
                    onChange={(e) => updateSetting("content", "profanityFilter", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="imageModeration"
                    label="Image Moderation"
                    checked={settings?.content?.imageModeration || false}
                    onChange={(e) => updateSetting("content", "imageModeration", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Max Skills Per User</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    max="20"
                    value={settings?.content?.maxSkillsPerUser || 1}
                    onChange={(e) => updateSetting("content", "maxSkillsPerUser", parseInt(e.target.value))}
                    style={{ borderColor: "#D8A7B1" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Max Bio Length</Form.Label>
                  <Form.Control
                    type="number"
                    min="50"
                    max="1000"
                    value={settings?.content?.maxBioLength || 50}
                    onChange={(e) => updateSetting("content", "maxBioLength", parseInt(e.target.value))}
                    style={{ borderColor: "#D8A7B1" }}
                  />
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={6} className="mb-3">
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0", border: "none" }}>
                <h5 className="mb-0">System Configuration</h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Backup Frequency</Form.Label>
                  <Form.Select
                    value={settings?.system?.backupFrequency || "daily"}
                    onChange={(e) => updateSetting("system", "backupFrequency", e.target.value)}
                    style={{ borderColor: "#EF7C8E" }}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: "#2d2d2d", fontWeight: "600" }}>Log Retention (days)</Form.Label>
                  <Form.Control
                    type="number"
                    min="7"
                    max="365"
                    value={settings?.system?.logRetention || 7}
                    onChange={(e) => updateSetting("system", "logRetention", parseInt(e.target.value))}
                    style={{ borderColor: "#EF7C8E" }}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="cacheEnabled"
                    label="Enable Caching"
                    checked={settings?.system?.cacheEnabled || false}
                    onChange={(e) => updateSetting("system", "cacheEnabled", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="compressionEnabled"
                    label="Enable Compression"
                    checked={settings?.system?.compressionEnabled || false}
                    onChange={(e) => updateSetting("system", "compressionEnabled", e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="debugMode"
                    label="Debug Mode"
                    checked={settings?.system?.debugMode || false}
                    onChange={(e) => updateSetting("system", "debugMode", e.target.checked)}
                  />
                  <Form.Text style={{ color: "#4a4a4a" }}>
                    Enable detailed logging for development
                  </Form.Text>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Notifications Settings */}
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d", border: "none" }}>
                <h5 className="mb-0">Notification Settings</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="emailNotifications"
                        label="Email Notifications"
                        checked={settings?.notifications?.emailNotifications || false}
                        onChange={(e) => updateSetting("notifications", "emailNotifications", e.target.checked)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="pushNotifications"
                        label="Push Notifications"
                        checked={settings?.notifications?.pushNotifications || false}
                        onChange={(e) => updateSetting("notifications", "pushNotifications", e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="adminAlerts"
                        label="Admin Alerts"
                        checked={settings?.notifications?.adminAlerts || false}
                        onChange={(e) => updateSetting("notifications", "adminAlerts", e.target.checked)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="reportAlerts"
                        label="Report Alerts"
                        checked={settings?.notifications?.reportAlerts || false}
                        onChange={(e) => updateSetting("notifications", "reportAlerts", e.target.checked)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Reset Settings Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
          <Modal.Title>Reset Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "#2d2d2d" }}>
            Are you sure you want to reset all settings to their default values? This action cannot be undone.
          </p>
          <div style={{ backgroundColor: "#FAE8E0", padding: "15px", borderRadius: "8px", marginTop: "15px" }}>
            <h6 style={{ color: "#2d2d2d" }}>Settings that will be reset:</h6>
            <ul style={{ color: "#4a4a4a", marginBottom: "0" }}>
              <li>Platform configuration (site name, description, etc.)</li>
              <li>Security settings (password requirements, session timeout)</li>
              <li>Notification preferences</li>
              <li>Content moderation rules</li>
              <li>System configuration (backup frequency, caching)</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowResetModal(false)}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleResetSettings}
            disabled={saving}
            style={{ backgroundColor: "#D8A7B1", border: "none", color: "#2d2d2d" }}
          >
            {saving ? "Resetting..." : "Reset Settings"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Backup Data Modal */}
      <Modal show={showBackupModal} onHide={() => setShowBackupModal(false)}>
        <Modal.Header closeButton style={{ backgroundColor: "#B6E2D3", color: "#2d2d2d" }}>
          <Modal.Title>Backup Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: "#2d2d2d" }}>
            Create a complete backup of all platform data including users, reports, chats, ratings, and requests. 
            This may take a few minutes depending on the data size.
          </p>
          <div style={{ backgroundColor: "#FAE8E0", padding: "15px", borderRadius: "8px", marginTop: "15px" }}>
            <h6 style={{ color: "#2d2d2d" }}>Backup will include:</h6>
            <ul style={{ color: "#4a4a4a", marginBottom: "0" }}>
              <li>User accounts and profiles</li>
              <li>Reports and moderation data</li>
              <li>Chat conversations and messages</li>
              <li>User ratings and feedback</li>
              <li>Connection requests</li>
              <li>Platform settings</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowBackupModal(false)}
            style={{ backgroundColor: "#6c757d", border: "none" }}
          >
            Cancel
          </Button>
          <Button 
            variant="info" 
            onClick={handleBackupData}
            disabled={saving}
            style={{ backgroundColor: "#B6E2D3", border: "none", color: "#2d2d2d" }}
          >
            {saving ? "Creating Backup..." : "Create Backup"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminSettings; 