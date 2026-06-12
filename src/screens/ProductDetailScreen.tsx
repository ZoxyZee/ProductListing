import React, {useEffect} from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {RatingStars} from '../components/RatingStars';
import type {RootStackParamList} from '../navigation/types';
import {
  hydrateWishlist,
  persistWishlist,
  toggleWishlist,
} from '../store/wishlistSlice';
import {useAppDispatch, useAppSelector} from '../store/store';

type ProductDetailScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ProductDetail'
>;

export function ProductDetailScreen({
  route,
}: ProductDetailScreenProps): React.JSX.Element {
  const {product} = route.params;
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector(state => state.wishlist.ids);
  const hydrated = useAppSelector(state => state.wishlist.hydrated);
  const isWishlisted = wishlistIds.includes(product.id);

  useEffect(() => {
    if (!hydrated) {
      dispatch(hydrateWishlist()).catch(() => undefined);
    }
  }, [dispatch, hydrated]);

  const handleToggleWishlist = () => {
    const nextIds = isWishlisted
      ? wishlistIds.filter(id => id !== product.id)
      : [...wishlistIds, product.id];

    dispatch(toggleWishlist(product.id));
    dispatch(persistWishlist(nextIds)).catch(() => undefined);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image
        resizeMode="contain"
        source={{uri: product.images[0] ?? product.thumbnail}}
        style={styles.image}
      />

      <View style={styles.titleRow}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>

      <RatingStars rating={product.rating} />

      <View style={styles.metaRow}>
        <Text style={styles.badge}>{product.category}</Text>
        <Text
          style={[
            styles.stock,
            product.stock > 0 ? styles.inStock : styles.outOfStock,
          ]}>
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </Text>
      </View>

      <Text style={styles.description}>{product.description}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={handleToggleWishlist}
        style={[
          styles.wishlistButton,
          isWishlisted ? styles.wishlistButtonActive : null,
        ]}>
        <Text
          style={[
            styles.wishlistText,
            isWishlisted ? styles.wishlistTextActive : null,
          ]}>
          {isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6f8fa',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  image: {
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    height: 320,
    width: '100%',
  },
  titleRow: {
    gap: 8,
    marginTop: 18,
  },
  title: {
    color: '#17202a',
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 31,
  },
  price: {
    color: '#176b87',
    fontSize: 22,
    fontWeight: '900',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 16,
  },
  badge: {
    backgroundColor: '#e8f4f8',
    borderColor: '#a7d3df',
    borderRadius: 999,
    borderWidth: 1,
    color: '#24586a',
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
    textTransform: 'capitalize',
  },
  stock: {
    borderRadius: 999,
    fontSize: 13,
    fontWeight: '800',
    overflow: 'hidden',
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  inStock: {
    backgroundColor: '#e7f6ed',
    color: '#1f7a3d',
  },
  outOfStock: {
    backgroundColor: '#fdeaea',
    color: '#b42318',
  },
  description: {
    color: '#34495e',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 18,
  },
  wishlistButton: {
    alignItems: 'center',
    backgroundColor: '#176b87',
    borderRadius: 8,
    marginTop: 24,
    paddingVertical: 15,
  },
  wishlistButtonActive: {
    backgroundColor: '#ffffff',
    borderColor: '#176b87',
    borderWidth: 1,
  },
  wishlistText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  wishlistTextActive: {
    color: '#176b87',
  },
});
