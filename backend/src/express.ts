import express from "express";
import path from "path";

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";
import expressSession from "express-session";
import cors from "cors";

import { BACKEND_HOSTNAME, FRONTEND_HOSTNAME, GITHUB_CLIENT_ID, GITHUB_SECRET } from "./settings";

const app = express();
app.use(cors({ origin: FRONTEND_HOSTNAME, credentials: true }));
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID as string,
      clientSecret: GITHUB_SECRET as string,
      callbackURL: `${BACKEND_HOSTNAME}/auth/callback/github`, // Replace with your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the user's GitHub profile information for authentication
      // You can store user information in your database at this point
      return done(null, profile);
    }
  )
);

app.use(express.static("/app/static"));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/callback/github', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(FRONTEND_HOSTNAME as string);
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
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' }).end();
  }
  await new Promise(resolve => req.logOut({}, resolve));
  await new Promise(resolve => req.session.destroy(resolve));
  res.redirect(FRONTEND_HOSTNAME as string);
});

app.use(express.static(path.join(__dirname, "public")));

export default app;