import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {ProductDetailScreen} from '../screens/ProductDetailScreen';
import {ProductListScreen} from '../screens/ProductListScreen';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="ProductList"
      screenOptions={{
        contentStyle: {backgroundColor: '#f6f8fa'},
        headerShadowVisible: false,
        headerTitleStyle: {
          color: '#17202a',
          fontWeight: '900',
        },
      }}>
      <Stack.Screen
        component={ProductListScreen}
        name="ProductList"
        options={{title: 'Product Listing'}}
      />
      <Stack.Screen
        component={ProductDetailScreen}
        name="ProductDetail"
        options={{title: 'Product Detail'}}
      />
    </Stack.Navigator>
  );
}
