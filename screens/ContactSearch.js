import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { FAB, Avatar } from 'react-native-paper';
import {
  Container,
  Header,
  Title,
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

export default function ContactSearch(props) {
  const [filteredContacts, setFilteredContacts] = useState(
    props.location.state.contacts.slice(0, 100)
  );

  const onSearch = val => {
    setFilteredContacts(
      props.location.state.contacts.filter(contact =>
        contact.name.toLowerCase().includes(val.toLowerCase())
      )
    );
  };
  const onContactSelect = contact => {
    console.log("Selected Contact->",contact);
    props.history.push({
      pathname: '/adddonar',
      state: { contact: contact },
    });
  };
  return (
    <Container>
      <Header searchBar rounded>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="close" />
          </Button>
        </Left>
        <Item>
          <Icon name="ios-search" />
          <Input placeholder="Search" onChangeText={val => onSearch(val)} />
          <Icon name="ios-people" />
        </Item>
        <Button transparent>
          <Text>Search</Text>
        </Button>
      </Header>
      <Content>
        <List>
          {filteredContacts.map(contact => (
            <ListItem key={contact.id} onPress={() => onContactSelect(contact)}>
              <Body>
                <Text>{contact.name}</Text>
                <Text note>Trust Name</Text>
              </Body>
            </ListItem>
          ))}
        </List>
      </Content>
    </Container>
  );
}
