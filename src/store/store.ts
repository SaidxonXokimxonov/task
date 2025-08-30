import { configureStore } from "@reduxjs/toolkit";
import auth from "./reducers/authSlice";
import cars from "./reducers/carsSlice";
import loads from "./reducers/loadsSlice";

export const store = configureStore({
    reducer: {
        auth, cars, loads
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
