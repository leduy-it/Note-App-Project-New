import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, StatusBar, SafeAreaView } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {NavigationContainer} from '@react-navigation/native'

import Intro from './app/screens/intro'
import NoteScreen from './app/screens/NoteScreen';
import NoteDetail from './app/components/NoteDetail';
import NoteProvider from './app/contexts/NoteProvider';

const Stack = createNativeStackNavigator();
export default function App() {
  const [user, setUser] = useState({})
  const [firstTimeOpen, setFirstTimeOpen] = useState(false)
  const findUser = async() => {
    const result = await AsyncStorage.getItem('user');
    if (result === null) return setFirstTimeOpen(true);
    setUser(JSON.parse(result))
    setFirstTimeOpen(false)
  };

  useEffect(() => {
    findUser()
  }, [])
  const RenderNoteScreen = props => <NoteScreen {...props} user={user}/>

 
  if (firstTimeOpen) return <Intro onFinish={findUser}/>

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <NoteProvider>
            <Stack.Navigator screenOptions={{headerTitle: '', headerTransparent: true}}>
              <Stack.Screen component={RenderNoteScreen} name="NoteScreen"/>
              <Stack.Screen component={NoteDetail} name="NoteDetail"/>
            </Stack.Navigator> 
        </NoteProvider>
      </NavigationContainer>
    </SafeAreaView>
  )}


