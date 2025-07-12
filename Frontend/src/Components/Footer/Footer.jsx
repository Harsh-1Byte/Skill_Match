import React from "react";
import { Container, Navbar } from "react-bootstrap";

const Footer = () => {
  return (
    <>
      <Navbar variant="dark" style={{ backgroundColor: "#EF7C8E" }}>
        <Container className="mx-auto w-100 d-flex justify-content-center">
          <div className="text-center" style={{ fontFamily: "Montserrat, sans-serif", color: "#FAE8E0" }}>
            Made with ❤️ by Manish & Harsh
          </div>
        </Container>
      </Navbar>
    </>
  );
};

export default Footer;
