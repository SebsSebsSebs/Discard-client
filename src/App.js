import logo from "./logo.svg";
import "./App.css";
import { Route, Switch } from "react-router";
import PrototypePage from "./pages/PrototypePage";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={PrototypePage}></Route>
      </Switch>
    </div>
  );
}

export default App;
