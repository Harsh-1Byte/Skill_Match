import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../util/UserContext";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import ScrollableFeed from "react-scrollable-feed";
import RequestCard from "./RequestCard";
import "./Chats.css";
import Modal from "react-bootstrap/Modal";
import { Container, Row, Col, Card, Navbar, Nav, Badge } from "react-bootstrap";

var socket;
const Chats = () => {
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [showRequests, setShowRequests] = useState(false);
  const [requests, setRequests] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);
  const [acceptRequestLoading, setAcceptRequestLoading] = useState(false);

  const [scheduleModalShow, setScheduleModalShow] = useState(false);
  const [requestModalShow, setRequestModalShow] = useState(false);

  // to store selected chat
  const [selectedChat, setSelectedChat] = useState(null);
  // to store chat messages
  const [chatMessages, setChatMessages] = useState([]);
  // to store chats
  const [chats, setChats] = useState([]);
  const [chatLoading, setChatLoading] = useState(true);
  const [chatMessageLoading, setChatMessageLoading] = useState(false);
  // to store message
  const [message, setMessage] = useState("");

  const [selectedRequest, setSelectedRequest] = useState(null);

  const { user, setUser } = useUser();

  const navigate = useNavigate();

  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    socket = io(axios.defaults.baseURL);
    if (user) {
      socket.emit("setup", user);
    }
    socket.on("message recieved", (newMessageRecieved) => {
      console.log("New Message Recieved: ", newMessageRecieved);
      console.log("Selected Chat: ", selectedChat);
      console.log("Selected Chat ID: ", selectedChat?.id);
      console.log("New Message Chat ID: ", newMessageRecieved.chatId._id);
      if (selectedChat && selectedChat.id === newMessageRecieved.chatId._id) {
        setChatMessages((prevState) => [...prevState, newMessageRecieved]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  }, [selectedChat]);

  const fetchChats = async () => {
    try {
      setChatLoading(true);
      const tempUser = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await axios.get("/chat");
      if (tempUser?._id) {
        const temp = data.data.map((chat) => {
          return {
            id: chat._id,
            name: chat?.users.find((u) => u?._id !== tempUser?._id).name,
            picture: chat?.users.find((u) => u?._id !== tempUser?._id).picture,
            username: chat?.users.find((u) => u?._id !== tempUser?._id).username,
          };
        });
        setChats(temp);
      }
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatLoading(false);
    }
  };

  const handleScheduleClick = () => {
    setScheduleModalShow(true);
  };

  const handleChatClick = async (chatId) => {
    try {
      setChatMessageLoading(true);
      const { data } = await axios.get(`/message/getMessages/${chatId}`);
      setChatMessages(data.data);
      setMessage("");
      const chatDetails = chats.find((chat) => chat.id === chatId);
      setSelectedChat(chatDetails);
      socket.emit("join chat", chatId);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          localStorage.removeItem("userInfo");
          setUser(null);
          await axios.get("/auth/logout");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setChatMessageLoading(false);
    }
  };

  const sendMessage = async (e) => {
    try {
      socket.emit("stop typing", selectedChat._id);
      if (message === "") {
        toast.error("Message is empty");
        return;
      }
      const { data } = await axios.post("/message/sendMessage", { chatId: selectedChat.id, content: message });
      socket.emit("new message", data.data);
      setChatMessages((prevState) => [...prevState, data.data]);
      setMessage("");
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const getRequests = async () => {
    try {
      setRequestLoading(true);
      const { data } = await axios.get("/request/getRequests");
      setRequests(data.data);
      console.log(data.data);
      toast.success(data.message);
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setRequestLoading(false);
    }
  };

  const handleTabClick = async (tab) => {
    if (tab === "chat") {
      setShowChatHistory(true);
      setShowRequests(false);
      await fetchChats();
    } else if (tab === "requests") {
      setShowChatHistory(false);
      setShowRequests(true);
      await getRequests();
    }
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    setRequestModalShow(true);
  };

  const handleRequestAccept = async (e) => {
    try {
      setAcceptRequestLoading(true);
      const { data } = await axios.post("/request/acceptRequest", {
        requestId: selectedRequest._id
      });
      toast.success("Request accepted successfully! You can now chat with this user.");
      setRequestModalShow(false);
      setSelectedRequest(null);
      await getRequests();
      await fetchChats();
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
    }
  };

  const handleRequestReject = async () => {
    try {
      setAcceptRequestLoading(true);
      const { data } = await axios.post("/request/rejectRequest", {
        requestId: selectedRequest._id
      });
      toast.success("Request rejected successfully");
      setRequestModalShow(false);
      setSelectedRequest(null);
      await getRequests();
    } catch (err) {
      console.log(err);
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
        if (err.response.data.message === "Please Login") {
          await axios.get("/auth/logout");
          setUser(null);
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setAcceptRequestLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleLogout = async () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="chats-page">
      {/* Navigation Bar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm" style={{ backgroundColor: "#EF7C8E" }}>
        <Container fluid>
          <Navbar.Brand className="fw-bold" style={{ color: "#FAE8E0" }}>
            <span className="me-2">💬</span>
            SkillSwap Chats
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="chats-nav" />
          <Navbar.Collapse id="chats-nav">
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
        <Row className="justify-content-center">
          <Col lg={10} xl={8}>
            {/* Header */}
            <div className="text-center mb-4">
              <h1 className="fw-bold" style={{ 
                color: "#1a1a1a", 
                fontSize: "2.5rem", 
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                marginBottom: "0.5rem"
              }}>
                Your Conversations 💬
              </h1>
              <p style={{ 
                color: "#333333", 
                fontSize: "1.1rem", 
                fontWeight: "500",
                marginBottom: "2rem"
              }}>
                Connect and collaborate with your learning partners
              </p>
            </div>

            {/* Main Chat Container */}
            <Card className="border-0 shadow-lg" style={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              minHeight: "70vh"
            }}>
              <Card.Body className="p-0">
                <Row className="g-0">
                  {/* Left Sidebar */}
                  <Col lg={4} className="border-end">
                    {/* Tabs */}
                    <div className="d-flex" style={{ borderBottom: "2px solid #B6E2D3" }}>
                      <button
                        className={`flex-fill py-3 px-4 border-0 ${showChatHistory ? 'active-tab' : 'inactive-tab'}`}
                        onClick={() => handleTabClick("chat")}
                        style={{
                          backgroundColor: showChatHistory ? "#EF7C8E" : "transparent",
                          color: showChatHistory ? "#FAE8E0" : "#666666",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        💬 Chat History
                      </button>
                      <button
                        className={`flex-fill py-3 px-4 border-0 ${showRequests ? 'active-tab' : 'inactive-tab'}`}
                        onClick={() => handleTabClick("requests")}
                        style={{
                          backgroundColor: showRequests ? "#EF7C8E" : "transparent",
                          color: showRequests ? "#FAE8E0" : "#666666",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          transition: "all 0.3s ease"
                        }}
                      >
                        📨 Requests
                        {requests.length > 0 && (
                          <Badge 
                            bg="danger" 
                            className="ms-2"
                            style={{ backgroundColor: "#FAE8E0", color: "#EF7C8E" }}
                          >
                            {requests.length}
                          </Badge>
                        )}
                      </button>
                    </div>

                    {/* Chat/Request List */}
                    <div style={{ height: "60vh", overflowY: "auto" }}>
                      {showChatHistory && (
                        <div>
                          {chatLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                              <Spinner animation="border" style={{ color: "#EF7C8E" }} />
                            </div>
                          ) : chats.length > 0 ? (
                            chats.map((chat) => (
                              <div
                                key={chat.id}
                                className={`chat-list-item ${selectedChat?.id === chat?.id ? 'selected-chat' : ''}`}
                                onClick={() => handleChatClick(chat.id)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px 20px",
                                  borderBottom: "1px solid #B6E2D3",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  backgroundColor: selectedChat?.id === chat?.id ? "#EF7C8E" : "transparent",
                                  color: selectedChat?.id === chat?.id ? "#FAE8E0" : "#1a1a1a"
                                }}
                              >
                                <img
                                  src={chat.picture || "https://via.placeholder.com/150"}
                                  alt={chat.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    marginRight: "15px",
                                    border: "2px solid #B6E2D3"
                                  }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1 fw-bold" style={{ fontSize: "1rem" }}>
                                    {chat.name}
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    <span style={{
                                      width: "8px",
                                      height: "8px",
                                      backgroundColor: "#B6E2D3",
                                      borderRadius: "50%",
                                      marginRight: "8px"
                                    }}></span>
                                    <small style={{ fontSize: "0.85rem" }}>Online</small>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-5">
                              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>💬</div>
                              <h5 className="fw-bold" style={{ color: "#1a1a1a", marginBottom: "0.5rem" }}>
                                No Chats Yet
                              </h5>
                              <p style={{ color: "#666666", fontSize: "0.9rem" }}>
                                Start connecting with people to see your chat history here.
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {showRequests && (
                        <div>
                          {requestLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                              <Spinner animation="border" style={{ color: "#EF7C8E" }} />
                            </div>
                          ) : requests.length > 0 ? (
                            requests.map((request) => (
                              <div
                                key={request._id}
                                className={`chat-list-item ${selectedRequest?._id === request?._id ? 'selected-chat' : ''}`}
                                onClick={() => handleRequestClick(request)}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  padding: "15px 20px",
                                  borderBottom: "1px solid #B6E2D3",
                                  cursor: "pointer",
                                  transition: "all 0.3s ease",
                                  backgroundColor: selectedRequest?._id === request?._id ? "#EF7C8E" : "transparent",
                                  color: selectedRequest?._id === request?._id ? "#FAE8E0" : "#1a1a1a"
                                }}
                              >
                                <img
                                  src={request.picture || "https://via.placeholder.com/150"}
                                  alt={request.name}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    marginRight: "15px",
                                    border: "2px solid #B6E2D3"
                                  }}
                                />
                                <div className="flex-grow-1">
                                  <h6 className="mb-1 fw-bold" style={{ fontSize: "1rem" }}>
                                    {request.name}
                                  </h6>
                                  <div className="d-flex align-items-center">
                                    <span style={{
                                      width: "8px",
                                      height: "8px",
                                      backgroundColor: "#D8A7B1",
                                      borderRadius: "50%",
                                      marginRight: "8px"
                                    }}></span>
                                    <small style={{ fontSize: "0.85rem" }}>Pending Request</small>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-5">
                              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📨</div>
                              <h5 className="fw-bold" style={{ color: "#1a1a1a", marginBottom: "0.5rem" }}>
                                No Requests
                              </h5>
                              <p style={{ color: "#666666", fontSize: "0.9rem" }}>
                                You don't have any pending connection requests.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Col>

                  {/* Right Chat Area */}
                  <Col lg={8}>
                    {selectedChat ? (
                      <>
                        {/* Chat Header */}
                        <div style={{
                          padding: "20px",
                          borderBottom: "2px solid #B6E2D3",
                          backgroundColor: "#FAE8E0"
                        }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <img
                                src={selectedChat.picture || "https://via.placeholder.com/150"}
                                alt={selectedChat.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  borderRadius: "50%",
                                  marginRight: "15px",
                                  border: "2px solid #EF7C8E"
                                }}
                              />
                              <div>
                                <h5 className="fw-bold mb-1" style={{ color: "#1a1a1a" }}>
                                  {selectedChat.name}
                                </h5>
                                <small style={{ color: "#666666" }}>@{selectedChat.username}</small>
                              </div>
                            </div>
                            <Button
                              onClick={handleScheduleClick}
                              style={{
                                backgroundColor: "#EF7C8E",
                                border: "none",
                                color: "#FAE8E0",
                                fontWeight: "600",
                                fontSize: "0.9rem",
                                padding: "8px 16px",
                                borderRadius: "8px"
                              }}
                            >
                              📹 Video Call
                            </Button>
                          </div>
                        </div>

                        {/* Chat Messages */}
                        <div style={{ 
                          height: "45vh", 
                          overflowY: "auto", 
                          padding: "20px",
                          backgroundColor: "#ffffff"
                        }}>
                          {chatMessageLoading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                              <Spinner animation="border" style={{ color: "#EF7C8E" }} />
                            </div>
                          ) : (
                            <ScrollableFeed forceScroll="true">
                              {chatMessages.map((message, index) => (
                                <div
                                  key={index}
                                  className={`d-flex ${message.sender._id === user._id ? 'justify-content-end' : 'justify-content-start'} mb-3`}
                                >
                                  <div style={{
                                    maxWidth: "70%",
                                    padding: "12px 16px",
                                    borderRadius: message.sender._id === user._id ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                                    backgroundColor: message.sender._id === user._id ? "#EF7C8E" : "#B6E2D3",
                                    color: message.sender._id === user._id ? "#FAE8E0" : "#1a1a1a",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                                  }}>
                                    <div style={{ fontSize: "0.95rem", marginBottom: "4px" }}>
                                      {message.content}
                                    </div>
                                    <small style={{ 
                                      opacity: 0.7, 
                                      fontSize: "0.75rem",
                                      display: "block"
                                    }}>
                                      {formatTime(message.createdAt)}
                                    </small>
                                  </div>
                                </div>
                              ))}
                            </ScrollableFeed>
                          )}
                        </div>

                        {/* Chat Input */}
                        <div style={{
                          padding: "20px",
                          borderTop: "2px solid #B6E2D3",
                          backgroundColor: "#FAE8E0"
                        }}>
                          <div className="d-flex gap-2">
                            <input
                              type="text"
                              placeholder="Type your message..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                              className="form-control"
                              style={{
                                border: "2px solid #B6E2D3",
                                borderRadius: "25px",
                                padding: "12px 20px",
                                fontSize: "1rem",
                                backgroundColor: "#ffffff"
                              }}
                            />
                            <Button
                              onClick={sendMessage}
                              disabled={!message.trim()}
                              style={{
                                backgroundColor: "#EF7C8E",
                                border: "none",
                                color: "#FAE8E0",
                                fontWeight: "600",
                                fontSize: "1rem",
                                padding: "12px 20px",
                                borderRadius: "25px",
                                minWidth: "80px"
                              }}
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
                        <div className="text-center">
                          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>💬</div>
                          <h4 className="fw-bold" style={{ color: "#1a1a1a", marginBottom: "0.5rem" }}>
                            Select a Chat
                          </h4>
                          <p style={{ color: "#666666", fontSize: "1rem" }}>
                            Choose a conversation from the left to start messaging.
                          </p>
                        </div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Request Modal */}
      <Modal
        show={requestModalShow}
        onHide={() => setRequestModalShow(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
          <Modal.Title className="fw-bold">Connection Request</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#FAE8E0" }}>
          {selectedRequest && (
            <RequestCard
              name={selectedRequest?.name}
              skills={selectedRequest?.skillsProficientAt}
              rating="4"
              picture={selectedRequest?.picture}
              username={selectedRequest?.username}
              onClose={() => setSelectedRequest(null)}
            />
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#FAE8E0" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setRequestModalShow(false)}
            style={{
              borderColor: "#666666",
              color: "#666666",
              fontWeight: "600"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRequestReject}
            disabled={acceptRequestLoading}
            style={{
              backgroundColor: "#D8A7B1",
              border: "none",
              color: "#2d2d2d",
              fontWeight: "600"
            }}
          >
            {acceptRequestLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Reject"
            )}
          </Button>
          <Button
            onClick={handleRequestAccept}
            disabled={acceptRequestLoading}
            style={{
              backgroundColor: "#EF7C8E",
              border: "none",
              color: "#FAE8E0",
              fontWeight: "600"
            }}
          >
            {acceptRequestLoading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Accept"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Schedule Video Call Modal */}
      <Modal
        show={scheduleModalShow}
        onHide={() => setScheduleModalShow(false)}
        centered
      >
        <Modal.Header closeButton style={{ backgroundColor: "#EF7C8E", color: "#FAE8E0" }}>
          <Modal.Title className="fw-bold">Request a Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#FAE8E0", padding: "2rem" }}>
          <Form>
            <div className="mb-3">
              <label className="form-label fw-bold" style={{ color: "#1a1a1a" }}>
                Preferred Date
              </label>
              <input
                type="date"
                className="form-control"
                value={scheduleForm.date}
                onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                style={{
                  border: "2px solid #B6E2D3",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#ffffff"
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold" style={{ color: "#1a1a1a" }}>
                Preferred Time
              </label>
              <input
                type="time"
                className="form-control"
                value={scheduleForm.time}
                onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                style={{
                  border: "2px solid #B6E2D3",
                  borderRadius: "8px",
                  padding: "12px",
                  backgroundColor: "#ffffff"
                }}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#FAE8E0" }}>
          <Button
            variant="outline-secondary"
            onClick={() => setScheduleModalShow(false)}
            style={{
              borderColor: "#666666",
              color: "#666666",
              fontWeight: "600"
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={async (e) => {
              e.preventDefault();
              if (scheduleForm.date === "" || scheduleForm.time === "") {
                toast.error("Please fill all the fields");
                return;
              }

              scheduleForm.username = selectedChat.username;
              try {
                const { data } = await axios.post("/user/sendScheduleMeet", scheduleForm);
                toast.success("Request mail has been sent successfully!");
                setScheduleForm({
                  date: "",
                  time: "",
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
                } else {
                  toast.error("Something went wrong");
                }
              }
              setScheduleModalShow(false);
            }}
            style={{
              backgroundColor: "#EF7C8E",
              border: "none",
              color: "#FAE8E0",
              fontWeight: "600"
            }}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Chats;
