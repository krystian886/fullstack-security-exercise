import React, { useState, useEffect } from 'react';
import LoginPage from './security/components/LoginPage'
import Confirmation from './components/Confirmation';


const App : React.FC = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  //useEffect(() => {
    //const user = AuthService.getCurrentUser();

    // if (user) {
    //   setCurrentUser(user);
    //   setUserIsAdmin(user.roles.includes("ROLE_ADMIN"));
    // }

    // EventBus.on("logout", () => {
    //   logOut();
    // });

    // return () => {
    //   EventBus.remove("logout");
    // };
  //}, []);

  // const logOut = () => {
  //   AuthService.logout();
  //   setUserIsAdmin(false);
  //   setCurrentUser(undefined);
  // };

  return (
    <>
      {!currentUser && (
        <LoginPage/>
      )}
      {currentUser && (
        <Confirmation/>
      )}
    </>
  );
}

export default App;
