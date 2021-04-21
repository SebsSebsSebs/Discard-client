import React, { createContext, useState, useEffect } from "react";
import Axios from "axios";

const userContext = createContext();

function UserContextProvider(props) {
  const [user, setUser] = useState(undefined);

  async function getUser() {
    const userRes = await Axios.get("http://localhost:4000/user/loggedIn");
    setUser(userRes.data);
    console.log("what is res data", userRes.data);
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <userContext.Provider value={{ user, getUser }}>
      {props.children}
    </userContext.Provider>
  );
}
export default userContext;
export { UserContextProvider };
