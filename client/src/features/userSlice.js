import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userDetails: null,
  },
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload;

      // Ensure `_id` is always present (map `id` to `_id` if necessary)
      state.userDetails = {
        ...payload,
        _id: payload._id || payload.id, // Map `id` to `_id` if `_id` is missing
      };
    },
    clearUser: (state) => {
      state.userDetails = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
