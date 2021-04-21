import "./authStyles.css";
import Axios from "axios";
import { useState, useContext } from "react";
import { useHistory, Link } from "react-router-dom";
import { Button, Input, Paper } from "@material-ui/core";
import userContext from "../../context/userContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const history = useHistory();
  const { getUser } = useContext(userContext);

  async function login(e) {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };
    try {
      await Axios.post("http://localhost:4000/user/login", loginData);
    } catch (err) {
      return;
    }
    await getUser();
    history.push("/");
  }

  return (
    <div className="auth_wrap">
      <Paper>
        <h2 className="form_title">Login</h2>
        <form className="app_signup" onSubmit={login}>
          <Input
            placeholder="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Login</Button>
        </form>
        <p>
          Need an account?
          {"   "}
          <Link to="/signup">Signup</Link>
        </p>
      </Paper>
    </div>
  );
}
