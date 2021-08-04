import React, {useState} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';
import AuthService from '../security/services/auth.service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    info: {
      padding: "10px",
    }
  }),
);

type ConfirmationProps = {
  loginTrigger: () => void,
};

const Confirmation: React.FC<ConfirmationProps> = ({loginTrigger}) => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const classes = useStyles();

  // const printUserData = () => {
  //   const user:string[] = AuthService.getCurrentUser();
    
  //   return(
  //     <ul>
  //       {user.map(item => {
  //         return <li>{item}</li>;
  //       })}
  //     </ul>
  //   )
  // }

  return (
    <Container component="main" maxWidth="xs">
      <h2 className={classes.info}>
        Congrats! You have reached sensitive content.
      </h2>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={loginTrigger}
      >
        Logout
      </Button>
    </Container>
  );
}

export default Confirmation;