# fullstack-security-exercise

List of content

- [Intro](#Intro)
- [Backend](#Backend)
- [Frontend](#Frontend)
- [Email verification](#Email-verification)
- [Problems](#Problems)

# Intro

<h2>Stack:</h2>
&ensp;frontend:<br>
&ensp;&ensp;React/Typescript with Material-ui/Axios/Formik/Notistack/Yup<br>
&ensp;backend:<br>
&ensp;&ensp;Spring Boot<br>
&ensp;database:<br>
&ensp;&ensp;postgreSQL<br><br>

To my current knowledge, there are two ways of securing web apps: session cookies and JWT. For this repo I've chosen JSON web token, so that my app is stateless (backend does not store any cookies), better suited for multi-device (phone, tablet, ...) applications and a bit faster than the other option. Apart from that, this app has an email confirmation system, which is also described below.

Here is a basic diagram, that explains how JWT-secured apps should behave in general:<br>
![sceenshot_0](/img/JWT.png)
<br>

# Backend

Thanks to <b>.antMatchers("/api/auth/**").permitAll()</b>, no token is required for authentication endpoints, so let us focus on what happens when a user is already registered and confirmed:<br>
Client sends a login request, which if correct, returns an unique JWT: <b>jwtUtils.generateJwtToken(authentication);</b>

After that the client with his every request sends this token which is then captured by an <b>security/jwt/AuthTokenFilter</b> class. This fiter class is created to find and verify the token. And <b>this step is not trivial!!</b> Especially if HTTPS is not used, the token (which is located on the client side), could have been stolen by now, so a proper verification is a big part of the success. The most popular solutions here are short-time-to-live of the token itself, or creation of a blacklist of client-IPs which were trying to use expired tokens to name a few. However this repo does not contain such list, so only short-lived tokens are available.

JWT secret and expiration time are to be found in <b>application.properties</b><br>
![sceenshot_13](/img/13.png) <br>

# Frontend

This is a single-page, fully responsive application that uses React Hooks. Also React Router technology was not involved.<br>

Front page for not-logged-in visitors:<br>
![sceenshot_1](/img/1.png) <br>
Registration component:<br>
![sceenshot_2](/img/2.png) <br>
Forgot password component:<br>
![sceenshot_3](/img/3.png) <br>

The application takes advantage of a Notistack package:<br>

![sceenshot_4](/img/4.png) <br><br>
![sceenshot_5](/img/5.png) <br><br>
![sceenshot_10](/img/10.png) <br><br>

Front page for logged-in users:<br>
![sceenshot_12](/img/12.png) <br>

# Email verification

To be able to successfully login, email confirmation is required. Java for that uses <b>org.springframework.mail.javamail.JavaMailSender;</b> package. Logic is located in services/EmailSender class. Configuration on the other hand is to be found in <b>application.properties</b><br>
![sceenshot_14](/img/14.png) <br>

For test purposes I was using my gmail account, but that is not a preferable solution, because there are some security settings on google account which must be changed before. So I highly suggest tools like <b>https://hub.docker.com/r/maildev/maildev</b>.

Here are some examples:<br>
![sceenshot_6](/img/6-min.png) <br>
![sceenshot_7](/img/7-min.png) <br>
![sceenshot_8](/img/8.png) <br>
![sceenshot_9](/img/9.png) <br>
![sceenshot_11](/img/11.png) <br>

# Problems

While testing this app, I found three minor problems, which are described below and are not fixed:<br>

1. Material-Ui Dialog element:<br>
https://stackoverflow.com/questions/61220424/material-ui-drawer-finddomnode-is-deprecated-in-strictmode <br>
    ![sceenshot_18](/img/18.png) <br>

2. Even though <b>.antMatchers("/api/auth/**").permitAll()</b> is set, while verifying tokens via email, java displays an error:<br>
    ![sceenshot_15](/img/15.png) <br>
Verification works, user is enabled to login, EmailToken is deleted, but the error keeps showing.

3. While using formik and axios, react finds it impossible to recognise any http status codes except for 200:<br>
This one works well:<br>
    ![sceenshot_16](/img/16.png) <br>
But here react finds it impossible to enter 409:<br>
    ![sceenshot_17](/img/17.png) <br>

    So I got rid of 409, everything works as 200-ok, 401-not ok, and that is the reason for this long notistack message: <b>Bad Credentials or User Not Verified</b>
