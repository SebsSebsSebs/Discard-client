import "./App.css";
import { Route, Switch } from "react-router";
import PrototypePage from "./pages/PrototypePage";
import ChannelPage from "./pages/ChannelPage";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={ChannelPage}></Route>
        {/* <Route exact path="messages" component={PrototypePage}></Route> */}
        <Route exact path="/login" component={Login}></Route>
        <Route exact path="/signup" component={Signup}></Route>
        <Route path="/messages/:channelId" component={PrototypePage}></Route>
      </Switch>
    </div>
  );
}

export default App;
