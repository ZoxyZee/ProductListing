import React, {useEffect, useState} from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type {ProductFilters} from '../types/product';

type FilterModalProps = {
  visible: boolean;
  categories: string[];
  filters: ProductFilters;
  onApply: (filters: ProductFilters) => void;
  onClear: () => void;
  onClose: () => void;
};

export function FilterModal({
  visible,
  categories,
  filters,
  onApply,
  onClear,
  onClose,
}: FilterModalProps): React.JSX.Element {
  const [category, setCategory] = useState<string | undefined>(filters.category);
  const [minPrice, setMinPrice] = useState(
    filters.minPrice === undefined ? '' : String(filters.minPrice),
  );
  const [maxPrice, setMaxPrice] = useState(
    filters.maxPrice === undefined ? '' : String(filters.maxPrice),
  );

  useEffect(() => {
    if (visible) {
      setCategory(filters.category);
      setMinPrice(filters.minPrice === undefined ? '' : String(filters.minPrice));
      setMaxPrice(filters.maxPrice === undefined ? '' : String(filters.maxPrice));
    }
  }, [filters, visible]);

  const applyFilters = () => {
    onApply({
      category,
      minPrice: minPrice.trim() ? Number(minPrice) : undefined,
      maxPrice: maxPrice.trim() ? Number(maxPrice) : undefined,
    });
  };

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filters</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.close}>Close</Text>
            </Pressable>
          </View>

          <Text style={styles.label}>Category</Text>
          <View style={styles.chips}>
            {categories.map(item => (
              <Pressable
                key={item}
                onPress={() => setCategory(previous => (previous === item ? undefined : item))}
                style={[
                  styles.chip,
                  category === item ? styles.chipSelected : null,
                ]}>
                <Text
                  style={[
                    styles.chipText,
                    category === item ? styles.chipTextSelected : null,
                  ]}>
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Price Range</Text>
          <View style={styles.inputRow}>
            <TextInput
              keyboardType="numeric"
              onChangeText={setMinPrice}
              placeholder="Min"
              style={styles.input}
              value={minPrice}
            />
            <TextInput
              keyboardType="numeric"
              onChangeText={setMaxPrice}
              placeholder="Max"
              style={styles.input}
              value={maxPrice}
            />
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.secondaryButton} onPress={onClear}>
              <Text style={styles.secondaryText}>Clear</Text>
            </Pressable>
            <Pressable style={styles.primaryButton} onPress={applyFilters}>
              <Text style={styles.primaryText}>Apply</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    color: '#17202a',
    fontSize: 20,
    fontWeight: '800',
  },
  close: {
    color: '#176b87',
    fontSize: 14,
    fontWeight: '800',
  },
  label: {
    color: '#2c3e50',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 10,
    marginTop: 10,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderColor: '#c8d0d8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: '#176b87',
    borderColor: '#176b87',
  },
  chipText: {
    color: '#455a64',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: '#ffffff',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  input: {
    borderColor: '#c8d0d8',
    borderRadius: 6,
    borderWidth: 1,
    color: '#17202a',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 22,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#176b87',
    borderRadius: 6,
    flex: 1,
    paddingVertical: 13,
  },
  primaryText: {
    color: '#ffffff',
    fontWeight: '800',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#176b87',
    borderRadius: 6,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 13,
  },
  secondaryText: {
    color: '#176b87',
    fontWeight: '800',
  },
});
