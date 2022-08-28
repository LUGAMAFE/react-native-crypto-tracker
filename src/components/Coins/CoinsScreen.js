import CoinSearch from '@/components/CoinDetail/CoinsSearch';
import CoinsItem from '@/components/Coins/CoinsItem';
import Http from '@/libs/Http';
import Colors from '@/res/Colors';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';

const CoinsScreen = props => {
  const urlApi = 'https://api.coinlore.net/api/tickers/';
  const {navigation} = props;
  const [coins, setCoins] = useState([]);
  const [allCoins, setAllCoins] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePress = useCallback(
    coin => {
      navigation.navigate('CoinDetail', {coin});
    },
    [navigation],
  );

  const handleSearch = query => {
    const lowerQuery = query.toLowerCase();
    const coinsFiltered = allCoins.filter(coin => {
      const nameFound = coin.name.toLowerCase().includes(lowerQuery);
      const symbolFound = coin.symbol.toLowerCase().includes(lowerQuery);
      return nameFound || symbolFound;
    });
    setCoins(coinsFiltered);
  };

  const getCoins = async () => {
    setLoading(true);
    const response = await Http.instance.get(urlApi);
    setCoins(response.data);
    setAllCoins(response.data);
    setLoading(false);
  };

  useEffect(() => {
    getCoins();
  }, []);

  return (
    <View style={styles.container}>
      <CoinSearch onChange={handleSearch} />
      {loading ? (
        <ActivityIndicator style={styles.loader} color="#000" size="large" />
      ) : null}
      <FlatList
        data={coins}
        renderItem={({item}) => (
          <CoinsItem item={item} onPress={() => handlePress(item)} />
        )}
      />
    </View>
  );
};

export default CoinsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charade,
    shadowColor: Colors.charade,
  },
  titleText: {
    color: '#fff',
    fontSize: 30,
    textAlign: 'center',
    marginTop: 10,
  },
  btn: {
    backgroundColor: 'green',
    padding: 8,
    borderRadius: 8,
    margin: 16,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
  },
  loader: {
    marginTop: 60,
  },
});
