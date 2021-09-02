/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';

const MessageItem = ({ date, body, person}) => {
  const convertFromTimestampToReadable = (time) => {
    const milliSeconds = time * 1000;
    const dateInWord = new Date(milliSeconds);
    const dateToString = dateInWord.toLocaleString();
    return dateToString;
  }
  return (
    <TouchableOpacity>
      <View style={styles.container}>
      <Text>From: {person}</Text>
      <Text>Content: {body}</Text>
      <Text>On: {convertFromTimestampToReadable(date)}</Text>
    </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: 'blue',
    marginVertical: 15,
    padding: 10,
  },
});


export default MessageItem;
