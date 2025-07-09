import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Contact {
  id: number;
  name: string;
  phoneNumber: string;
  location: string;
}

interface ContactState {
  contact: Contact[];
}

const initialState: ContactState = {
  contact: [],
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContact(state, action: PayloadAction<Contact[]>) {
      state.contact = action.payload;
    },
  },
});

export const { setContact } = contactSlice.actions;

export default contactSlice.reducer;
