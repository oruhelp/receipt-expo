import React, { useState, useEffect, useContext } from 'react';
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
import FirebaseContext from '../services/FirebaseContext';

export default function Receipts(props) {
  const serviceContext = useContext(FirebaseContext);
  const [receipts, setReceipts] = useState([]);

  useEffect(() => {
    serviceContext.database.getReceipts().then(_receiptsData => {
      serviceContext.database.getDonars().then(_donarsData => {
        let _receipts = [];
        const _donars = _donarsData.rows._array;
        _receiptsData.rows._array.map(_receipt => {
          const _donarDetails =
            _donars.filter(_donar => _donar.id == _receipt.donarId).length > 0
              ? _donars.filter(_donar => _donar.id == _receipt.donarId)[0]
              : null;
          _receipts.push({
            ..._receipt,
            name: _donarDetails && _donarDetails.name,
            donarDetails: _donarDetails,
          });
        });
        setReceipts(
          _receipts.sort(function(a, b) {
            return new Date(b.dateTime) - new Date(a.dateTime);
          })
        );
      });
    });
  }, []);

  return (
    <List>
      {receipts && receipts.length > 0 ? (
        receipts.map(receipt => (
          <ListItem
            key={receipt.id}
            onPress={() =>
              props.history.push({
                pathname: '/receipt',
                state: { receipt: receipt },
              })
            }>
            <Body>
              <Text>{receipt.name}</Text>
              <Text note>{'Rs.' + receipt.amount + '/-'}</Text>
            </Body>
            <Right>
              <Text note>
                {new Date(receipt.dateTime).toLocaleDateString()}
              </Text>
            </Right>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <Text>No Data</Text>
        </ListItem>
      )}
    </List>
  );
}
