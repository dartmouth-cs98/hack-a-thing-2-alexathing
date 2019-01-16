// app/Main.js
import React from 'react';
import { Button, Dimensions, Image, Alert } from 'react-native';
import {
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  AsyncStorage
} from 'react-native';
import { LinearGradient } from 'expo';
import uuid from 'uuid/v1';
import { primaryGradientArray } from './utils/Colors';
import Header from './components/Header';
import Input from './components/Input';
import List from './components/List';
const headerTitle = 'To Do';
const { height, _width } = Dimensions.get('window');
export default class Main extends React.Component {
  state = {
    inputValue: '',
    loadingItems: false,
    allItems: {},
    isCompleted: false
  };
  componentDidMount = () => {
    this.loadingItems();
  };
  newInputValue = value => {
    this.setState({
      inputValue: value
    });
  };
  
  loadingItems = async () => {
    try {
      const allItems = await AsyncStorage.getItem('ToDos');
      this.setState({
        loadingItems: true,
        allItems: JSON.parse(allItems) || {}
      });
    } catch (err) {
      console.log(err);
    }
  };
  onDoneAddItem = () => {
    const { inputValue } = this.state;
    if (inputValue !== '') {
      this.setState(prevState => {
        const id = uuid();
        const newItemObject = {
          [id]: {
            id,
            isCompleted: false,
            text: inputValue,
            createdAt: Date.now()
          }
        };
        const newState = {
          ...prevState,
          inputValue: '',
          allItems: {
            ...prevState.allItems,
            ...newItemObject
          }
        };
        this.saveItems(newState.allItems);
        return { ...newState };
      });
    }
  };
  deleteItem = id => {
    this.setState(prevState => {
      const allItems = prevState.allItems;
      delete allItems[id];
      const newState = {
        ...prevState,
        ...allItems
      };
      this.saveItems(newState.allItems);
      Alert.alert('Keep it up!')
      return { ...newState };
      
    });
  };
  completeItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: true
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };
  incompleteItem = id => {
    this.setState(prevState => {
      const newState = {
        ...prevState,
        allItems: {
          ...prevState.allItems,
          [id]: {
            ...prevState.allItems[id],
            isCompleted: false
          }
        }
      };
      this.saveItems(newState.allItems);
      return { ...newState };
    });
  };
  deleteAllItems = async () => {
    try {
      //await AsyncStorage.removeItem('ToDos');
      this.setState({ allItems: {} });
    } catch (err) {
      console.log(err);
    }
    Alert.alert('Good Work! Time to Relax :)')
  };
  saveItems = newItem => {
    const saveItem = AsyncStorage.setItem('To Dos', JSON.stringify(newItem));
  };
  
  render() {
    const { inputValue, loadingItems, allItems } = this.state;
    return (
      <LinearGradient colors={primaryGradientArray} style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.centered}>
          <Header title={headerTitle} />
        </View>
         
        
        <Button
          onPress={this.deleteAllItems}//, 
                   //Alert.alert('You tapped the button!')}
          title="Clear All"
          color="#841584"
          accessibilityLabel="Delete all items"
        />
        <View style={styles.inputContainer}>
          <Input
            inputValue={inputValue}
            onChangeText={this.newInputValue}
            onDoneAddItem={this.onDoneAddItem}
          />
        </View>
        <View style={styles.list}>
          <View style={styles.column}>
            <View style={styles.deleteAllButton}>
            </View>
          </View>
          {loadingItems ? (
            <ScrollView contentContainerStyle={styles.scrollableList}>
              {Object.values(allItems)
                .reverse()
                .map(item => (
                  <List
                    key={item.id}
                    {...item}
                    deleteItem={this.deleteItem}
                    completeItem={this.completeItem}
                    incompleteItem={this.incompleteItem}
                  />
                ))}
            </ScrollView>
          ) : (
            <ActivityIndicator size="large" color="white" />
          )}
        </View>
        <Image
          
          style={{width:_width, height: 200, flex: 1, zIndex: 0,
  justifyContent: 'flex-end',
  marginTop: 0}}
          source={{uri: 'https://www.catster.com/wp-content/uploads/2015/06/20130405-unmotivational-cats-hero.jpg'}}
        />
      </LinearGradient>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  centered: {
    alignItems: 'center'
  },
  inputContainer: {
    marginTop: 40,
    paddingLeft: 15
  },
  list: {
    flex: 1,
    marginTop: 70,
    paddingLeft: 15,
    marginBottom: 10,
    zIndex:1
  },
  scrollableList: {
    marginTop: 15
    
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deleteAllButton: {
    marginRight: 40
  }
});
