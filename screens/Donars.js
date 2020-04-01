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
import { NativeRouter, Route, Link } from 'react-router-native';
import FirebaseContext from '../services/FirebaseContext';

export default function Donars(props) {
  const [donars, setDonars] = useState([]);
  const serviceContext = useContext(FirebaseContext);

  useEffect(() => {
    serviceContext.database.getDonars().then(data => {
      data && data.rows && data.rows._array && setDonars(data.rows._array);
    });
  }, []);

  return (
    <List>
      {donars && donars.length > 0 ? (
        donars.map(donar => {
          return (
            <ListItem
              key={donar.id}
              onPress={() =>
                props.history.push({
                  pathname: '/donar',
                  state: { donar: donar },
                })
              }>
              <Body>
                <Text>{donar.name != null ? donar.name : ''}</Text>
              </Body>
            </ListItem>
          );
        })
      ) : (
        <View
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>No Donars</Text>
        </View>
      )}
    </List>
  );
}
