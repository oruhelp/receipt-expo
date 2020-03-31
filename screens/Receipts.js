import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Avatar, Title } from 'react-native-paper';
import {
  Container,
  Header,
  Item,
  Input,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
} from 'native-base';
import { List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import { View } from 'react-native';
import Constants from 'expo-constants';
import Drawer from 'react-native-drawer';
import { openDatabase } from 'expo-sqlite';

export default function Receipts(props) {
  const db = openDatabase('db');
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from receipt',
          [],
          (_, { rows }) => {
            setReceipts(rows._array);
          },
          err => {
            console.log(err);
          }
        );
      },
      null,
      this.update
    );
  }, []);

  return (
    <List>
      {receipts &&
        receipts.length > 0 &&
        receipts.map(receipt => (
          <ListItem
            key={receipt.id}
            onPress={() =>
              props.history.push({
                pathname: '/receipt',
                state: { id: receipt.id },
              })
            }>
            <Body>
              <Text>{receipt.donarName}</Text>
              <Text note>{'Rs.' + receipt.amount + '/-'}</Text>
            </Body>
            <Right>
              <Text note>
                {new Date(receipt.dateTime).toLocaleDateString()}
              </Text>
            </Right>
          </ListItem>
        ))}
    </List>
  );
}
