import { createCookie } from "react-router";

export const userSession = createCookie("user_session", {
  maxAge: 60 * 60 * 24, // 1 day
  httpOnly: true, // Prevents client-side JS from accessing it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax",
});