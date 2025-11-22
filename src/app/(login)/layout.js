import BottomNavBar from "@/components/ui/bottom-nav-bar";
import AuthListener from "@/components/auth/AuthListener";

export default function LoginLayout({ children }) {
  return (
    <>
      <AuthListener />
      {children}
      <BottomNavBar stickyBottom />
    </>
  );
}
