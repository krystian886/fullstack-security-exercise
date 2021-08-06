import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import CloudRoundedIcon from '@material-ui/icons/CloudRounded';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Dialog } from '@material-ui/core';
import { useFormik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import defs from '../services/defs';
import AuthService from '../services/auth.service';

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'MediumSeaGreen',
  },
  form: {
    width: '90%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


const ForgottenPassword: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const trigger = () => {
    setOpen(!open);
  };

  const formik = useFormik({
    initialValues: {
        email: "",
    },
    validationSchema: Yup.object({
        email: Yup.string()
        .min(defs.MIN_EMAIL_CHARS)
        .max(defs.MAX_EMAIL_CHARS)
        .required()
        .email(),
    }),
    onSubmit: async (value) => {
      const status = await AuthService.resetPassword(value);
      handleClick(status);
    }
  });
  
  const handleClick = (status: number | undefined) => {
    if(status===200) {
      var message = "To Finish: Check Your Email.";
      enqueueSnackbar(message, {
          variant: "success",
          anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
          },
      });
      trigger();
    } else {
      const message = "Email Wrong or Not Verified.";
      enqueueSnackbar(message, {
          variant: "error",
          anchorOrigin: {
              vertical: "bottom",
              horizontal: "center",
          },
      });
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Link href="#" onClick={trigger} variant="body2">
        Forgot password?
      </Link>
      <Dialog
          open={open}
          onClose={trigger}
          aria-labelledby="form-dialog-title"
          fullWidth={true}
          maxWidth="sm"
      >
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <CloudRoundedIcon/>
          </Avatar>
          <Typography component="h1" variant="h5">
            New Password
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <Grid item xs={12}>
              <TextField
              variant="outlined"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={formik.handleChange} 
              error={formik.touched.email && formik.errors.email ? true : false}
              helperText={(formik.touched.email && formik.errors.email) ?? false}
              />
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Reset
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="#" onClick={trigger} variant="body2">
                  Take me back!
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5}>
          <Copyright />
        </Box>
      </Dialog>
    </Container>
  );
}

export default ForgottenPassword;