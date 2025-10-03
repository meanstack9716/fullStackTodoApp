"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { subscribeUser } from "@/features/pushSlice";
import { AppDispatch } from "@/store/store";
import { messaging } from "@/firebase/firebaseClient";

export default function ServiceWorkerProvider({ userId }: { userId: string }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!messaging) return;
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => {
          if (userId) dispatch(subscribeUser(userId));
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, [userId, dispatch]);

  return null;
}
