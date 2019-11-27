import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  AsyncStorage
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import TodoList from './components/TodoList';
import { AR } from 'expo';


export default function App() {
  const [inputvalue, setValue] = useState(''); // state of text input
  const [editvalue, setEditValue] = useState([]); // state of list item input
  const [todos, setTodos] = useState([]); // state of todo list

  const getAll = async () => {
    console.log('ASYNC STORAGE - getting all entries... ')
        const keys = await AsyncStorage.getAllKeys()
    console.info('ASYNC STORAGE - KEYS :', keys)
    const stores = await AsyncStorage.multiGet(keys)
    stores.map((result, i, store) => {
      let key = result[0]
      let value = result[1]
      if (typeof value === 'string' && value.charAt(0) === '{') {
        let value = JSON.parse(result[1])
        let entry = [key, value]
        console.log('ASYNC STORAGE - ADDING TO STATE : ' , result)
        setTodos(todos => [...todos, entry])
        // https://stackoverflow.com/questions/54676966/push-method-in-react-hooks-usestate
      }
      else {
        console.log('ASYNC STORAGE - INVALID ENTRY: ' , result)
      }
    });
  }
  useEffect(() => {
    getAll()
  }, []) // [] makes useEffect run once!
  // https://css-tricks.com/run-useeffect-only-once/

  const stringifyValue = (value) => {
    if (typeof value === 'object' || Array.isArray(value)) value = JSON.stringify(value) 
    return value
  } 

  /**
   * Add key value pair to Async Storage
   * @param {*} key 
   * @param {*} value 
   */
  const storeItem = async (key, value) => {
    if (typeof value === 'object' || Array.isArray(value)) value = JSON.stringify(value)
    try {
      console.log('ASYNC STORAGE - STORING : [' + key + ' , ' + value + ']')
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(error)
    }
  };

  /**
   * Update existing key with given value in Async Storage
   * @param {*} key 
   * @param {*} value 
   */
  const updateItem = async (key, value) => {
    if (typeof value === 'object' || Array.isArray(value) ) value = JSON.stringify(value)
    try {
      console.log('ASYNC STORAGE - UPDATING: ', [key, value] )
      await AsyncStorage.mergeItem(key, value);
    } catch (error) {
      console.error(error)
    }
  };

  /**
   * Remove item by key in Async Storage
   * @param {*} key 
   */
  const removeItem = async key => {
    try {
      console.log('ASYNC STORAGE - REMOVING : ' + key)
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(error)
    }
  }

  /**
   *  Delete entire async Storage
   */
  const removeAll = async () => {
    try {
      console.log('ASYNC STORAGE - REMOVING ALL')
      setTodos([])
      await AsyncStorage.clear()
    } catch (error) {
      console.error(error)
    }
  }

  const addTodo = () => {
    if (inputvalue.length > 0) {
      const NEWKEY = Date.now().toString()
      const NEWVALUE = { text: inputvalue, checked: false }
      const NEWENTRY = [NEWKEY, NEWVALUE]
      storeItem(NEWKEY, NEWVALUE)
      setTodos([...todos, NEWENTRY]); // add todo to state
      setValue(''); // reset value of input to empty
    }
  };

  const checkTodo = id => {
    setTodos(
      todos.map(todo => {
        if (todo[0] === id) {
          todo[1].checked = !todo[1].checked;
          updateItem(todo[0], { text: todo[1].text, checked: todo[1].checked })
        }
        return todo;
      })
    );
  };

  const updateTodo = (key, value) => {
    updateItem(key, value)
    // find where key is the same and overwrite it
    let update = todos.filter(todo => {
      if (todo[0] === key) {
        todo[1] = value
        return todo
      }
    })
    console.log('STATE - updated : ' , update)
    console.log('STATE - todos : ' , todos)
    // setTodos([...todos, update[1].text = editvalue.input])
  }

  const todoState = id => {
    // console.log('STATE- editvalue : ' , editvalue)
    if (editvalue.id && editvalue.id === id) return true
  }

  const deleteTodo = id => {
    removeItem(id) // remove from async storage
    setTodos(
      // filter from todo state
      todos.filter(todo => {
        if (todo[0] !== id) {
          return true;
        }
      })
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Todo List</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          multiline={false}
          placeholder="What do you want to do today?"
          placeholderTextColor="#abbabb"
          value={inputvalue}
          onChangeText={inputvalue => setValue(inputvalue)}
        />
        <TouchableOpacity onPress={() => addTodo()}>
          <Icon name="plus" size={30} color="blue" style={{ marginLeft: 10 }} />
        </TouchableOpacity>
      </View>
      <ScrollView style={{ width: '100%' }}>
        {todos.map((item, i) =>
          (<TodoList
            value={!todoState(item[0]) ? item[1].text : editvalue.input}
            key={item[0]}
            checked={item[1].checked}
            onChangeText={input => setEditValue({ id: item[0], input: input })}
            setChecked={() => checkTodo(item[0])}
            updateTodo={() => updateTodo(item[0], { text: editvalue.input, checked: item[1].checked })}
            deleteTodo={() => deleteTodo(item[0])}
            onFocus={() => setEditValue({ id: item[0], input: item[1].text })}
          />)
        )}
      </ScrollView>
      <TouchableOpacity onPress={() => removeAll()}>
        <Icon name="minus" size={40} color="red" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => getAll()}>
        <Icon name="plus" size={40} color="blue" style={{ marginLeft: 10 }} />
      </TouchableOpacity>
    </View>
  );
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