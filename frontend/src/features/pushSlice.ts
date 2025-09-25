import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { urlBase64ToUint8Array } from "../../utils/pushUtils";

interface PushState {
  subscription: PushSubscriptionJSON | null;
  loading: boolean;
  error: string | null;
}

export const subscribeUser = createAsyncThunk(
  "push/subscribe",
  async (userId: string, { rejectWithValue }) => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return rejectWithValue("Push not supported");
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_KEY!
        ),
      });

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/push/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...subscription.toJSON(), userId }),
      });

      if (!res.ok) throw new Error("Subscription failed");

      return subscription.toJSON();
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const initialState: PushState = {
  subscription: null,
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
        state.subscription = action.payload;
      })
      .addCase(subscribeUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default pushSlice.reducer;
