import React, { useState, useEffect } from 'react';
import LoginPage from './security/components/LoginComponent'
import Confirmation from './components/Confirmation';
import { SnackbarProvider } from "notistack";
import AuthService from './security/services/auth.service';


const App : React.FC = () => {
  const [showLoginComponent, setshowLoginComponent] = useState(true);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  const loginTrigger = () => {
    if (!showLoginComponent) {
      AuthService.logout();
      setUserIsAdmin(false);
      setCurrentUser(undefined);
    }
    setshowLoginComponent(!showLoginComponent);
  };

  // useEffect(() => {
  //   const user = AuthService.getCurrentUser();

  //   if (user) {
  //     setCurrentUser(user);
  //     setUserIsAdmin(user.roles.includes("ROLE_ADMIN"));
  //     //console.log(user);
  //   }

  //   // EventBus.on("logout", () => {
  //   //   logOut();
  //   // });

  //   // return () => {
  //   //   EventBus.remove("logout");
  //   // };
  // }, []);

  // const logOut = () => {
  //   AuthService.logout();
  //   setUserIsAdmin(false);
  //   setCurrentUser(undefined);
  // };

  return (
    <>
      <SnackbarProvider maxSnack={2}>
        {showLoginComponent && (
          <LoginPage loginTrigger={loginTrigger}/>
        )}
        {!showLoginComponent && (
          <Confirmation loginTrigger={loginTrigger}/>
        )}
      </SnackbarProvider>
    </>
  );
}

export default App;
