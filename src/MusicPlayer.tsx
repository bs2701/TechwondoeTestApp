import React, {useEffect, useState} from 'react';
import {Platform, View, Text, TouchableOpacity, Image} from 'react-native';
import {CircularProgressBase} from 'react-native-circular-progress-indicator';
import RNFetchBlob from 'react-native-fetch-blob';
import Sound from 'react-native-sound';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Images from './assets';

Sound.setCategory('Playback');

let dirs = RNFetchBlob.fs.dirs;
const MusicPlayer = () => {
  const [soundList, setSoundList] = useState([]);

  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('@sound_list', value);
    } catch (e) {
      // saving error
    }
  };
  const data = [
    {
      icon: 'image1',
      downloaded: false,
      soundLink:
        'https://filesamples.com/samples/audio/mp3/Symphony%20No.6%20(1st%20movement).mp3',
      name: 'sadness.mp3',
      progress: 0,
    },
    {
      icon: 'image2',
      downloaded: false,
      soundLink: 'https://filesamples.com/samples/audio/mp3/sample4.mp3',
      name: 'Waves.mp3',
      progress: 0,
    },
    {
      icon: 'image3',
      downloaded: false,
      soundLink: 'https://filesamples.com/samples/audio/mp3/sample2.mp3',
      name: 'soft-rain.mp3',
      progress: 0,
    },
    {
      icon: 'image4',
      downloaded: false,
      soundLink: 'https://filesamples.com/samples/audio/mp3/sample1.mp3',
      name: 'belarussian.mp3',
      progress: 0,
    },
  ];

  useEffect(() => {
    getData().then(res => {
      setSoundList(res);
    });
  }, []);

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@sound_list');
      if (value !== null) {
        return JSON.parse(value);
        // value previously stored
      }
    } catch (e) {
      // error reading value
    }
  };

  const callSound = (path: string) => {
    var whoosh = new Sound(
      path,
      Platform.OS === 'ios' ? '' : Sound.DOCUMENT,
      error => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        // Play the sound with an onEnd callback
        whoosh.play(success => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors');
          }
        });
      },
    );
  };

  const onPressBtn = async (item: any, index: number) => {
    const {soundLink, downloaded, name, type} = item;
    let totalSize = 0;
    const fileConfig = {
      fileCache: true,
      filename: name,
      type,
      appendExt: 'mp3',
      path: dirs.DocumentDir + `/${name}`,
      indicator: true,
      overwrite: true,
      notification: true,
    };
    if (!downloaded) {
      RNFetchBlob.fs
        .stat(fileConfig.path)
        .then(stats => {
          totalSize = stats.size;
        })
        .catch(err => {
          //err
        });
      RNFetchBlob.config(fileConfig)
        .fetch('GET', soundLink)
        .progress((received: number, total: number) => {
          const progress = (received * 100) / totalSize; //(received * 100) / total;
          soundList[index]['progress'] = progress;
          setSoundList([...soundList]);
          callSound(fileConfig.path);
        })
        .then((res: any) => {
          // the temp file path
          soundList[index]['progress'] = 100;
          setSoundList([...soundList]);
        });
    } else {
      callSound(fileConfig.path);
    }
  };

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          alignItems: 'flex-end',
          flex: 1,
          flexDirection: 'row',
          backgroundColor: '#3D5CEC',
        }}>
        {soundList.map((item, index) => {
          const {downloaded, progress, icon} = item;
          return (
            <TouchableOpacity
              onPress={() => onPressBtn(item, index)}
              key={'sound' + index}
              style={{
                alignItems: 'center',
                flex: 1,
                flexDirection: 'column',
              }}>
              <CircularProgressBase
                circleBackgroundColor={downloaded ? 'white' : 'transparent'}
                radius={40}
                activeStrokeWidth={5}
                value={progress}
                activeStrokeColor={downloaded ? 'white' : 'red'}
                onAnimationComplete={() => {
                  if (soundList[index]['progress'] === 100) {
                    soundList[index]['downloaded'] = true;
                    setSoundList([...soundList]);
                    storeData(JSON.stringify(soundList));
                  }
                }}
                inActiveStrokeColor={'transparent'}>
                <Image
                  resizeMode="contain"
                  source={downloaded ? Images[icon + 'w'] : Images[icon]}
                  style={{height: 40, width: 40}}
                />
              </CircularProgressBase>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default MusicPlayer;
