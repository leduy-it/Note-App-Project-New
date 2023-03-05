import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const NotFound = () => {
  return (
    <View style={styles.container}>
      <AntDesign name='frowno' size={90} color='gray' />
      <Text style={styles.text}>Result not found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  text: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
  },
});

export default NotFound;
