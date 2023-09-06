
import express from "express";
import path from "path";

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import expressSession from "express-session";
import { Server } from 'ws';

import { createServer } from "http";
import cors from "cors";

// @ts-ignore
import { setupWSConnection } from "y-websocket/bin/utils";

const wss = new Server({ noServer: true });

const { GITHUB_CLIENT_ID, GITHUB_SECRET, BACKEND_HOSTNAME, FRONTEND_HOSTNAME } = process.env;

if (!GITHUB_CLIENT_ID) throw new Error('GITHUB_CLIENT_ID is not set');
if (!GITHUB_SECRET) throw new Error('GITHUB_SECRET is not set');
if (!BACKEND_HOSTNAME) throw new Error('BACKEND_HOSTNAME is not set');
if (!FRONTEND_HOSTNAME) throw new Error('FRONTEND_HOSTNAME is not set');


const PORT = 3000;

const app = express();
app.use(cors({ origin: FRONTEND_HOSTNAME, credentials: true }));
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_SECRET,
      callbackURL: `${BACKEND_HOSTNAME}/auth/callback/github`, // Replace with your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the user's GitHub profile information for authentication
      // You can store user information in your database at this point
      return done(null, profile);
    }
  )
);

const server = createServer(app);

server.on('upgrade', (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws: any) => {
    wss.emit('connection', ws, request)
  }
  wss.handleUpgrade(request, socket, head, handleAuth)
});

wss.on('connection', setupWSConnection);

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/callback/github', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(FRONTEND_HOSTNAME);
});

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as any);
});

app.get('/user', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' }).end();
  }
  const { id, displayName, username, profileUrl, photos } = req.user as { [n: string]: string };
  res.status(200).json({
    id, displayName, username, profileUrl, photos
  }).end();
});

app.get('/logout', async (req, res) => {
  await new Promise(resolve => req.logOut({}, resolve));
  await new Promise(resolve => req.session.destroy(resolve));
  res.redirect(FRONTEND_HOSTNAME);
});

app.use(express.static(path.join(__dirname, "public")));

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
