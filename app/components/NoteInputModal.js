import React, { Component, useEffect, useRef, useState , useCallback} from 'react'
import { Text, StyleSheet, View, Modal, Keyboard, StatusBar, TextInput, TouchableWithoutFeedback, ScrollView, Platform, Alert, SafeAreaView ,NativeSyntheticEvent, ClipboardEvent  } from 'react-native'
import colors from '../misc/colors'
import RoundIconBtn from "../components/RoundIconBtn";
import RoundIconBtn_Found from "../components/RoundIconBtn_Found";
import DateTimePicker from '@react-native-community/datetimepicker'
import SelectColor from './SelectColor.js'
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ColorPicker from 'react-native-wheel-color-picker';
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import * as ImagePicker from 'expo-image-picker';
import TablePicker from 'react-native-table-component';

const NoteInputModal = ({visible, onClose, onSubmit, note, isEdit}) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [date,setDate] = useState('');
    const [mode, setMode] = useState('datetime')
    const [show, setShow] = useState(false)
    const [text, setText] = useState('')
    const [dateTime, setDateTime] = useState(new Date());
    const notificationListener = useRef();
    const responseListener = useRef();
    const [selectColors, setSelectColors] = useState(false)
    const [color, setColor] = useState('#FFF')
    if (note){
        var noteColor = note.color
    }
   
    const handlePaste = useCallback((event: NativeSyntheticEvent<ClipboardEvent>) => {
      const pastedText = event.nativeEvent.clipboardData.getData('text');
      handleOnChangeText(pastedText, 'title');
    }, [handleOnChangeText]);
    
    const handleCopy = useCallback(() => {
      Clipboard.setString(title);
    }, [title]);
    
    const handleCut = useCallback(() => {
      Clipboard.setString(title);
      handleOnChangeText('', 'title');
    }, [handleOnChangeText, title]);
    
    function onChange(event, selectedDate) {
        const currentDate = selectedDate || date;
        setShow(Platform.OS == 'ios');
        setDate(currentDate);
        if (selectedDate) {
            if (selectedDate < new Date()) {
                selectedDate = new Date();
                Alert.alert('Please select a future date and time');
            }
            let tempDate = new Date(currentDate);
            let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() + 1) + '/' + tempDate.getFullYear();
            let fTime = tempDate.getHours() + ':' + tempDate.getMinutes();
            setText(fDate + ' - ' + fTime);
            setDateTime(selectedDate);
        }     
    }
    const showMode = (currentMode) =>{
        setShow(true)
        setMode(currentMode)
    }
    const richText = useRef();
    const richTextHandle = (descriptionText) => {
        console.log("descriptionText", descriptionText)
        console.log("desc", desc)
        if (descriptionText) {
          setDesc(descriptionText);
        } else {
          setDesc("");
        }
    };
    const submitContentHandle = () => {
        if (!title.trim() && !desc.trim()) {
            setText('')
            setSelectColors(false)
            setColor("#FFF")
            setDate('')
            return onClose();
        }
        if (isEdit) {
            console.log("Im here")
            onSubmit(title, desc,date,color, Date.now())
        }
        else{
            console.log("Now Im here",date)
            onSubmit(title, desc,date,color);
            setTitle('');
            setDesc('');
            setDate('')
            setSelectColors(false)
            setColor("#FFF")
        }
        setText('')
        onClose();
    };
    const handleModalClose = () => {
        setSelectColors(false)
        Keyboard.dismiss();
    }
    useEffect(() => {
        if (isEdit) {
            setTitle(note.title)
            setDesc(note.desc)
            setColor(note.color)
        };
        console.log("one")
    }, [isEdit])
    const handleOnChangeText = (text, valueFor) => {
        if (valueFor === 'title') setTitle(text);
        if (valueFor === 'desc') setDesc(text);
    }
    const closeModal = () => {
        if (!isEdit) {
            setTitle('');
            setDesc('');
            setColor("#FFF")
            setDate('')
        }
        onClose();
    }
      const handleOnClose = () =>{
        setDate(date)
      }

      const styleEditor = {
        backgroundColor: noteColor || color
      }

      const getMediaLibraryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access media library is required!');
        }
      };

      const pickImage = async () => {

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        if (!result.canceled) {
          const uri = result.assets[0].uri;
          console.log(uri)
          richText.current?.insertImage(uri);
        }
    }
    const onColorChange = color => {
        setColor(color);
        if (note) note.color = color
      };
    return (
        <>
        <StatusBar hidden/>
        <Modal visible={visible} animationType='fade'>
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{backgroundColor:noteColor || color,...styles.container}}>
                <TextInput
                    value={title}
                    onChangeText={text => handleOnChangeText(text, 'title')}
                    placeholder='Write your Note title here...'
                    style={[styles.input, styles.title]}
                    onPaste={handlePaste}
                    onCopy={handleCopy}
                    onCut={handleCut}
                />
                <ScrollView style={{height: "100%",backgroundColor: noteColor || color}}>
                    <RichToolbar
                        editor={richText}
                        selectedIconTint="#873c1e"
                        iconTint="#312921"
                        actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.insertOrderedList,
                        actions.checkboxList,
                        actions.insertBulletsList,
                        actions.insertLink,
                        actions.setStrikethrough,
                        actions.insertImage,
                        { name: 'insertTable', title: 'Insert table', iconName: 'grid' }, // add table icon to the toolbar
                        ]}
                        onPressAddImage={pickImage}
                        insertTable={() => { // handle table icon press
                          TablePicker.show({
                              onInsertTable: (table) => {
                                  richText.current?.insertHTML(`<div>${table}</div>`); // insert table into RichEditor
                              }
                          });
                      }}
                        style={styles.richTextToolbarStyle} />
            
                    <RichEditor
                        onFocus={()=>setSelectColors(false)}
                        ref={richText}
                        initialContentHTML={desc}
                        onChange={richTextHandle}
                        placeholder="What are you thinking now?"
                        initialHeight={250}
                        editorStyle = {styleEditor}
                        allowFileAccess={true}
                        onPaste={handlePaste}
                        onCopy={handleCopy}
                        onCut={handleCut}
                    />
                </ScrollView>
            <TouchableWithoutFeedback onPress={handleModalClose}>
                <View style={[styles.modalBG, StyleSheet.absoluteFillObject]}/>
            </TouchableWithoutFeedback>
            </View>
            {
                selectColors && 
                (
                    <View style={styles.sectionContainer}>
                            <ColorPicker
                            color={color}
                            onColorChange={(color) => onColorChange(color)}
                            thumbSize={30}
                            sliderSize={30}
                            noSnap={true}
                            row={false}
                            />
                    </View>
                )
            }
            <View style={styles.footer}>
              <RoundIconBtn_Found antIconName='paint-bucket' style={{backgroundColor: "#FFF", color: "#000", ...styles.paint}} onPress={() => selectColors ? setSelectColors(false) : setSelectColors(true)} />
              <View style={styles.btnContainer}>
                <RoundIconBtn style={{color: colors.DARK, backgroundColor: colors.LIGHT, borderRadius: 20, padding: 10}} size={20} antIconName='check' onPress={submitContentHandle} />
                { title.trim() || desc.trim() ? (
                  <RoundIconBtn size={20} style={{marginLeft: 15, color: colors.DARK, backgroundColor: colors.LIGHT, borderRadius: 20, padding: 10}} antIconName='close' onPress={closeModal} />
                ) : null}
              </View> 
            </View>
          </SafeAreaView>
        </Modal>
        </>
)}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 15,
    width: "100%",
    backgroundColor: colors.LIGHT,
  },
  input: {
    borderBottomWidth: 2,
    fontSize: 20,
    color: colors.DARK,
    borderBottomColor: colors.PRIMARY,
    paddingBottom: 5,
    marginTop: 5,
  },
  title: {
    height: 40,
    marginBottom: 15,
    fontWeight: 'bold',
    fontSize: 24,
    color: colors.DARK,
  },
  desc: {
    height: 100,
    fontSize: 20,
    color: colors.DARK,
    marginTop: 10,
    borderColor: colors.PRIMARY,
    borderWidth: 2,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
  },
  modalBG: {
    flex: 1,
    zIndex: -1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: "center",
    maxWidth: 100,
    maxHeight: 60,
    borderRadius: 50,
    backgroundColor: colors.PRIMARY,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  richTextToolbarStyle: {
    backgroundColor: "#FFF",
  },
  paint:{
    position: 'relative',
    bottom: 0,
    zIndex: 1,
    width: 54,
    maxHeight: 54,
    marginLeft: 10,
    backgroundColor: colors.LIGHT,
  },
  footer:{
    height: 60,
    width: "100%",
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.LIGHT,
    borderTopWidth: 1,
    borderTopColor: colors.PRIMARY,
  },
  sectionContainer: {
    marginTop: 70,
    paddingHorizontal: 24,
    paddingVertical: 24,
    zIndex: 2,
    position: 'absolute',
    width: "70%",
    left: "15%",
    bottom: "20%",
    elevation: 4,
    backgroundColor: colors.LIGHT,
    borderRadius: 10,
  },
});
export default NoteInputModal;

