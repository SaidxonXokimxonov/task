import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/collections/loads/records`;


export interface Load {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  name: string;
  volume: string;
  price: string;
  user: string; 
  car: string; 
  fromLoc: string; 
  toLoc: string; 
  paymentMethod: string;
  phoneNumber: string;
  telegram: string;
  date: string;
  InAdvanceMethod: boolean;
}

export interface CreateLoadData {
  name: string;
  volume: number;
  price: number;
  user: string;
  car: string;
  fromLoc: string;
  toLoc: string;
  paymentMethod: string;
}

interface LoadsState {
  list: Load[];
  loading: boolean;
  error: string | null;
}

const initialState: LoadsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchLoads = createAsyncThunk("loads/fetchLoads", async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data.items as Load[];
});

export const createLoad = createAsyncThunk(
  "loads/createLoad",
  async (loadData: CreateLoadData) => {
    console.log("📡 Sending load data:", loadData);

    const res = await axios.post(API_URL, loadData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const updateLoad = createAsyncThunk(
  "loads/updateLoad",
  async ({ loadId, loadData }: { loadId: string; loadData: CreateLoadData }) => {
    console.log("📡 Updating load data:", loadData);
    
    const res = await axios.patch(`${API_URL}/${loadId}`, loadData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  }
);

export const deleteLoad = createAsyncThunk(
  "loads/deleteLoad",
  async (loadId: string) => {
    console.log("🗑️ Deleting load with ID:", loadId);
    await axios.delete(`${API_URL}/${loadId}`);
    return loadId;
  }
);

const loadsSlice = createSlice({
  name: "loads",
  initialState,
  reducers: {
    addLoad: (state, action: PayloadAction<Load>) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLoads.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchLoads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch loads";
      })
      .addCase(createLoad.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateLoad.fulfilled, (state, action) => {
        const index = state.list.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteLoad.fulfilled, (state, action) => {
        state.list = state.list.filter((l) => l.id !== action.payload);
      });
  },
});

export const { addLoad } = loadsSlice.actions;
export default loadsSlice.reducer;