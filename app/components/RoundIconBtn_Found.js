import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Foundation } from '@expo/vector-icons'
import colors from '../misc/colors'


const RoundIconBtn_Found = ({antIconName, size, color, style, onPress}) => {
    return <Foundation 
    name={antIconName} 
    size={size || 24} 
    color={color || colors.DARK}
    style={[styles.icon, {...style}]}
    onPress= {onPress}
    />
}

const styles = StyleSheet.create({
    icon:{
        padding: 15,
        borderRadius: 50,
        elevation: 5,
        position: 'absolute',
        right: 15,
        bottom: 100,
        zIndex: 1,
        backgroundColor: colors.PRIMARY,
    }
})

export default RoundIconBtn_Found;
