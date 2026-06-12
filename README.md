# Product Interview App

React Native CLI + TypeScript implementation of the product listing assignment using the DummyJSON products API.

## Features

- Product list from `https://dummyjson.com/products?limit=10&skip=0`
- Product cards with thumbnail, title, price, and category badge
- Manual `useDebounce` hook with 300ms search debounce
- Category and price range filtering through a native modal
- Infinite scroll pagination with `skip += 10`
- Loading skeleton and retryable error state
- Product detail screen with image, title, description, price, rating stars, category, and stock
- Wishlist toggle persisted with AsyncStorage
- Last first-page product list cached with AsyncStorage for offline fallback
- Utility functions for API calls, pagination, debounce, reverse string, and duplicates

## Tech Stack

- React Native CLI
- TypeScript
- React Navigation native stack
- Axios
- Redux Toolkit
- AsyncStorage
- Custom hooks for data fetching, caching, pagination, and debounce

## Setup

```bash
npm install
npm start
```

In a second terminal:

```bash
npm run android
```

For iOS, install pods first:

```bash
cd ios
pod install
cd ..
npm run ios
```

## Project Structure

```text
src/
  components/
  hooks/
  navigation/
  screens/
  services/
  store/
  types/
  utils/
```

## Architecture Notes

- `src/services/productService.ts` owns API access and local offline cache writes.
- `src/hooks/usePagination.ts` keeps pagination reusable and UI-agnostic.
- `src/hooks/useDebounce.ts` is implemented without lodash or external debounce libraries.
- `src/store/wishlistSlice.ts` manages wishlist state, with persistence handled by AsyncStorage thunks.
- Screen navigation is typed through `RootStackParamList`.
- Components are split into separate files to keep screens readable.

## Screenshots

Add screenshots here after running the app on an emulator or device.
