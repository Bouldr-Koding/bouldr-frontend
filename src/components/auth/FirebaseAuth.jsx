"use client";
import { useEffect, useRef } from "react";
import firebase from "@/lib/firebase";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";
import { db } from "@/lib/firebase";

export default function FirebaseAuth() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      new firebaseui.auth.AuthUI(firebase.auth());

    const uiConfig = {
      signInFlow: "redirect",
      signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
      signInSuccessUrl: "/home",
    };

    ui.start(containerRef.current, uiConfig);

    // Also ensure that whenever the user becomes signed-in we persist their profile
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
              // If you require numeric legacy IDs (like '1'), we can store it
              // in a field (legacyId) instead of using it as the document id.
              legacyId: null,
            },
            { merge: true }
          );
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("Failed to write user document:", err);
        }
      }
    });

    return () => {
      unsubscribe();
      try {
        ui.reset();
      } catch (e) {
        // ignore
      }
    };
  }, []);

  return <div ref={containerRef} id="firebaseui-auth-container" />;
}
