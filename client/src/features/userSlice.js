import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUser: (state) => {
      state.userDetails = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
