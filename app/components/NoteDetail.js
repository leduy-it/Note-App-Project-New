import React, { Component, useRef, useState, useEffect } from 'react'
import { Text, StyleSheet, View, ScrollView,Dimensions, Alert, LogBox, Keyboard } from 'react-native'
import { useHeaderHeight } from '@react-navigation/elements'
import colors from '../misc/colors'
import RoundIconBtn from './RoundIconBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNotes } from '../contexts/NoteProvider';
import NoteInputModal from './NoteInputModal';
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
const width_window = Dimensions.get('window').width - 50
const height_window = Dimensions.get('window').height - 160
const formatDate = ms => {
  const date = new Date(ms)
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hrs = date.getHours();
  const min = date.getMinutes();
  const sec = date.getSeconds();

  return `${day}/${month}/${year} - ${hrs}:${min}:${sec}`;
};
const NoteDetail = (props) => {
    const [note, setNote] = useState(props.route.params.note)
    const headerHeight = useHeaderHeight()
    const {setNotes} = useNotes()
    const [showModal, setShowModal] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [textNotify, setTextNotify] = useState('')
    const richText = useRef();
    const deleteNote = async () => {
      const result = await AsyncStorage.getItem('notes')
      let notes = []
      if (result !== null) notes = JSON.parse(result)

      const newNotes = notes.filter(n => n.id !== note.id)
      setNotes(newNotes)
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
      props.navigation.goBack();
    }

    const displayDeleteAlert = () => {
      Alert.alert('Are You Sure?', 'This action will delete your note permanently!!', [{
      text: 'Delete',
      onPress: deleteNote
    },
    {
      text: 'No Thanks',
      onPress: () => console.log('cancel delete')
    }], { cancelable: true, })}
    const handleUpdate = async (title, desc, date,color,time) => {
      const result = await AsyncStorage.getItem('notes')
      let notes = []
      if (result !== null) notes = JSON.parse(result)
      const newNotes = notes.filter(n => {
        if (n.id === note.id) {
          n.title = title
          n.desc = desc
          n.isUpdated = true
          n.time = time
          n.date = date
          n.color = color
          contentNotify(n)
          setNote(n)
        }
        return n;
      })
      console.log("\nnewNote -- detail line 91: ",newNotes)
      setNotes(newNotes)
      await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
    };

    const handleOnClose = () => setShowModal(false)

    const openEditModal = () => {
      setIsEdit(true)
      setShowModal(true)
    }
    const contentNotify = (n) =>{
      const date = n.date
      if (date){
        const newDate = new Date(date)
        let fDate = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
        
        let fTime = newDate.getHours() + ':' + newDate.getMinutes()
        setTextNotify(fTime + ' - ' + fDate)
      }
    }

    const extractImageSource = (htmlString) => {
      const regex = /<img.*?src="(.*?)"/; 
      const match = regex.exec(htmlString);
      if (match && match[1]) {
        return match[1];
      }
      return null;
    };
    
    const imageSource = extractImageSource(note.desc);

    useEffect(()=>{
      contentNotify(note)
      console.log(1)
    },[])

    const styleEditor = {
      backgroundColor: note.color,

    }

    return (
      <>
      <ScrollView contentContainerStyle={[styles.container, {paddingTop: headerHeight, backgroundColor: note.color, height: "100%"}]}>

        <Text style={styles.time}>{note.isUpdated ? `Last Updated At ${formatDate(note.time)}` : `Created At ${formatDate(note.time)}`}</Text>
        {textNotify&&  <Text style={styles.contentNotifys}>Notify: {textNotify}</Text>}
        <Text style={styles.title}>{note.title}</Text>
        <ScrollView style={{backgroundColor: note.color}}>
          <RichEditor
            ref={richText}
            initialContentHTML={note.desc}
            style={styles.richTextEditorStyle}
            initialHeight={height_window}
            insertImage= {imageSource}
            allowFileAccess={true}
            editorStyle = {styleEditor}
            disabled={true}
          />
        </ScrollView>
      </ScrollView>
        <View style={styles.btnContainer}>
            <RoundIconBtn antIconName='delete' style={{backgroundColor: colors.ERROR, 
              marginBottom: 15}} onPress={displayDeleteAlert}/>
            <RoundIconBtn antIconName='edit' onPress={openEditModal}/>
        </View>
        <NoteInputModal isEdit={isEdit} note={note} onClose={handleOnClose} onSubmit={handleUpdate} visible={showModal} />
      </>
    )
  }

  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      backgroundColor: "#fff",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    
      elevation: 5,
    },
    
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.PRIMARY,
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    desc: {
      fontSize: 22,
      opacity: 0.8,
      color: "#555",
      lineHeight: 30,
      paddingHorizontal: 10,
      paddingBottom: 20,
    },
    time: {
      fontSize: 12,
      opacity: 0.5,
      textAlign: 'right',
      paddingHorizontal: 10,
      paddingTop: 10,
    },
    btnContainer: {
      position: 'absolute',
      right: 15,
      bottom: 50, 
    },
    richTextEditorStyle: {
      elevation: 4,
      fontSize: 18,
      height: "70%",
      borderColor: "#000",
      borderWidth: 1,  
    },
    richTextToolbarStyle: {
      backgroundColor: "#c6c3b3",
      borderColor: "#c6c3b3",
      borderRadius: 10,
      borderWidth: 1,
    },
    contentNotifys:{
      fontWeight: 'bold',
      textAlign: 'right',
      color: "#888"
    }
  });
  

export default NoteDetail;