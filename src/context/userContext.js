import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";

const userContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = useState(undefined);
  const [userInformation, setUserInformation] = useState(undefined);

  async function getUser() {
    const userRes = await Axios.get("http://localhost:4000/user/loggedIn");
    setUser(userRes.data);
    console.log("what is res data", userRes);
  }

  async function getUserProfile() {
    const userRes = await Axios.get("http://localhost:4000/user/myprofile");
    setUserInformation(userRes.data.myProfile[0]);
    console.log("what is res profileinformation", userRes);
  }

  useEffect(() => {
    getUser();
    getUserProfile();
  }, []);

  return (
    <userContext.Provider
      value={{ user, getUser, getUserProfile, userInformation }}
    >
      {props.children}
    </userContext.Provider>
  );
}
export default userContext;
export { UserContextProvider };
