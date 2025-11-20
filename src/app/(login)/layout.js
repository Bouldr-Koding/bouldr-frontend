import BottomNavBar from "@/components/bottom-nav-bar";

export default function LoginLayout({ children }) {
  return (
    <>
      {children}
      <BottomNavBar stickyBottom />
    </>
  );
}
