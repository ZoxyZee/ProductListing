import AsyncStorage from '@react-native-async-storage/async-storage';

import {apiHelper} from '../utils/apiHelper';
import type {Product, ProductsResponse} from '../types/product';

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products';
const PRODUCT_CACHE_KEY = '@product_interview_app/products_cache';

type ProductPage = {
  items: Product[];
  total: number;
};

export async function fetchProducts(
  skip: number,
  limit: number,
): Promise<ProductPage> {
  const response = await apiHelper<ProductsResponse>(PRODUCTS_ENDPOINT, {
    params: {
      limit,
      skip,
    },
  });

  if (skip === 0) {
    await AsyncStorage.setItem(
      PRODUCT_CACHE_KEY,
      JSON.stringify(response.products),
    );
  }

  return {
    items: response.products,
    total: response.total,
  };
}

export async function getCachedProducts(): Promise<Product[]> {
  const rawValue = await AsyncStorage.getItem(PRODUCT_CACHE_KEY);

  if (!rawValue) {
    return [];
  }

  let parsedValue: unknown;

  try {
    parsedValue = JSON.parse(rawValue);
  } catch {
    await AsyncStorage.removeItem(PRODUCT_CACHE_KEY);
    return [];
  }

  if (!Array.isArray(parsedValue)) {
    return [];
  }

  return parsedValue.filter(isProduct);
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<Product>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.title === 'string' &&
    typeof candidate.price === 'number' &&
    typeof candidate.category === 'string' &&
    typeof candidate.thumbnail === 'string'
  );
}
