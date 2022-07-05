/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {SafeAreaView} from 'react-native';
import MusicPlayer from './src/MusicPlayer';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <MusicPlayer />
    </SafeAreaView>
  );
};

export default App;
