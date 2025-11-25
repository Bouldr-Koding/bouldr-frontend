"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import firebase from "@/lib/firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function ensureUserRegistered(firebaseUser) {
  if (!API_BASE) {
    throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  }

  const token = await firebaseUser.getIdToken();
  const headers = { Authorization: `Bearer ${token}` };

  const payload = {
    createdAt: new Date().toISOString(),
    displayName: firebaseUser.displayName ?? null,
    email: firebaseUser.email ?? null,
    stats: {
      hardestGrade: "V0",
      totalPoints: 0,
      totalSends: 0,
    },
  };

  const createRes = await fetch(
    `${API_BASE}/users/registration/create/${firebaseUser.uid}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(payload),
    },
  );

  if (!createRes.ok) {
    throw new Error(`Create failed with status ${createRes.status}`);
  }

  return true;
}

export default function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User signed in:", user.uid);
        try {
          await ensureUserRegistered(user);
          // Only redirect to /home when a signed-in user is on the landing page
          if (pathname === "/") {
            console.log("Redirecting to /home");
            router.replace("/home");
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to ensure user registration:", err);
        }
      } else {
        // User not signed in
        if (pathname === "/home") {
          console.log("Redirecting to /");
          console.log("No user signed in");
          router.replace("/");
        }
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  return null;
}
