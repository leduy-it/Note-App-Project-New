import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const SearchBar = ({ containerStyle, value, onChangeText, onClear }) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.searchBar}>
        <AntDesign name='search1' size={20} color={colors.PRIMARY} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={styles.searchInput}
          placeholder='Search notes...'
          placeholderTextColor={colors.PRIMARY}
        />
        {value ? (
          <AntDesign
            name='close'
            size={20}
            color={colors.PRIMARY}
            onPress={onClear}
            style={styles.clearIcon}
          />
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
  },
  searchBar: {
    width: '90%',
    height: 50,
    backgroundColor: colors.LIGHT,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchInput: {
    fontSize: 20,
    marginLeft: 15,
    color: colors.PRIMARY,
    flex: 1,
  },
  clearIcon: {
    marginLeft: 10,
  },
});

export default SearchBar;
