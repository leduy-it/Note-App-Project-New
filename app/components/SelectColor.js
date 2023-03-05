import { Button, FlatList, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import colors from '../misc/colors.js'
import colorBG from '../misc/backgroundColor.js'

const basicColors = ['#FFFFFF', '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF'];

const SelectColor = ({ style, onPress }) => {
  console.log(basicColors);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 50 }}>
      {basicColors.map((color, index) => (
        <TouchableOpacity key={index} style={{ height: 50 }}>
          <Text
            key={color}
            onPress={() => onPress(color)}
            style={{
              borderWidth: 1,
              backgroundColor: color,
              width: 30,
              height: 30,
              borderRadius: 15,
              marginTop: 10,
              marginLeft: 10,
              borderColor: colors.PRIMARY,
            }}
          ></Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SelectColor;

const styles = StyleSheet.create({});
