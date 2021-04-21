import "./App.css";
import { Route, Switch } from "react-router";
import PrototypePage from "./pages/PrototypePage";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={PrototypePage}></Route>
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
      </Switch>
    </div>
  );
}

export default App;
