import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import customareReducer from "./fetures/CustomerSlice"
import paymentReducer from "./fetures/PaymentSlice"


const persistConfig = {
    key: "root",
    storage
}

const rootReducer = combineReducers({
    customare: customareReducer,
    payment:paymentReducer
})

const persistReducers = persistReducer(persistConfig, rootReducer);
const Store = configureStore({
    reducer: persistReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),

    devTools: true,
})

export const persister = persistStore(Store);
export default Store