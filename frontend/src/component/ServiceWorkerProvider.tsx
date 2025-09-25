"use client";

import { useEffect } from "react";

import { subscribeUser } from "@/features/pushSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";

export default function ServiceWorkerProvider({ userId }: { userId: string }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          console.log("Service Worker registered");
          if (userId) dispatch(subscribeUser(userId));
        })
        .catch((err) => console.error("SW registration failed:", err));
    }
  }, [userId, dispatch]);

  return null;
}
