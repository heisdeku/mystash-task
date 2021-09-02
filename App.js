/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import SmsAndroid from 'react-native-get-sms-android';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MessageList from './src/components/MessageList';
import { configureFakeBackend } from './src/helpers';

const App = () => {

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const [ filter, setFilter ] = useState({
    box: 'inbox',
    minDate: 1554636310165,
    maxDate: Date.now(),
    read: 0,
    indexFrom: 0,
    maxCount: 10,
  });

  const [ messages, setMessages ] = useState([]);
  const [ access, setAccess ] = useState(false);

  const checkPermission = () => {
    check(PERMISSIONS.ANDROID.READ_SMS)
      .then((result) => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log('This feature is not available (on this device / in this context)');
            break;
          case RESULTS.DENIED:
            console.log('The permission has not been requested / is denied but requestable');
            request(PERMISSIONS.ANDROID.READ_SMS)
              .then((answer) => {
                setAccess(true);
            });
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            setAccess(true);
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            setAccess(true);
            break;
        }
      })
  .catch((error) => {
    console.log(error);
  });
  };

  const sendData = async () => {
    const mockBackend = configureFakeBackend();
    const fetchData = async () => {
      const response = mockBackend('https://localhost:8080/messages/add', {
        method: 'POST',
        body: JSON.stringify(messages),
      });
      console.log('response', response);
    };
    Alert.alert('Data sent successfully');
    fetchData();
  };

  //for pagination
  const getPrev = () => {
    if (filter.indexFrom === 0) {
      return Alert.alert(`You've gotten to the beginning`);
    }
    setFilter({
      ...filter,
      indexFrom: filter.indexFrom === 0 ? 0 : filter.indexFrom - 10,
      maxCount: filter.indexFrom === 10 ? 10 : filter.maxCount - 10,
    });
  };

  const getNext = () => {
    setFilter({
      ...filter,
      indexFrom: filter.indexFrom + 10,
      maxCount: filter.maxCount + 10,
    });
  };

  useEffect(() => {
    if (access === true) {
      SmsAndroid.list(
        JSON.stringify(filter),
        fail => {
          console.log('Failed with this error: ' + fail);
        },
        (count, smsList) => {
          console.log('Count: ', count);
          console.log('List: ', smsList);
          setMessages(JSON.parse(smsList));
        });
    };
  }, [access, filter]); //dependency array to run the function inside on change to each

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={'light-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
        contentContainerStyle={styles.sectionContainer}
        >
        <View style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
          <TouchableOpacity onPress={checkPermission} style={styles.highlight}>
            <Text style={{
              textAlign: 'center',
              color: '#FAFAFA',
            }}>Get all your text message</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendData} style={styles.highlight}>
            <Text style={{
              textAlign: 'center',
              color: '#FAFAFA',
            }}>Send scraped text message</Text>
          </TouchableOpacity>
          </View>
          {
            access && messages !== undefined &&
            <View>
              <MessageList data={messages} />
              <View style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row'}}>
                <Text style={styles.highlight} onPress={getPrev}>Previous</Text>
                <Text style={styles.highlight} onPress={getNext}>Next</Text>
              </View>
            </View>
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
    backgroundColor: 'blue',
    height: 45,
    width: 180,
    paddingVertical: 10,
    marginLeft: 10,
    marginBottom: 30,
    color: '#FAFAFA',
    textAlign: 'center',
  },
});

export default App;
