import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  activeModal: string | null;
  filters: {
    city: string;
    gender: string;
    maxRent: number;
    wifi: boolean;
    food: boolean;
    parking: boolean;
    laundry: boolean;
  };
}

const initialState: UiState = {
  sidebarOpen: false,
  activeModal: null,
  filters: {
    city: '',
    gender: '',
    maxRent: 50000,
    wifi: false,
    food: false,
    parking: false,
    laundry: false,
  },
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setActiveModal: (state, action: PayloadAction<string | null>) => {
      state.activeModal = action.payload;
    },
    updateFilters: (state, action: PayloadAction<Partial<UiState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setActiveModal, updateFilters, resetFilters } = uiSlice.actions;
export default uiSlice.reducer;