import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TypeHead {
  id: number;
  name: string;
  description: string;
}



interface TypeHeadState {
  typeHead: TypeHead[];
 
}

const initialState: TypeHeadState = {
  typeHead: [],
  
};

const typeHeadSlice = createSlice({
  name: "typeHead",
  initialState,
  reducers: {
    setTypeHead(state, action: PayloadAction<TypeHead[]>) {
      
      state.typeHead = action.payload;
    },
    
    
  },
});

export const {
  setTypeHead,
} = typeHeadSlice.actions;

export default typeHeadSlice.reducer;
