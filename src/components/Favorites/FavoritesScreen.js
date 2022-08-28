import CoinsItem from '@/components/Coins/CoinsItem';
import FavoritesEmptyState from '@/components/Favorites/FavoritesEmptyState';
import Storage from '@/libs/Storage';
import Colors from '@/res/Colors';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';

const FavoritesScreen = ({navigation}) => {
  const [favorites, setFavorites] = useState([]);

  const handlePress = useCallback(
    coin => {
      navigation.navigate('CoinDetail', {coin});
    },
    [navigation],
  );

  const getFavorites = async () => {
    let favoritesList = JSON.parse(await Storage.instance.get('favorites'));
    if (favoritesList === null) {
      favoritesList = [];
    }
    setFavorites(favoritesList);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFavorites();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {favorites.length <= 0 ? (
        <FavoritesEmptyState />
      ) : (
        <FlatList
          data={favorites}
          renderItem={({item}) => (
            <CoinsItem
              item={item.coin}
              onPress={() => handlePress(item.coin)}
            />
          )}
        />
      )}
    </View>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.charade,
    flex: 1,
  },
});
