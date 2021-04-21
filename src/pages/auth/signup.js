import "./authStyles.css";
import Axios from "axios";
import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Input, Paper } from "@material-ui/core";
import userContext from "../../context/userContext";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const history = useHistory();
  const { getUser } = useContext(userContext);

  async function submitForm(e) {
    e.preventDefault();

    const registerData = {
      email: email,
      username: username,
      password: password,
      passwordVerify: passwordVerify,
    };
    try {
      await Axios.post("http://localhost:4000/user/signup", registerData);
    } catch (err) {
      return;
    }
    await getUser();
    history.push("/");
  }

  return (
    <div className="auth_wrap">
      <Paper>
        <h2 className="form_title">Sign Up</h2>
        <form className="app_signup" onSubmit={submitForm}>
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            placeholder="verify password"
            type="password"
            value={passwordVerify}
            onChange={(e) => setPasswordVerify(e.target.value)}
          />

          <Button type="submit">Sign Up</Button>
        </form>
        <p>
          Already have an account?
          {"   "}
          <Link to="/login">Login</Link>
        </p>
      </Paper>
    </div>
  );
}
