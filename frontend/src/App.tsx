import React, { useState, useEffect } from 'react';
import LoginPage from './security/components/LoginPage'
import Confirmation from './components/Confirmation';
import { SnackbarProvider } from "notistack";
import authService from './security/services/auth.service';


const App : React.FC = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [userIsAdmin, setUserIsAdmin] = useState(false);

  useEffect(() => {
    const user = authService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setUserIsAdmin(user.roles.includes("ROLE_ADMIN"));
    }

    // EventBus.on("logout", () => {
    //   logOut();
    // });

    // return () => {
    //   EventBus.remove("logout");
    // };
  }, []);

  // const logOut = () => {
  //   AuthService.logout();
  //   setUserIsAdmin(false);
  //   setCurrentUser(undefined);
  // };

  return (
    <>
      <SnackbarProvider maxSnack={2}>
        {!currentUser && (
          <LoginPage/>
        )}
        {currentUser && (
          <Confirmation/>
        )}
      </SnackbarProvider>
    </>
  );
}

export default App;
