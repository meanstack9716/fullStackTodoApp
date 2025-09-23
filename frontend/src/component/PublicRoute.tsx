"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/pages/dashboard"); 
    }
  }, [router]);

  return <>{children}</>;
}
