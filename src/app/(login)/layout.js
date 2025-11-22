import BottomNavBar from "@/components/ui/bottom-nav-bar";

export default function LoginLayout({ children }) {
  return (
    <>
      {children}
      <BottomNavBar stickyBottom />
    </>
  );
}
