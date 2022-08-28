import Colors from '@/res/Colors';
import React, {useState} from 'react';
import {Platform, StyleSheet, TextInput} from 'react-native';

const CoinSearch = ({onChange}) => {
  const [inputValue, setInputValue] = useState('');

  const handleChange = query => {
    setInputValue(query);
    onChange(query);
  };

  return (
    <TextInput
      style={[
        styles.textInput,
        Platform.OS === 'ios' ? styles.textInputIOS : styles.textInputAndroid,
      ]}
      onChangeText={handleChange}
      value={inputValue}
      placeholder="Search Coins"
      placeholderTextColor="#fff"
    />
  );
};

export default CoinSearch;

const styles = StyleSheet.create({
  textInput: {
    height: 46,
    backgroundColor: Colors.charade,
    paddingLeft: 16,
    color: '#fff',
  },
  textInputAndroid: {
    borderBottomWidth: 2,
    borderBottomColor: '#fff',
  },
  textInputIOS: {
    margin: 8,
    borderRadius: 8,
  },
});
