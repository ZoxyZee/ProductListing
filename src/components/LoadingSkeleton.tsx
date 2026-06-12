import React from 'react';
import {StyleSheet, View} from 'react-native';

export function LoadingSkeleton(): React.JSX.Element {
  return (
    <View>
      {Array.from({length: 6}).map((_, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.image} />
          <View style={styles.body}>
            <View style={styles.lineLarge} />
            <View style={styles.lineMedium} />
            <View style={styles.badge} />
          </View>
        </View>
      ))}
    </View>
  );
}

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
  image: {
    backgroundColor: '#e4e9ef',
    borderRadius: 6,
    height: 82,
    width: 82,
  },
  body: {
    flex: 1,
    gap: 10,
  },
  lineLarge: {
    backgroundColor: '#e4e9ef',
    borderRadius: 4,
    height: 18,
    width: '88%',
  },
  lineMedium: {
    backgroundColor: '#e4e9ef',
    borderRadius: 4,
    height: 16,
    width: '38%',
  },
  badge: {
    backgroundColor: '#e4e9ef',
    borderRadius: 999,
    height: 24,
    width: 92,
  },
});
