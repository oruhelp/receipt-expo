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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    serviceContext.database
      .getReceipts()
      .then(_receiptsData => {
        serviceContext.database
          .getDonars()
          .then(_donarsData => {
            let _receipts = [];
            const _donars = _donarsData.rows._array;
            _receiptsData.rows._array.map(_receipt => {
              const _donarDetails =
                _donars.filter(_donar => _donar.id == _receipt.donarId).length >
                0
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
            setLoading(false);
          })
          .catch(() => setLoading(false));
      })
      .catch(() => setLoading(false));
  }, []);

  return loading ? (
    <View
      style={{
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text />
    </View>
  ) : receipts && receipts.length > 0 ? (
    <List>
      {receipts.map(receipt => (
        <ListItem
          key={receipt.id}
          onPress={() =>
            props.history.push({
              pathname: '/receipt',
              state: {
                receipt: {
                  ...receipt,
                  sender: { ...props.orgDetails.sender },
                  org: { ...props.orgDetails.org },
                },
              },
            })
          }>
          <Body>
            <Text>{receipt.name}</Text>
            <Text note>{'Rs.' + receipt.amount + '/-'}</Text>
          </Body>
          <Right>
            <Text note>{new Date(receipt.dateTime).toLocaleDateString()}</Text>
          </Right>
        </ListItem>
      ))}
    </List>
  ) : (
    <View
      style={{
        flex: 1,
        marginTop: 50,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{ fontSize: 20, color: serviceContext.theme.colors.primary }}>
        No Receipts
      </Text>
    </View>
  );
}
