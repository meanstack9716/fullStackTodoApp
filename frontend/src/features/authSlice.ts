import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import { AuthResponse, SignupData, LoginData, User } from "../types/auth";
import { AxiosError } from "axios";

//  Signup
export const signupUser = createAsyncThunk<AuthResponse, SignupData, { rejectValue: string }>(
  "auth/signupUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/user/signup", userData);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      let errorMessage = "Signup failed"
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


// Login 
export const loginUser = createAsyncThunk<AuthResponse, LoginData, { rejectValue: string }>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>("/user/signin", credentials);
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      let errorMessage = "Login failed"
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Send OTP
export const sendOtp = createAsyncThunk<void, { email: string }, { rejectValue: string }>(
  "auth/sendOtp",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/send-otp", payload);
    } catch (error) {
      let errorMessage = "Failed to send OTP";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


// Verify OTP
export const verifyOtp = createAsyncThunk<void, { email: string; otp: string }, { rejectValue: string }>(
  "auth/verifyOtp",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/verify-otp", payload);
    } catch (error) {
      let errorMessage = "Failed to verify OTP";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk<
  void,
  { email: string; otp: string; newPassword: string },
  { rejectValue: string }
>(
  "auth/resetPassword",
  async (payload, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/user/reset-password", payload);
    } catch (error) {
      let errorMessage = "Failed to reset password";
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.error || errorMessage;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "null") : null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Signup failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // Send OTP
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to send OTP";
      })

      // Verify OTP
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify OTP";
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to reset password";
      });
  },
});

export const { logout, resetError } = authSlice.actions;
export default authSlice.reducer;
