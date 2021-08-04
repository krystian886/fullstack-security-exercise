import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CloudRoundedIcon from '@material-ui/icons/CloudRounded';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import RegistrationPage from './RegistrationComponent';
import ForgottenPassword from './ForgottenPassword';
import { useFormik } from "formik";
import * as Yup from "yup";
import defs from '../services/defs';
import AuthService from '../services/auth.service';
import { useSnackbar } from "notistack";

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
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'MediumSeaGreen',
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(1, 0, 2),
  },
}));

type LoginProps = {
  loginTrigger: () => void,
};

const LoginPage: React.FC<LoginProps> = ({loginTrigger}) => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
        username: "",
        password: "",
    },
    validationSchema: Yup.object({
        username: Yup.string()
            .min(defs.MIN_USERNAME_CHARS)
            .max(defs.MAX_USERNAME_CHARS)
           .required(),
        password: Yup.string()
            .min(defs.MIN_PASSWORD_CHARS)
            .max(defs.MAX_PASSWORD_CHARS)
            .required()
    }),
    onSubmit: async (values) => {
        const status = await AuthService.login(values);
        handleClick(status);
    }
  });
  
  const handleClick = (status: number | undefined) => {
    if(status===200){
      loginTrigger();
    } else{
      const message = "Error: Bad Credentials";
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
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <CloudRoundedIcon fontSize='medium' />
          </Avatar>
          <Typography component="h1" variant="h5">
            Hello there!
          </Typography>
          <form className={classes.form} onSubmit={formik.handleSubmit}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              onChange={formik.handleChange}
              error={formik.touched.username && formik.errors.username ? true : false}
              helperText={(formik.touched.username && formik.errors.username) ?? false}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={formik.handleChange} 
              error={formik.touched.password && formik.errors.password ? true : false}
              helperText={(formik.touched.password && formik.errors.password) ?? false}
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
            <Grid container>
              <Grid item xs>
                <ForgottenPassword/>
              </Grid>
              <Grid item>
                <RegistrationPage/>
              </Grid>
            </Grid>
            <Box mt={5}>
              <Copyright />
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  );
}

export default LoginPage;