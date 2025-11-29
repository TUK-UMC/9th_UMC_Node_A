// src/auth/strategies/google.strategy.js

import "dotenv/config";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";

export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
    callbackURL: "/oauth2/callback/google",
    scope: ["email", "profile"],
  },
  (accessToken, refreshToken, profile, done) => {
    try {
      const userProfile = {
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
      };

      // 이 객체는 req.user에 담겨서 Controller로 이동.
      return done(null, userProfile);
    } catch (err) {
      return done(err);
    }
  }
);