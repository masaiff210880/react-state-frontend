import { configureStore } from "@reduxjs/toolkit";

import { setupListeners } from "@reduxjs/toolkit/query";
import { testApi } from "./api-service";

export const store = configureStore({
  reducer: {
    [testApi.reducerPath]: testApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(testApi.middleware),
});

setupListeners(store.dispatch);
