import Image from "next/image";
import { Typewriter } from "@/components/ui/typewriter-text";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";
import AuthListener from "@/components/auth/AuthListener";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground font-sans">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-card text-card-foreground sm:items-start">
        <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-card-foreground">
            Bouldr
        </h1>
        <Typewriter
                text={["Climb", "Record", "Compete", "Improve"]}
                speed={100}
                loop={true}
                className="text-xl font-medium"
        />
          <div className="w-full">
            <GoogleSignInButton />
          </div>
          <AuthListener />
      </main>
    </div>
  );
}
