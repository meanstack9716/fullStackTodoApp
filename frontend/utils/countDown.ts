import { useEffect, useState } from "react";

export function countDown(expireAt?: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!expireAt) return;

    const interval = setInterval(() => {
      const diff = new Date(expireAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expireAt]);

  return timeLeft;
}
