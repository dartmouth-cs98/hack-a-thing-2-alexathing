// App.js
import React from 'react';
import Main from './app/Main';
import { StyleSheet, Text, View } from 'react-native';
export default class App extends React.Component {
  render() {
    return <Main />;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

// import React from 'react';
// import Main from './app/Main';
// export default class App extends React.Component {
//   render() {
//     return <Main />;
//   }
// }
