import FavoritesScreen from '@/components/Favorites/FavoritesScreen';
import Colors from '@/res/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';

const Stack = createStackNavigator();

const FavoritesStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Colors.blackPearl},
        headerTintColor: Colors.white,
      }}>
      <Stack.Screen name="Favorite Screen" component={FavoritesScreen} />
    </Stack.Navigator>
  );
};

export default FavoritesStack;

const styles = StyleSheet.create({});
