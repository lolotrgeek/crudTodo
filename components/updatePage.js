import React from 'react';
import { StyleSheet, View, TextInput,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function TodoList(props) {
    return (
    <View style={styles.textInputContainer}>
        <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder="Update to d"
            placeholderTextColor="#abbabb"
            value={props.inputvalue}
            onChangeText={inputvalue => props.setValue(inputvalue)}
        />
        <TouchableOpacity onPress={props.updateTodo()}>
            <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
    </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: '#F5FCFF'
    },
    header: {
      marginTop: '15%',
      fontSize: 20,
      color: 'red',
      paddingBottom: 10
    },
    textInputContainer: {
      flexDirection: 'row',
      alignItems: 'baseline',
      borderColor: 'black',
      borderBottomWidth: 1,
      paddingRight: 10,
      paddingBottom: 10
    },
    textInput: {
      flex: 1,
      height: 20,
      fontSize: 18,
      fontWeight: 'bold',
      color: 'black',
      paddingLeft: 10,
      minHeight: '3%'
    }
  });