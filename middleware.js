import { withAuth } from "next-auth/middleware";

// protected route
export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: ["/chats/:path", "/contacts/:path", "/profile/:path"],
};
