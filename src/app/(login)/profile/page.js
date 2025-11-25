"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import firebase from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((fbUser) => {
      setUser(fbUser);
      setLoading(false);
      if (!fbUser) {
        router.replace("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const initials = useMemo(() => {
    if (!user?.displayName) return "CL";
    return user.displayName
      .split(" ")
      .map((part) => part[0]?.toUpperCase())
      .join("")
      .slice(0, 2);
  }, [user]);

  const handleLogout = async () => {
    setError("");
    try {
      await firebase.auth().signOut();
      router.replace("/");
    } catch (err) {
      setError("Failed to log out. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-6 pt-12 pb-28 flex flex-col">
      <section className="max-w-md w-full mx-auto flex flex-col items-center text-center gap-4">
        <div
          className="relative h-24 w-24 rounded-full border border-border bg-card shadow-md overflow-hidden flex items-center justify-center"
          style={
            user?.photoURL
              ? {
                  backgroundImage: `url(${user.photoURL})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        >
          {!user?.photoURL && (
            <span className="text-2xl font-semibold text-muted-foreground">{initials}</span>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Profile</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {user?.displayName || "Climber"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {loading ? "Loading account..." : user?.email || "No email available"}
          </p>
        </div>
      </section>

      <div className="flex-1" />

      <div className="max-w-md mx-auto w-full">
        {error && (
          <p className="text-xs text-destructive mb-2 text-center" role="alert">
            {error}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground font-semibold py-3 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary focus-visible:ring-offset-background"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </main>
  );
}
