import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign,Foundation } from '@expo/vector-icons'
import colors from '../misc/colors'

const RoundIconBtn = ({antIconName, size, color, style, onPress}) => {
  return <AntDesign 
  name={antIconName} 
  size={size || 24} 
  color={color || colors.LIGHT}
  style={[styles.icon, {...style}]}
  onPress= {onPress}
  />
}

const styles = StyleSheet.create({
  icon: {
    backgroundColor: '#F5A623',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
    // Thêm thuộc tính borderRadius để bo cong nút
    borderRadius: 25, // giá trị bằng nửa chiều rộng hoặc chiều cao của icon
  },
  button: {
    backgroundColor: '#F5A623',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
})


export default RoundIconBtn;