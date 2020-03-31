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
import { NativeRouter, Route, Link } from 'react-router-native';

export default function Donars(props) {
  const [donars, setDonars] = useState([]);
  const db = openDatabase('db');

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists donars (id integer primary key not null, fname text, lname text, orgname text);'
      );
    });

    db.transaction(
      tx => {
        tx.executeSql('select * from donars', [], (_, { rows }) => {
          setDonars(rows._array);
        });
      },
      null,
      this.update
    );
  }, []);

  return (
    <List>
      {donars &&
        donars.length > 0 &&
        donars.map(donar => {
          return (
            <ListItem
              key={donar.id}
              onPress={() =>
                props.history.push({
                  pathname: '/donar',
                  state: { id: donar.id },
                })
              }>
              <Body>
                <Text>
                  {(donar.fname != null ? donar.fname : '') +
                    ' ' +
                    (donar.lname != null ? donar.lname : '')}
                </Text>
                {donar.orgname != null && <Text note>{donar.orgname}</Text>}
              </Body>
            </ListItem>
          );
        })}
    </List>
  );
}
