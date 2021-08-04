import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';
import AuthService from '../security/services/auth.service';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    info: {
      padding: "10px",
      textAlign: "center",
    }
  }),
);

type ConfirmationProps = {
  loginTrigger: () => void,
};

const Confirmation: React.FC<ConfirmationProps> = ({loginTrigger}) => {
  const classes = useStyles();
  const user = AuthService.getCurrentUser();

  return (
    <Container component="main" maxWidth="xs">
      <h2 className={classes.info}>
        Congrats! You are logged in.
      </h2>
      <ul>
        <li>user id: {user.id}</li>
        <li>username: {user.username}</li>
        <li>email: {user.email}</li>
        <li>roles: {user.roles}</li>
      </ul>
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