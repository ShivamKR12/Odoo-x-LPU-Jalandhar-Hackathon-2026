import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/((?!login|signup|reset-password|api|_next/static|_next/image|favicon.ico).*)"],
};
