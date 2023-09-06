
import express from "express";
import path from "path";

import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github";
import expressSession from "express-session";

import { createServer } from "http";
// import { Server } from "socket.io";
import cors from "cors";

const { GITHUB_CLIENT_ID, GITHUB_SECRET } = process.env;

if (!GITHUB_CLIENT_ID || !GITHUB_SECRET) throw new Error('GITHUB_SECRET or AUTH_CLIENT_SECRET not set');

const PORT = 3000;

const app = express();
app.use(cors());
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: AUTH_CLIENT_ID,
//       clientSecret: AUTH_CLIENT_SECRET,
//       callbackURL: 'http://localhost:3000/auth/callback/github', // Replace with your callback URL
//     },
//     (accessToken, refreshToken, profile, done) => {
//       // Use the user's GitHub profile information for authentication
//       // You can store user information in your database at this point
//       return done(null, profile);
//     }
//   )
// );

const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

app.get('/authenticate/:code', async (req, res) => {
  const code = req.params.code;
  const result = await (global as any).fetch(`https://github.com/login/oauth/access_token?client_id=${GITHUB_CLIENT_ID}&client_secret=${GITHUB_SECRET}&code=${code}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    }
  });
  const json = await result.json();
  res.status(200).json(json).end();
});

app.get('/user', async (req, res) => {
  console.log("req.get('Authorization')", req.get('Authorization'))
  const result = await (global as any).fetch('https://api.github.com/user', {
    method: 'GET',
    headers: {
      Authorizaiton: req.get('Authorization'),
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    }
  });
  const json = await result.json();
  res.status(200).json(json).end();
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
