import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {ErrorState} from '../components/ErrorState';
import {FilterModal} from '../components/FilterModal';
import {LoadingSkeleton} from '../components/LoadingSkeleton';
import {ProductCard} from '../components/ProductCard';
import {useDebounce} from '../hooks/useDebounce';
import {usePagination} from '../hooks/usePagination';
import type {RootStackParamList} from '../navigation/types';
import {fetchProducts, getCachedProducts} from '../services/productService';
import type {Product, ProductFilters} from '../types/product';

type ProductListScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductList'
>;

export function ProductListScreen({
  navigation,
}: ProductListScreenProps): React.JSX.Element {
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [cachedProducts, setCachedProducts] = useState<Product[]>([]);
  const debouncedSearchText = useDebounce(searchText, 300);

  const fetchPage = useCallback((skip: number, limit: number) => {
    return fetchProducts(skip, limit);
  }, []);

  const {
    data,
    error,
    hasMore,
    loadMore,
    loading,
    refresh,
    refreshing,
  } = usePagination<Product>({
    fetchPage,
    limit: 10,
  });

  useEffect(() => {
    if (error && data.length === 0) {
      getCachedProducts()
        .then(setCachedProducts)
        .catch(() => setCachedProducts([]));
    }
  }, [data.length, error]);

  const listSource = data.length > 0 ? data : cachedProducts;

  const categories = useMemo(() => {
    return Array.from(new Set(listSource.map(product => product.category))).sort();
  }, [listSource]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearchText.trim().toLowerCase();

    return listSource.filter(product => {
      const matchesTitle =
        !normalizedSearch ||
        product.title.toLowerCase().includes(normalizedSearch);
      const matchesCategory =
        !filters.category || product.category === filters.category;
      const matchesMinPrice =
        filters.minPrice === undefined || product.price >= filters.minPrice;
      const matchesMaxPrice =
        filters.maxPrice === undefined || product.price <= filters.maxPrice;

      return (
        matchesTitle &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });
  }, [debouncedSearchText, filters, listSource]);

  const activeFilterCount = [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ].filter(value => value !== undefined).length;

  const shouldShowInitialLoading = refreshing && listSource.length === 0;
  const shouldShowInitialError = error && listSource.length === 0 && !refreshing;
  const hasActiveSearchOrFilters =
    Boolean(debouncedSearchText.trim()) || activeFilterCount > 0;

  const handleApplyFilters = (nextFilters: ProductFilters) => {
    setFilters(nextFilters);
    setIsFilterVisible(false);
  };

  const handleClearFilters = () => {
    setFilters({});
    setIsFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Products</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.filterButton}
          onPress={() => setIsFilterVisible(true)}>
          <Text style={styles.filterButtonText}>
            Filter{activeFilterCount ? ` (${activeFilterCount})` : ''}
          </Text>
        </Pressable>
      </View>

      <TextInput
        autoCapitalize="none"
        clearButtonMode="while-editing"
        onChangeText={setSearchText}
        placeholder="Search by title"
        placeholderTextColor="#7f8c8d"
        style={styles.searchInput}
        value={searchText}
      />

      {shouldShowInitialLoading ? (
        <LoadingSkeleton />
      ) : shouldShowInitialError ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          contentContainerStyle={styles.listContent}
          data={filteredProducts}
          keyExtractor={item => String(item.id)}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.emptyText}>No matching products found.</Text>
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator color="#176b87" style={styles.footerLoader} />
            ) : null
          }
          onEndReached={() => {
            if (hasMore && !loading && !hasActiveSearchOrFilters) {
              loadMore().catch(() => undefined);
            }
          }}
          onEndReachedThreshold={0.45}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          renderItem={({item}) => (
            <ProductCard
              product={item}
              onPress={product =>
                navigation.navigate('ProductDetail', {product})
              }
            />
          )}
        />
      )}

      <FilterModal
        categories={categories}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onClose={() => setIsFilterVisible(false)}
        visible={isFilterVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f8fa',
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 18,
  },
  heading: {
    color: '#17202a',
    fontSize: 28,
    fontWeight: '900',
  },
  filterButton: {
    backgroundColor: '#176b87',
    borderRadius: 6,
    minWidth: 92,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    color: '#17202a',
    fontSize: 16,
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  listContent: {
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 18,
  },
  emptyText: {
    color: '#566573',
    fontSize: 15,
    padding: 28,
    textAlign: 'center',
  },
});
