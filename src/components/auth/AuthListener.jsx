"use client";
import { useEffect } from "react";
import firebase from "@/lib/firebase";
import { db } from "@/lib/firebase";

export default function AuthListener() {
  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userRef = db.collection("users").doc(user.uid);
          await userRef.set(
            {
              createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              displayName: user.displayName || null,
              email: user.email || null,
              stats: {
                hardestGrade: "V0",
                totalPoints: 0,
                totalSends: 0,
              },
              legacyId: null,
            },
            { merge: true }
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to persist user:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
