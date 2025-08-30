import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/collections/cars/records`;


export interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (data: {
    name?: string;
    email: string;
    password: string;
    passwordConfirm: string;
  }, { rejectWithValue }) => {
    try {
      const payload: any = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.passwordConfirm,
        emailVisibility: true,
        role: "driver",
        isActive: true,
        isPaid: false,
        name: data.name || "",
      };

      const res = await axios.post(API_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });

      return res.data;
    } catch (err: any) {
      console.error("❌ Register error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data: { email: string; password: string }) => {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/collections/users/auth-with-password`,
      {
        identity: data.email,
        password: data.password,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data;
  }
);


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload?.token || null;
        if (action.payload?.token) localStorage.setItem("token", action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to register";
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.record;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as any)?.message || "Failed to login";
      });
  },
});

export const { logout, setToken } = authSlice.actions;
export default authSlice.reducer;
