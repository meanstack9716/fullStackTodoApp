import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { messaging } from "@/firebase/firebaseClient";
import { getToken } from "firebase/messaging";

interface PushState {
  fcmToken: string | null;
  loading: boolean;
  error: string | null;
}

export const subscribeUser = createAsyncThunk(
  "push/subscribe",
  async (userId: string, { rejectWithValue }) => {
    try {
      if (!("Notification" in window)) return rejectWithValue("Notifications not supported");

      const permission = await Notification.requestPermission();
      if (permission !== "granted") return rejectWithValue("Permission not granted");

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
      if (!messaging) return rejectWithValue("Firebase messaging not initialized");
      const fcmToken = await getToken(messaging, { vapidKey });
      if (!fcmToken) return rejectWithValue("No FCM token received");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fcmToken, userId }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Subscription failed: ${text}`);
      }

      return fcmToken;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const initialState: PushState = {
  fcmToken: null,
  loading: false,
  error: null,
};

const pushSlice = createSlice({
  name: "push",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(subscribeUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(subscribeUser.fulfilled, (state, action) => {
        state.loading = false;
        state.fcmToken = action.payload;
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pushSlice.reducer;
