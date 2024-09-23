import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedIn(state, action) {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    userUpdate(state, action) {
      state.user = {...state.user, ...action.payload};
    },
    clearUserData(state) {
      state.isLoggedIn = false;
      state.user = null;
    },
  },
});

export const {userLoggedIn, userUpdate, clearUserData} = userSlice.actions;

export default userSlice.reducer;
