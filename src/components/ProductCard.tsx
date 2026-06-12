import React, {memo, useState} from 'react';
import {
  Image,
  ImageStyle,
  ImageURISource,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import type {Product} from '../types/product';

type ProductCardProps = {
  product: Product;
  onPress: (product: Product) => void;
  style?: ViewStyle;
};

function ProductCardComponent({
  product,
  onPress,
  style,
}: ProductCardProps): React.JSX.Element {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(product)}
      style={({pressed}) => [
        styles.card,
        style,
        pressed ? styles.cardPressed : null,
      ]}>
      <ProductThumbnail
        source={{uri: product.thumbnail}}
        title={product.title}
        style={styles.thumbnail}
      />
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text numberOfLines={2} style={styles.title}>
            {product.title}
          </Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        </View>
        <Text numberOfLines={1} style={styles.badge}>
          {product.category}
        </Text>
      </View>
    </Pressable>
  );
}

type ProductThumbnailProps = {
  source: ImageURISource;
  title: string;
  style: ImageStyle;
};

function ProductThumbnail({
  source,
  title,
  style,
}: ProductThumbnailProps): React.JSX.Element {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <View style={[style, styles.thumbnailFrame]}>
      {!isLoaded || hasError ? (
        <Text numberOfLines={2} style={styles.thumbnailFallback}>
          {title}
        </Text>
      ) : null}
      {!hasError ? (
        <Image
          onError={() => setHasError(true)}
          onLoadEnd={() => setIsLoaded(true)}
          resizeMode="cover"
          source={source}
          style={[StyleSheet.absoluteFillObject, styles.thumbnailImage]}
        />
      ) : null}
    </View>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9e2ec',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
  },
  cardPressed: {
    opacity: 0.72,
  },
  thumbnail: {
    borderRadius: 6,
    height: 82,
    width: 82,
  },
  thumbnailFrame: {
    alignItems: 'center',
    backgroundColor: '#eef2f6',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbnailImage: {
    borderRadius: 6,
  },
  thumbnailFallback: {
    color: '#6c7a89',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 13,
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    gap: 10,
  },
  titleRow: {
    gap: 6,
  },
  title: {
    color: '#17202a',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
  },
  price: {
    color: '#176b87',
    fontSize: 15,
    fontWeight: '700',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e8f4f8',
    borderColor: '#a7d3df',
    borderRadius: 999,
    borderWidth: 1,
    color: '#24586a',
    fontSize: 12,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    textTransform: 'capitalize',
  },
});
