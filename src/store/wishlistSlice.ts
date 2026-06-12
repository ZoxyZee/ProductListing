import AsyncStorage from '@react-native-async-storage/async-storage';
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';

const WISHLIST_STORAGE_KEY = '@product_interview_app/wishlist_ids';

type WishlistState = {
  ids: number[];
  hydrated: boolean;
};

const initialState: WishlistState = {
  ids: [],
  hydrated: false,
};

export const hydrateWishlist = createAsyncThunk<number[]>(
  'wishlist/hydrate',
  async () => {
    const storedValue = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is number => typeof item === 'number')
      : [];
  },
);

export const persistWishlist = createAsyncThunk<void, number[]>(
  'wishlist/persist',
  async ids => {
    await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  },
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    toggleWishlist: (state, action: PayloadAction<number>) => {
      if (state.ids.includes(action.payload)) {
        state.ids = state.ids.filter(id => id !== action.payload);
        return;
      }

      state.ids.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder.addCase(hydrateWishlist.fulfilled, (state, action) => {
      state.ids = action.payload;
      state.hydrated = true;
    });
  },
});

export const {toggleWishlist} = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;
