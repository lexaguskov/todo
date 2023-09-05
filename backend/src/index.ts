import express from "express";
import path from "path";

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import expressSession from "express-session";

import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const GOOGLE_CLIENT_ID = '1014325222109-vo8fipldc7n19puf4c4b8d4mhe3ahofl.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const PORT = 3000;

const app = express();
app.use(cors());
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

// Configure the Google OAuth strategy
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Handle user authentication logic here
  // In a real application, you would typically save user data in a database
  // and set up serialization/deserialization logic for passport
  return done(null, profile);
}));

// Serialize user information for session storage
passport.serializeUser<any>((user, done) => {
  done(null, user);
});

passport.deserializeUser<any>((user, done) => {
  done(null, user);
});

const server = createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect to the frontend or a success page
    res.redirect('/success');
  }
);

app.get('/success', (req, res) => {
  // Render a success page or JSON response, depending on your requirements
  res.json({ message: 'Authentication successful' });
});

app.use(express.static(path.join(__dirname, "public")));


// io.on("connection", (socket) => {
//   console.log("connected");

//   socket.on('edit', (message) => {
//     console.log('edit', message);

//     // go thru list of socket.io sockets and send message to everyone except the sender
//     // socket.broadcast.emit('message', message);
//     for (const sock of io.sockets.sockets) {
//       if (sock[0] !== socket.id) {
//         sock[1].emit('edit', message);
//       }
//     }
//   });

//   socket.on('select', (message) => {
//     console.log('select', message);

//     // go thru list of socket.io sockets and send message to everyone except the sender
//     // socket.broadcast.emit('message', message);
//     for (const sock of io.sockets.sockets) {
//       if (sock[0] !== socket.id) {
//         sock[1].emit('select', message);
//       }
//     }
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

server.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
