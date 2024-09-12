import {configureStore} from '@reduxjs/toolkit';
import userSlice from './slices/user-slice';

export const store = () => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
  });
};
