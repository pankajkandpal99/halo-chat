"use client";
import { SessionProvider } from "next-auth/react";

// login Session provider...
const Provider = ({ children, session }) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default Provider;
