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
  const [loading, setLoading] = useState(true);
  const serviceContext = useContext(FirebaseContext);

  useEffect(() => {
    serviceContext.database
      .getDonars()
      .then(data => {
        data && data.rows && data.rows._array && setDonars(data.rows._array);
        setLoading(false);
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
  ) : donars && donars.length > 0 ? (
    <List>
      {donars.map(donar => {
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
      })}
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
        No Donars
      </Text>
    </View>
  );
}
