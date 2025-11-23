"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import firebase from "@/lib/firebase";
import { db } from "@/lib/firebase";

export default function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Setting up auth state listener");
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        console.log("User signed in:", user.uid);
        try {
          // const userRef = db.collection("users").doc(user.uid);
          // void userRef.set(
          //   {
          //     createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          //     displayName: user.displayName || null,
          //     email: user.email || null,
          //     stats: {
          //       hardestGrade: "V0",
          //       totalPoints: 0,
          //       totalSends: 0,
          //     },
          //   },
          // );
          if (pathname !== "/home") {
            console.log("Redirecting to /home");
            router.replace("/home");
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to persist user:", err);
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

  return null;
}