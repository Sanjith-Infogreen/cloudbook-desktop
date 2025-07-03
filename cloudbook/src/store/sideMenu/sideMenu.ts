import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SideMenu {
  icon: string;
  Title: string;
  order: number;
  icon_New: string;
  main_Link: string;
  new_Link: string;
  icon_down: string;
  submenu: SideSubMenu[];
}

interface SideSubMenu {
  Title: string;
  icon_New: string;
  main_Link: string;
  new_Link: string;
  order: number;
}

interface TypeHeadState {
  sideMenuBar: SideMenu[];
}

const initialState: TypeHeadState = {
  sideMenuBar: [],
};

const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    setSideMenu(state, action: PayloadAction<SideMenu[]>) {
      const orderedData = action.payload
        .sort((a, b) => a.order - b.order)
        .map((item) => ({
          ...item,
          submenu: item.submenu
            ? [...item.submenu].sort((a, b) => a.order - b.order)
            : [],
        }));

      state.sideMenuBar = orderedData;
    },
  },
});

export const { setSideMenu } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
