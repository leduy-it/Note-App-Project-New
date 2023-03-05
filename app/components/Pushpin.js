import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';
import colors from '../misc/colors';

const Pushpin = ({ antIconName, size, color, style, onPress }) => {
  return (
    <View style={[styles.container, style]}>
      <AntDesign
        name={antIconName}
        size={size || 24}
        color={color || colors.DARK}
        style={styles.icon}
        onPress={onPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {},
});

export default Pushpin;
