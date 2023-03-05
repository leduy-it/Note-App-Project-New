import React, { Component, useEffect, useState } from 'react'
import { Text, StyleSheet, View, StatusBar, TouchableWithoutFeedback, 
    Keyboard, FlatList, ImageBackground, Pressable, ScrollView, Image, Alert } from 'react-native'
import SearchBar from '../components/SearchBar'
import colors from '../misc/colors'
import RoundIconBtn from "../components/RoundIconBtn";
import NoteInputModal from '../components/NoteInputModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Note from '../components/Note';
import { useNotes } from '../contexts/NoteProvider';
import NotFound from '../components/NotFound';
const NoteScreen = ({user, navigation }) => {
    const [greet, setGreet] = useState('')
    const [modalVisible, setModalVisible] = useState(false)
    const {notes, setNotes, findNotes} = useNotes()
    const [searchQuery, setSearchQuery] = useState('')
    const [resultNotFound, setResultNotFound] = useState(false)
    const [BGButton, onChangeBGButton ] = useState(false)
    const reverseData = data => {
        return data.sort((a, b) => {
            const aInt = parseInt(a.time);
            const bInt = parseInt(b.time);
            if (aInt < bInt) return 1;
            if (aInt == bInt) return 0;
            if (aInt > bInt) return -1;
        });
    };
    const findGreet = () => {
        const hrs = new Date().getHours()
        if (hrs === 0 || hrs < 12) return setGreet('Morning');
        if (hrs === 1 || hrs < 17) return setGreet('Afternoon');
        setGreet('Evening')
    }
    useEffect(() => {
        findGreet()
    }, [])
    const reverseNotes = reverseData(notes)
    const reverseNotes_Push = reverseNotes.filter(note=>{
        return note.isPushpin === true
    })
    const reverseNotes_NoPush = reverseNotes.filter(note=>{
        return note.isPushpin === false
    })
    const handleOnSubmit = async (title, desc,date,color) => {
        const note = {id: Date.now(), title, desc, time: Date.now(),isPushpin: false, date : date,color: color };
        const updatedNotes = [...notes, note];
        setNotes(updatedNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes))
    }
    const openNote = (note) => {
        navigation.navigate('NoteDetail', {note});
    }
    const handleOnSeachInput = async (text) => {
        setSearchQuery(text);
        if (!text.trim()) {
            setSearchQuery('')
            setResultNotFound(false);
            return await findNotes()
        }

        const filteredNotes = notes.filter(note => {
            if (note.title.toLowerCase().includes(text.toLowerCase()) || note.desc.toLowerCase().includes(text.toLowerCase()))
                return note;
        })
        if (filteredNotes.length){
            setNotes([...filteredNotes])
        }
        else{
            setResultNotFound(true);
        }
    }
    const handleOnClear = async () => {
        setSearchQuery('')
        setResultNotFound(false)
        await findNotes()
    }
    const handleOnPressPush = async(note)=>{
        const result = await AsyncStorage.getItem('notes')
        let notes = []
        if (result !== null) notes = JSON.parse(result)
        const newNotes = notes.filter(n => {
            if (n.id === note.id) {
            if(n.isPushpin===false){
                n.isPushpin = true
            }
            else{
                n.isPushpin = false
            }
        }
            return n;
        })
        setNotes(newNotes)
        await AsyncStorage.setItem('notes', JSON.stringify(newNotes))
    }
    const [imbackground, setImbackground] = useState(require('../image/background/img_note1.png'))
    return (
        <View style={{flex: 1}}>
            {!BGButton && (
                <ImageBackground 
                    source={imbackground} 
                    resizeMode={'cover'} 
                    style={{flex: 1}}>
                    <StatusBar 
                        barStyle='dark-content' 
                        backgroundColor={colors.LIGHT} />
                        <TouchableWithoutFeedback 
                            onPress={Keyboard.dismiss}>
                            <View style={styles.container}>
                                <Text style={styles.header}>{`Good ${greet}, ${user.name}`}</Text>
                                {notes.length ? (
                                    <SearchBar value={searchQuery} onChangeText={handleOnSeachInput} 
                                    containerStyle={{marginVertical: 15}}
                                    onClear={handleOnClear}/>
                                ) : null}
                                {resultNotFound? <NotFound/> : 
                                    <View >
                                        {Object.entries(reverseNotes_Push).length !== 0 ? <Text style={{ fontSize: 18, color: '#4CAF50',marginBottom: 10,fontWeight: 'bold' }}>Đã ghim</Text>
 : null}
                                        
                                        <FlatList data={reverseNotes_Push} numColumns={2} 
                                            columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 15}} 
                                            keyExtractor={item => item.id.toString()}
                                            renderItem={({item}) => <Note 
                                                onPress={() => openNote(item)} 
                                                item = {item} 
                                                onPressPush={()=>handleOnPressPush(item)}
                                                />}
                                        />
                                        {Object.entries(reverseNotes_NoPush).length !== 0 ? <Text  style={{ fontSize: 18, color: '#4CAF50',marginBottom: 10,fontWeight: 'bold' }}> Ghi chú </Text> : null} 
                                        <FlatList 
                                            data={reverseNotes_NoPush} numColumns={2} 
                                            columnWrapperStyle={{justifyContent: 'space-between', marginBottom: 15}} 
                                            keyExtractor={item => item.id.toString()} 
                                            renderItem={({item}) => <Note 
                                                styles={{backgroundColor: item.color}} 
                                                onPress={() => openNote(item)} 
                                                item = {item} 
                                                onPressPush={()=>handleOnPressPush(item)}
                                                />} 
                                        />
                                    </View>
                                }

                                {!notes.length ? 
                                (<View style={[StyleSheet.absoluteFillObject, styles.emptyHeaderContainer]}>
                                    <Text style={styles.emptyHeader}>Thêm Note</Text>
                                </View>) : null}

                            </View>
                        </TouchableWithoutFeedback>
                    <RoundIconBtn onPress={() => setModalVisible(true)} antIconName='plus' style={styles.addBtn}/>
                    <RoundIconBtn
                        onPress={() => {onChangeBGButton(!BGButton)}}
                        antIconName={'picture'}
                        style={styles.button}>
                        <Text style={{textAlign: 'center'}}>{String(BGButton)}</Text>
                    </RoundIconBtn>

                    <NoteInputModal visible={modalVisible} 
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleOnSubmit}/>
                </ImageBackground>
            )}

            {BGButton && (
                <ImageBackground 
                    source={imbackground} 
                    resizeMode={'cover'} 
                    style={{flex: 1, alignItems: 'center'}}>
                    <Text style={styles.headerText}> Hình nền</Text>
                    <Pressable onPress={() => {setImbackground(require('../image/background/img_note1.png'))}}>
                        <Image
                            style={styles.image}
                            source={require('../image/background/img_note1.png')}
                            resizeMode="cover"
                            accessible={true}
                            accessibilityLabel={'BackGround001'}/>
                    </Pressable>
                    <Pressable onPress={() => {setImbackground(require('../image/background/img_note2.png'))}}>
                    <Image
                        style={styles.image}
                        source={require('../image/background/img_note2.png')}
                        resizeMode="cover"
                        accessible={true}
                        accessibilityLabel={'BackGround002'}
                    />
                    </Pressable>
                    <Pressable onPress={() => {setImbackground(require('../image/background/img_note3.png'))}}>
                    <Image
                        style={styles.image}
                        source={require('../image/background/img_note3.png')}
                        resizeMode="cover"
                        accessible={true}
                        accessibilityLabel={'BackGround003'}
                    />
                    </Pressable>
                    <Pressable onPress={() => {setImbackground(require('../image/background/img_note4.png'))}}>
                    <Image
                        style={styles.image}
                        source={require('../image/background/img_note4.png')}
                        resizeMode="cover"
                        accessible={true}
                        accessibilityLabel={'BackGround005'}
                    />
                    </Pressable>
                    <RoundIconBtn
                        onPress={() => {onChangeBGButton(!BGButton)}}
                        style={styles.addBtn}
                        antIconName={'minus'}>
                        <Text style={{textAlign: 'center'}}>{String(BGButton)}</Text>
                    </RoundIconBtn>
                </ImageBackground>
            )} 
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30, 
        fontWeight: 'bold',
        marginTop: 50, 
        color: '#FF9800', 
      },
      
    container: {
        paddingHorizontal: 20,
        flex: 1,
        zIndex: 1,
    },
    emptyHeader: {
        fontSize: 30,
        textTransform: 'uppercase',
        fontWeight: 'bold',
        opacity: 0.2,
    },
    emptyHeaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    addBtn: {
     
        position: 'absolute',
        right: 15,
        bottom: 50,
        zIndex: 1,

      },
      button: {
        top: 10,
        position: 'absolute',
        right: 20,
        width: 50,
        height: 50,
        zIndex: 1,
     
      },
    image: {
        width: 150,
        height: 150,
        borderWidth: 1,
        borderColor: 'black',
        margin: 10,
    },
    headerText: {
        paddingRight: 10,
        paddingLeft: 20,
        paddingTop: 30,
        paddingBottom: 10,
        fontSize: 30,
        color: '#EDEFEE',
        textAlign: 'center',
      },
})

export default NoteScreen;
