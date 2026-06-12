import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type RatingStarsProps = {
  rating: number;
};

export function RatingStars({rating}: RatingStarsProps): React.JSX.Element {
  const roundedRating = Math.round(rating);

  return (
    <View style={styles.container}>
      {Array.from({length: 5}).map((_, index) => (
        <Text
          key={index}
          accessibilityLabel={index < roundedRating ? 'filled star' : 'empty star'}
          style={[styles.star, index < roundedRating ? styles.filled : styles.empty]}>
          ★
        </Text>
      ))}
      <Text style={styles.value}>{rating.toFixed(1)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  star: {
    fontSize: 17,
  },
  filled: {
    color: '#f5a623',
  },
  empty: {
    color: '#c8d0d8',
  },
  value: {
    color: '#566573',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
});
