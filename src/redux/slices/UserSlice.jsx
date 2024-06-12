
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: null,
  user_id: null,
  user_email: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser(state, action) {
      state.token = action.payload.accessToken;
      state.user_id = action.payload.user_id;
      state.user_email = action.payload.user_email;
    },
    logout(state) {
      state.token = null;
      state.user_id = null;
      state.user_email = null;
    },
    // other reducers
  },
});

export const { addUser,logout  } = userSlice.actions;
export default userSlice.reducer;
