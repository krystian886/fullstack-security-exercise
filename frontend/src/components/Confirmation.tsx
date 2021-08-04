import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Button } from '@material-ui/core';

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
  const classes = useStyles();

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