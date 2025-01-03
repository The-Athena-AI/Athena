import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Alert } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { setDoc, doc, getDoc } from "firebase/firestore";
// import "theathenaaiwebflow/css/webflow.css";
import { auth, db } from "../firebase";
import{
    createUserWithEmailAndPassword
} from "firebase/auth";


const Signup = () => {
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
    await createUserWithEmailAndPassword(auth, email, password);
    const user= auth.currentUser;
    if(user){
        await setDoc(doc(db, "Users", user.uid),{
            Email: user.email,
            userName: username,
            firstName: fname,
            lastName: lname
        });
    }
    console.log("User Registered Successfully!");
    }
    catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="p-4 box">
        <h2 className="mb-3">Firebase Auth Signup</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>

        <Form.Group className="mb-3" controlId="formBasicFirst">
            <Form.Control
              type="text"
              placeholder="First Name"
              onChange={(e) => setFname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicLast">
            <Form.Control
              type="text"
              placeholder="Last Name"
              onChange={(e) => setLname(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicUserName">
            <Form.Control
              type="text"
              placeholder="Username"
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <div className="d-grid gap-2">
            <Button variant="primary" type="Submit">
              Sign up
            </Button>
          </div>
        </Form>
      </div>
      <div className="p-4 box mt-3 text-center">
        Already have an account? <Link to="/login">Log In</Link>
      </div>
    </>
  );
};

export default Signup;