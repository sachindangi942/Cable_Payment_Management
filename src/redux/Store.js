import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistReducer, persistStore } from "redux-persist"
import storage from "redux-persist/lib/storage"
import customareReducer from "./fetures/CustomerSlice"
import paymentReducer from "./fetures/PaymentSlice"
import LoadingReducer from "./fetures/LoadingSlice"


const persistConfig = {
    key: "root",
    storage,
    blacklist:["loading"]
}

const rootReducer = combineReducers({
    customare: customareReducer,
    payment:paymentReducer,
    loading:LoadingReducer
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