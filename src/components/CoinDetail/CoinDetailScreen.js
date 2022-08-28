import CoinMarketItem from '@/components/CoinDetail/CoinMarketItem';
import Http from '@/libs/Http';
import Storage from '@/libs/Storage';
import Colors from '@/res/Colors';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const CoinDetailScreen = ({
  route: {
    params: {coin},
  },
  navigation,
}) => {
  const [loading, setLoading] = useState(false);
  const [markets, setMarkets] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const imageUri = useMemo(
    () => `https://c1.coinlore.com/img/16x16/${coin.nameid}.png`,
    [coin.nameid],
  );
  const isMounted = useRef(false);

  const sections = [
    {
      title: 'Market cap',
      data: [coin.market_cap_usd],
    },
    {
      title: 'Volume 24h',
      data: [coin.volume24],
    },
    {
      title: 'Change 24h',
      data: [coin.percent_change_24h],
    },
  ];

  const toggleFavorite = async () => {
    // Storage.instance.remove('favorites');
    isFavorite ? removeFavorite() : addFavorite();
  };

  const addFavorite = async () => {
    let favorites = JSON.parse(await Storage.instance.get('favorites'));
    if (favorites === null) {
      favorites = [];
    }
    const saved = Storage.instance.store(
      'favorites',
      JSON.stringify([...favorites, {id: coin.id, coin}]),
    );
    //console.log([...favorites, {id: coin.id, coin}]);
    if (saved) setIsFavorite(true);
  };

  const remove = async () => {
    let favorites = JSON.parse(await Storage.instance.get('favorites'));
    if (favorites === null) {
      favorites = [];
    }
    const filteredFavorites = favorites.filter(el => el.id !== coin.id);
    const saved = Storage.instance.store(
      'favorites',
      JSON.stringify(filteredFavorites),
    );
    //console.log(filteredFavorites);
    if (saved) setIsFavorite(false);
  };

  const removeFavorite = async () => {
    Alert.alert('Remove this favorite', 'Are you sure?', [
      {text: 'cancel', onPress: () => {}, style: 'cancel'},
      {text: 'remove', onPress: remove, style: 'destructive'},
    ]);
  };

  useEffect(() => {
    isMounted.current = true;
    const getIsFavorite = async () => {
      if (isMounted) {
        let favorites = JSON.parse(await Storage.instance.get('favorites'));
        if (favorites === null) {
          favorites = [];
        }
        const found = favorites.some(el => el.id === coin.id);
        setIsFavorite(found);
      }
    };
    getIsFavorite();
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await Http.instance.get(
          `https://api.coinlore.net/api/coin/markets/?id=${coin.id}`,
        );
        setMarkets(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [coin.id]);

  useEffect(() => {
    navigation.setOptions({title: coin.symbol});
  }, [navigation, coin.symbol, coin]);
  return (
    <View style={styles.container}>
      <View style={styles.subHeader}>
        <View style={styles.coinInfo}>
          <Image style={styles.iconImg} source={{uri: imageUri}} />
          <Text style={styles.titleText}>{coin.name}</Text>
        </View>

        <Pressable
          onPress={toggleFavorite}
          style={[
            styles.btnFavorite,
            isFavorite ? styles.btnFavoriteRemove : styles.btnFavoriteAdd,
          ]}>
          <Text style={styles.btnFavoriteText}>
            {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
          </Text>
        </Pressable>
      </View>
      <SectionList
        style={styles.section}
        sections={sections}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.sectionItem}>
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({section}) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionText}>{section.title}</Text>
          </View>
        )}
      />

      <Text style={styles.marketTitle}>Markets</Text>
      <FlatList
        style={styles.list}
        horizontal={true}
        data={markets}
        renderItem={({item}) => <CoinMarketItem item={item} />}
      />
    </View>
  );
};

export default CoinDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
  },
  subHeader: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  iconImg: {
    width: 25,
    height: 25,
  },
  sectionHeader: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 8,
  },
  sectionItem: {
    padding: 8,
  },
  itemText: {
    color: '#fff',
    fontSize: 14,
  },
  list: {
    maxHeight: 100,
    paddingLeft: 16,
  },
  sectionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  section: {
    maxHeight: 220,
  },
  marketTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
    fontWeight: 'bold',
    paddingLeft: 16,
  },
  btnFavorite: {
    padding: 8,
    borderRadius: 8,
  },
  btnFavoriteText: {
    color: Colors.white,
  },
  btnFavoriteAdd: {
    backgroundColor: Colors.picton,
  },
  btnFavoriteRemove: {
    backgroundColor: Colors.carmine,
  },
  coinInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
