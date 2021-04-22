import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";
import { useHistory } from "react-router-dom";

const userContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = useState(null);
  const [userInformation, setUserInformation] = useState(null);
  const history = useHistory();

  async function getUser() {
    const userRes = await Axios.get("http://localhost:4000/user/loggedIn");
    setUser(userRes.data);
    // console.log("what is res data", userRes);
    const userInformationRes = await Axios.get(
      "http://localhost:4000/user/myprofile"
    );
    setUserInformation(userInformationRes.data);
    console.log("what is res profileinformation", userInformationRes.data);
  }

  async function logOut() {
    await Axios.get("http://localhost:4000/user/logout");
    getUser();
    setUserInformation(null);
    console.log(history);
    history.push("/login");
  }
  useEffect(() => {
    getUser();
  }, []);

  return (
    <userContext.Provider value={{ user, logOut, getUser, userInformation }}>
      {props.children}
    </userContext.Provider>
  );
}
export default userContext;
export { UserContextProvider };
