import CoinDetailScreen from '@/components/CoinDetail/CoinDetailScreen';
import CoinsScreen from '@/components/Coins/CoinsScreen';
import Colors from '@/res/Colors';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';

const Stack = createStackNavigator();

const CoinsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: Colors.blackPearl},
        headerTintColor: Colors.white,
      }}>
      <Stack.Screen name="CoinsScreen" component={CoinsScreen} />
      <Stack.Screen name="CoinDetail" component={CoinDetailScreen} />
    </Stack.Navigator>
  );
};

export default CoinsStack;
