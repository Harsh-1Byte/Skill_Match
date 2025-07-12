import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "react-bootstrap/Spinner";
import Form from "react-bootstrap/Form";
import { skills } from "./Skills";
import axios from "axios";
import "./EditProfile.css";
import Badge from "react-bootstrap/Badge";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "../../util/UserContext";
import { Container, Row, Col, Card, Button, Navbar, Nav } from "react-bootstrap";

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { user, setUser } = useUser();

  const [form, setForm] = useState({
    profilePhoto: null,
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: [],
  });
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);

  const [activeKey, setActiveKey] = useState("registration");

  useEffect(() => {
    if (user) {
      setForm((prevState) => ({
        ...prevState,
        name: user?.name,
        email: user?.email,
        username: user?.username,
        skillsProficientAt: user?.skillsProficientAt,
        skillsToLearn: user?.skillsToLearn,
        portfolioLink: user?.portfolioLink,
        githubLink: user?.githubLink,
        linkedinLink: user?.linkedinLink,
        education: user?.education,
        bio: user?.bio,
        projects: user?.projects,
      }));
      setTechStack(user?.projects.map((project) => "Select some Tech Stack"));
    }
  }, []);

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab", "Preview"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) {
      setActiveKey(tabs[currentIndex + 1]);
    }
  };

  const handleFileChange = async (e) => {
    const data = new FormData();
    data.append("picture", e.target.files[0]);
    console.log("Data: ", data);
    try {
      toast.info("Uploading your pic please wait upload confirmation..");
      const response = await axios.post("/user/uploadPicture", data);
      toast.success("Pic uploaded successfully");
      // setPic(response.data.data.url);
      console.log("Pic url:", response.data);
      setForm(() => {
        return {
          ...form,
          picture: response.data.data.url,
        };
      });
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.message) {
        toast.error(error.response.data.message);
        if (error.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      }
    }
    // console.log(file);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prevState) => ({
        ...prevState,
        [name]: checked ? [...prevState[name], value] : prevState[name].filter((item) => item !== value),
      }));
    } else {
      if (name === "bio" && value.length > 500) {
        toast.error("Bio should be less than 500 characters");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    // console.log("Form: ", form);
  };

  const handleAddSkill = (e) => {
    const { name } = e.target;
    if (name === "skill_to_learn") {
      if (skillsToLearn === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsToLearn.includes(skillsToLearn)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsProficientAt.includes(skillsToLearn)) {
        toast.error("Skill already added in skills proficient at");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: [...prevState.skillsToLearn, skillsToLearn],
      }));
    } else {
      if (skillsProficientAt === "Select some skill") {
        toast.error("Select a skill to add");
        return;
      }
      if (form.skillsProficientAt.includes(skillsProficientAt)) {
        toast.error("Skill already added");
        return;
      }
      if (form.skillsToLearn.includes(skillsProficientAt)) {
        toast.error("Skill already added in skills to learn");
        return;
      }
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: [...prevState.skillsProficientAt, skillsProficientAt],
      }));
    }
    // console.log("Form: ", form);
  };

  const handleRemoveSkill = (e, temp) => {
    const skill = e.target.innerText.split(" ")[0];
    if (temp === "skills_proficient_at") {
      setForm((prevState) => ({
        ...prevState,
        skillsProficientAt: prevState.skillsProficientAt.filter((item) => item !== skill),
      }));
    } else {
      setForm((prevState) => ({
        ...prevState,
        skillsToLearn: prevState.skillsToLearn.filter((item) => item !== skill),
      }));
    }
    console.log("Form: ", form);
  };

  const handleRemoveEducation = (e, tid) => {
    const updatedEducation = form.education.filter((item, i) => item._id !== tid);
    console.log("Updated Education: ", updatedEducation);
    setForm((prevState) => ({
      ...prevState,
      education: updatedEducation,
    }));
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      education: prevState.education.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      projects: prevState.projects.map((item, i) => (i === index ? { ...item, [name]: value } : item)),
    }));
  };

  const validateRegForm = () => {
    if (!form.name) {
      toast.error("Name is required");
      return false;
    }
    if (!form.email) {
      toast.error("Email is required");
      return false;
    }
    if (!form.username) {
      toast.error("Username is required");
      return false;
    }
    if (form.username.length < 3) {
      toast.error("Username must be at least 3 characters long");
      return false;
    }
    if (form.username.length > 20) {
      toast.error("Username must be less than 20 characters long");
      return false;
    }
    if (!form.username.match(/^[a-zA-Z0-9_]+$/)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return false;
    }
    return true;
  };

  const validateEduForm = () => {
    for (let i = 0; i < form.education.length; i++) {
      const edu = form.education[i];
      if (!edu.institution) {
        toast.error("Institution name is required");
        return false;
      }
      if (!edu.degree) {
        toast.error("Degree is required");
        return false;
      }
      if (!edu.startDate) {
        toast.error("Start date is required");
        return false;
      }
      if (!edu.endDate) {
        toast.error("End date is required");
        return false;
      }
      if (new Date(edu.startDate) > new Date(edu.endDate)) {
        toast.error("Start date cannot be after end date");
        return false;
      }
    }
    return true;
  };

  const validateAddForm = () => {
    if (!form.bio) {
      toast.error("Bio is required");
      return false;
    }
    if (form.bio.length < 10) {
      toast.error("Bio must be at least 10 characters long");
      return false;
    }
    if (form.bio.length > 500) {
      toast.error("Bio must be less than 500 characters long");
      return false;
    }
    for (let i = 0; i < form.projects.length; i++) {
      const project = form.projects[i];
      if (!project.title) {
        toast.error("Project title is required");
        return false;
      }
      if (!project.description) {
        toast.error("Project description is required");
        return false;
      }
      if (!project.startDate) {
        toast.error("Project start date is required");
        return false;
      }
      if (!project.endDate) {
        toast.error("Project end date is required");
        return false;
      }
      if (new Date(project.startDate) > new Date(project.endDate)) {
        toast.error("Project start date cannot be after end date");
        return false;
      }
    }
    return true;
  };

  const handleSaveRegistration = async () => {
    if (!validateRegForm()) {
      return;
    }
    try {
      setSaveLoading(true);
      const { data } = await axios.patch("/user/registered/update", {
        name: form.name,
        username: form.username,
        portfolioLink: form.portfolioLink,
        githubLink: form.githubLink,
        linkedinLink: form.linkedinLink,
        skillsProficientAt: form.skillsProficientAt,
        skillsToLearn: form.skillsToLearn,
      });
      toast.success(data.message);
      setUser(data.data);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
    }
  };

  const handleSaveEducation = async () => {
    if (!validateEduForm()) {
      return;
    }
    try {
      setSaveLoading(true);
      const { data } = await axios.patch("/user/registered/update", {
        education: form.education,
      });
      toast.success(data.message);
      setUser(data.data);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
    }
  };

  const handleSaveAdditional = async () => {
    if (!validateAddForm()) {
      return;
    }
    try {
      setSaveLoading(true);
      const { data } = await axios.patch("/user/registered/update", {
        bio: form.bio,
        projects: form.projects,
      });
      toast.success(data.message);
      setUser(data.data);
      localStorage.setItem("userInfo", JSON.stringify(data.data));
      } catch (error) {
        console.log(error);
        if (error?.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Some error occurred");
        }
      } finally {
        setSaveLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="edit-profile-page">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ backgroundColor: "#EF7C8E" }}>
        <Container fluid>
          <Navbar.Brand className="fw-bold" style={{ color: "#FAE8E0" }}>
            <span className="me-2">✏️</span>
            Edit Profile
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="edit-nav" />
          <Navbar.Collapse id="edit-nav">
            <Nav className="ms-auto">
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
      {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
            <Spinner animation="border" role="status" style={{ color: "#EF7C8E" }}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
      ) : (
          <Row className="justify-content-center">
            <Col lg={10} xl={8}>
              {/* Header */}
              <div className="text-center mb-4">
                <h1 className="fw-bold" style={{ color: "#1a1a1a", fontSize: "2.5rem", textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                  Update Profile Details ✨
                </h1>
                <p style={{ color: "#333333", fontSize: "1.1rem", fontWeight: "500" }}>
                  Keep your profile fresh and up-to-date
                </p>
              </div>

              {/* Main Form Card */}
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
          <Tabs
            defaultActiveKey="registration"
                    id="profile-tabs"
                    className="mb-4"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
          >
                    <Tab eventKey="registration" title="Basic Info">
                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              Full Name
                            </label>
                <input
                  type="text"
                              name="name"
                  onChange={handleInputChange}
                              className="form-control"
                  value={form.name}
                  disabled
                />
              </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              Username
                </label>
                <input
                  type="text"
                  name="username"
                  onChange={handleInputChange}
                              value={form.username}
                              className="form-control"
                              placeholder="Enter your username"
                            />
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              Email Address
                            </label>
                            <input
                              type="email"
                              name="email"
                              onChange={handleInputChange}
                              className="form-control"
                  value={form.email}
                  disabled
                />
              </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              Profile Photo
                </label>
                <input
                              type="file" 
                              accept="image/*" 
                              onChange={handleFileChange}
                              className="form-control"
                />
              </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={4}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              LinkedIn Profile
                </label>
                <input
                              type="url"
                  name="linkedinLink"
                  value={form.linkedinLink}
                  onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://linkedin.com/in/username"
                />
              </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              GitHub Profile
                </label>
                <input
                              type="url"
                  name="githubLink"
                  value={form.githubLink}
                  onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://github.com/username"
                />
              </div>
                        </Col>
                        <Col md={4}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                  Portfolio Link
                </label>
                <input
                              type="url"
                  name="portfolioLink"
                  value={form.portfolioLink}
                  onChange={handleInputChange}
                              className="form-control"
                              placeholder="https://your-portfolio.com"
                />
              </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                  Skills Proficient At
                </label>
                <Form.Select
                  value={skillsProficientAt}
                  onChange={(e) => setSkillsProficientAt(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form?.skillsProficientAt?.length > 0 && (
                              <div className="mt-2">
                    {form.skillsProficientAt.map((skill, index) => (
                      <Badge
                        key={index}
                                    className="me-2 mb-2"
                                    style={{ 
                                      backgroundColor: "#EF7C8E", 
                                      color: "#FAE8E0", 
                                      cursor: "pointer"
                                    }}
                        onClick={(event) => handleRemoveSkill(event, "skills_proficient_at")}
                      >
                                    {skill} ✕
                      </Badge>
                    ))}
                  </div>
                )}
                            <Button 
                              className="mt-2"
                              name="skill_proficient_at" 
                              onClick={handleAddSkill}
                              style={{
                                backgroundColor: "#B6E2D3",
                                border: "none",
                                color: "#2d2d2d",
                                fontWeight: "600"
                              }}
                            >
                              ➕ Add Skill
                            </Button>
              </div>
                        </Col>
                        <Col md={6}>
                          <div className="mb-3">
                            <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                              Skills To Learn
                            </label>
                <Form.Select
                  value={skillsToLearn}
                  onChange={(e) => setSkillsToLearn(e.target.value)}
                >
                  <option>Select some skill</option>
                  {skills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </Form.Select>
                {form?.skillsToLearn?.length > 0 && (
                              <div className="mt-2">
                    {form.skillsToLearn.map((skill, index) => (
                      <Badge
                        key={index}
                                    className="me-2 mb-2"
                                    style={{ 
                                      backgroundColor: "#D8A7B1", 
                                      color: "#2d2d2d", 
                                      cursor: "pointer"
                                    }}
                        onClick={(event) => handleRemoveSkill(event, "skills_to_learn")}
                      >
                                    {skill} ✕
                      </Badge>
                    ))}
                  </div>
                )}
                            <Button 
                              className="mt-2"
                              name="skill_to_learn" 
                              onClick={handleAddSkill}
                              style={{
                                backgroundColor: "#D8A7B1",
                                border: "none",
                                color: "#2d2d2d",
                                fontWeight: "600"
                              }}
                            >
                              ➕ Add Skill
                            </Button>
              </div>
                        </Col>
                      </Row>

                      <div className="d-flex gap-3 justify-content-center mt-4">
                        <Button 
                          onClick={handleSaveRegistration} 
                          disabled={saveLoading}
                          style={{
                            backgroundColor: "#EF7C8E",
                            border: "none",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          {saveLoading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            "💾 Save Changes"
                          )}
                        </Button>
                        <Button 
                          onClick={handleNext}
                          style={{
                            backgroundColor: "#B6E2D3",
                            border: "none",
                            color: "#2d2d2d",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          Next ➡️
                        </Button>
              </div>
            </Tab>

            <Tab eventKey="education" title="Education">
              {form?.education?.map((edu, index) => (
                        <Card key={edu?._id} className="mb-4 border-0 shadow-sm" style={{ backgroundColor: "#FAE8E0" }}>
                          <Card.Body className="p-4">
                  {index !== 0 && (
                              <div className="d-flex justify-content-end mb-3">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={(e) => handleRemoveEducation(e, edu?._id)}
                                  style={{
                                    borderColor: "#EF7C8E",
                                    color: "#EF7C8E",
                                    fontSize: "0.8rem"
                                  }}
                                >
                                  ✕ Remove
                                </Button>
                              </div>
                            )}
                            
                            <Row>
                              <Col md={6}>
                                <div className="mb-3">
                                  <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                    Institution Name
                                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(e, index)}
                                    className="form-control"
                                    placeholder="Enter institution name"
                                  />
                                </div>
                              </Col>
                              <Col md={6}>
                                <div className="mb-3">
                                  <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                    Degree/Course
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(e, index)}
                                    className="form-control"
                                    placeholder="e.g., Bachelor of Science"
                                  />
                                </div>
                              </Col>
                            </Row>

                            <Row>
                              <Col md={4}>
                                <div className="mb-3">
                                  <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                                    className="form-control"
                      />
                    </div>
                              </Col>
                              <Col md={4}>
                                <div className="mb-3">
                                  <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""}
                        onChange={(e) => handleEducationChange(e, index)}
                                    className="form-control"
                      />
                    </div>
                              </Col>
                              <Col md={4}>
                                <div className="mb-3">
                                  <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                    Grade/Score
                  </label>
                  <input
                    type="text"
                                    name="score"
                                    value={edu.score}
                                    onChange={(e) => handleEducationChange(e, index)}
                                    className="form-control"
                                    placeholder="e.g., 3.8 GPA, 85%"
                                  />
                                </div>
                              </Col>
                            </Row>

                            <div className="mb-3">
                              <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                Description/Achievements
                              </label>
                              <textarea
                    name="description"
                    value={edu.description}
                    onChange={(e) => handleEducationChange(e, index)}
                                className="form-control"
                                rows="3"
                                placeholder="Describe your achievements, projects, or notable experiences"
                  />
                </div>
                          </Card.Body>
                        </Card>
                      ))}

                      <div className="text-center mb-4">
                        <Button
                  onClick={() => {
                    setForm((prevState) => ({
                      ...prevState,
                      education: [
                        ...prevState.education,
                        {
                          id: uuidv4(),
                          institution: "",
                          degree: "",
                          startDate: "",
                          endDate: "",
                          score: "",
                          description: "",
                        },
                      ],
                    }));
                  }}
                          style={{
                            backgroundColor: "#B6E2D3",
                            border: "none",
                            color: "#2d2d2d",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          ➕ Add Education
                        </Button>
              </div>

                      <div className="d-flex gap-3 justify-content-center">
                        <Button 
                          onClick={handleSaveEducation} 
                          disabled={saveLoading}
                          style={{
                            backgroundColor: "#EF7C8E",
                            border: "none",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          {saveLoading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            "💾 Save Education"
                          )}
                        </Button>
                        <Button 
                          onClick={handleNext}
                          style={{
                            backgroundColor: "#B6E2D3",
                            border: "none",
                            color: "#2d2d2d",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          Next ➡️
                        </Button>
              </div>
            </Tab>

                    <Tab eventKey="longer-tab" title="Bio & Projects">
                      <div className="mb-4">
                        <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                          Bio (Max 500 characters)
                        </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleInputChange}
                          className="form-control"
                          rows="4"
                          placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                        />
                        <small style={{ color: "#666666", fontSize: "0.9rem" }}>
                          {form.bio?.length || 0}/500 characters
                        </small>
                      </div>

                      <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <h5 className="fw-bold mb-0" style={{ color: "#1a1a1a" }}>Projects</h5>
                          <Button
                            onClick={() => {
                              setTechStack((prevState) => {
                                return [...prevState, "Select some Tech Stack"];
                              });
                              setForm((prevState) => ({
                                ...prevState,
                                projects: [
                                  ...prevState.projects,
                                  {
                                    id: uuidv4(),
                                    title: "",
                                    techStack: [],
                                    startDate: "",
                                    endDate: "",
                                    projectLink: "",
                                    description: "",
                                  },
                                ],
                              }));
                            }}
                  style={{
                              backgroundColor: "#D8A7B1",
                              border: "none",
                              color: "#2d2d2d",
                              fontWeight: "600",
                              fontSize: "0.9rem",
                              padding: "8px 16px"
                            }}
                          >
                            ➕ Add Project
                          </Button>
              </div>

                {form?.projects?.map((project, index) => (
                          <Card key={project?._id} className="mb-4 border-0 shadow-sm" style={{ backgroundColor: "#FAE8E0" }}>
                            <Card.Body className="p-4">
                              <div className="d-flex justify-content-end mb-3">
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                        onClick={() => {
                          setForm((prevState) => ({
                            ...prevState,
                            projects: prevState.projects.filter((item) => item?._id !== project?._id),
                          }));
                        }}
                                  style={{
                                    borderColor: "#EF7C8E",
                                    color: "#EF7C8E",
                                    fontSize: "0.8rem"
                                  }}
                                >
                                  ✕ Remove
                                </Button>
                              </div>

                              <Row>
                                <Col md={8}>
                                  <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                      Project Title
                                    </label>
                    <input
                      type="text"
                      name="title"
                      value={project.title}
                      onChange={(e) => handleAdditionalChange(e, index)}
                                      className="form-control"
                                      placeholder="Enter project title"
                                    />
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                      Project Link
                                    </label>
                                    <input
                                      type="url"
                                      name="projectLink"
                                      value={project.projectLink}
                                      onChange={(e) => handleAdditionalChange(e, index)}
                                      className="form-control"
                                      placeholder="https://project-url.com"
                                    />
                                  </div>
                                </Col>
                              </Row>

                              <Row>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                      Start Date
                                    </label>
                                    <input
                                      type="date"
                                      name="startDate"
                                      value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""}
                                      onChange={(e) => handleAdditionalChange(e, index)}
                                      className="form-control"
                                    />
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="mb-3">
                                    <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                      End Date
                                    </label>
                                    <input
                                      type="date"
                                      name="endDate"
                                      value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""}
                                      onChange={(e) => handleAdditionalChange(e, index)}
                                      className="form-control"
                                    />
                                  </div>
                                </Col>
                              </Row>

                              <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                      Tech Stack
                    </label>
                    <Form.Select
                      value={techStack[index]}
                      onChange={(e) => {
                        setTechStack((prevState) => prevState.map((item, i) => (i === index ? e.target.value : item)));
                      }}
                    >
                      <option>Select some Tech Stack</option>
                      {skills.map((skill, index) => (
                        <option key={index} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </Form.Select>
                                {techStack[index] !== "Select some Tech Stack" && (
                                  <Button
                                    className="mt-2"
                      name="tech_stack"
                      onClick={(e) => {
                        if (techStack[index] === "Select some Tech Stack") {
                          toast.error("Select a tech stack to add");
                          return;
                        }
                        if (form.projects[index].techStack.includes(techStack[index])) {
                          toast.error("Tech Stack already added");
                          return;
                        }
                        setForm((prevState) => ({
                          ...prevState,
                          projects: prevState.projects.map((item, i) =>
                            i === index ? { ...item, techStack: [...item.techStack, techStack[index]] } : item
                          ),
                        }));
                      }}
                          style={{
                                      backgroundColor: "#D8A7B1",
                                      border: "none",
                                      color: "#2d2d2d",
                                      fontWeight: "600",
                                      fontSize: "0.9rem",
                                      padding: "8px 16px"
                                    }}
                                  >
                                    ➕ Add Tech Stack
                                  </Button>
                                )}
                                {form?.projects[index]?.techStack?.length > 0 && (
                                  <div className="mt-2">
                                    {form.projects[index].techStack.map((skill, i) => (
                                      <Badge
                                        key={i}
                                        className="me-2 mb-2"
                          style={{
                                          backgroundColor: "#EF7C8E", 
                                          color: "#FAE8E0", 
                                          cursor: "pointer"
                                        }}
                                        onClick={(e) => {
                                          setForm((prevState) => ({
                                            ...prevState,
                                            projects: prevState.projects.map((item, i) =>
                                              i === index
                                                ? { ...item, techStack: item.techStack.filter((item) => item !== skill) }
                                                : item
                                            ),
                                          }));
                                        }}
                                      >
                                        {skill} ✕
                                      </Badge>
                                    ))}
                      </div>
                                )}
                    </div>

                              <div className="mb-3">
                                <label className="form-label fw-bold" style={{ color: "#1a1a1a", fontSize: "1rem" }}>
                                  Project Description
                    </label>
                                <textarea
                      name="description"
                      value={project.description}
                      onChange={(e) => handleAdditionalChange(e, index)}
                                  className="form-control"
                                  rows="3"
                                  placeholder="Describe your project, its features, and your role..."
                    />
                  </div>
                            </Card.Body>
                          </Card>
                        ))}
                  </div>

                      <div className="d-flex gap-3 justify-content-center">
                        <Button 
                          onClick={handleSaveAdditional} 
                          disabled={saveLoading}
                    style={{
                            backgroundColor: "#EF7C8E",
                      border: "none",
                            fontWeight: "600",
                            fontSize: "1rem",
                            padding: "12px 24px"
                          }}
                        >
                          {saveLoading ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving...
                            </>
                          ) : (
                            "💾 Save Bio & Projects"
                          )}
                        </Button>
                </div>
                    </Tab>
          </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
      )}
      </Container>
    </div>
  );
};

export default EditProfile;
