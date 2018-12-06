require("dotenv").config({ path: "variables.env" });
const createServer = require("./createServer");
const db = require("./db");
const cookieParser = require("cookie-parser");
const server = createServer();
const jwt = require("jsonwebtoken");
// TODO use express middleware to handle cookies (JWT)

// Reason for cookie: We will set the cookie with currently logged in user, so every time a page is refreshed or any request is made, cookie sends a JSON web token. Similar to session.
// Since we are doing server side rendering here, we wont be using localStorage.
// If we did use localStorage and when we navigate to any page, the page will initially not display any logged in details since the server would not know about the token. Once the server realises it

// This is a middleware
// We shall accept the request and parse the request to use the JWT
server.express.use(cookieParser()); // This gives nice formatted object, rather than cookie string in the header.

// Deode the JWT so that we can get user on each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put user id onto the req for future requests
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on port http://localhost:${deets.port}`);
  }
);
