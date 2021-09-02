/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text} from 'react-native';
import MessageItem from './MessageItem';

const MessageList = ({data}) => {
  return (
    <View>
      <Text>All Text Messages from user phone: {data.length}</Text>
      {data.map((message, i) => {
        return (
          <MessageItem
            key={i}
            date={message.date}
            person={message.person}
            body={message.body}
          />
        );
      })}
    </View>
  );
};

export default MessageList;
