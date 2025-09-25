"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import ServiceWorkerProvider from "@/component/ServiceWorkerProvider";

export default function ClientWrapper() {
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    return userId ? <ServiceWorkerProvider userId={userId} /> : null;
}
