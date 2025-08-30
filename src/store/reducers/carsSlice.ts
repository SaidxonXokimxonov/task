import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/api/collections/cars/records`;

export interface Car {
  id: string;
  collectionId: string;
  collectionName: string;
  created: string;
  updated: string;
  name: string;
  model: string;
  type: string;
  carNumber: string;
  volume: number;
  from: string;
  to: string;
  user: string;
  location: {
    lon: number;
    lat: number;
  };
}

interface CarsState {
  list: Car[];
  loading: boolean;
  error: string | null;
}

const initialState: CarsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  const res = await axios.get(`${API_URL}`);
  return res.data.items as Car[];
});


export const createCar = createAsyncThunk(
  "cars/createCar",
  async (carData: FormData) => {
    const jsonData: any = {}
    
    for (let [key, value] of carData.entries()) {
      if (key === 'location') {
        jsonData[key] = JSON.parse(value as string)
      } else if (key === 'volume') {
        jsonData[key] = Number(value)
      } else {
        jsonData[key] = value
      }
    }

    console.log("📡 Converted JSON data:", jsonData)

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/collections/cars/records`,
      jsonData,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return res.data
  }
)

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async ({ carId, formData }: { carId: string; formData: FormData }) => {
    const res = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/collections/cars/records/${carId}`,
      formData
    )
    return res.data
  }
)
export const deleteCar = createAsyncThunk(
  "cars/deleteCar",
  async (carId: string) => {
    console.log("🗑️ Deleting car with ID:", carId)

    await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/collections/cars/records/${carId}`
    )

    return carId
  }
)

const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    addCar: (state, action: PayloadAction<Car>) => {
      state.list.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cars";
      })

      .addCase(createCar.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.list.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })

      .addCase(deleteCar.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { addCar } = carsSlice.actions;
export default carsSlice.reducer;
