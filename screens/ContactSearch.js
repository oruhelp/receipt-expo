import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { Modal, Portal, Provider } from 'react-native-paper';
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
  Spinner,
  Text,
} from 'native-base';
import { List, ListItem, Left, Body, Right, Thumbnail } from 'native-base';
import { View } from 'react-native';
import Constants from 'expo-constants';
import Drawer from 'react-native-drawer';
import FirebaseContext from '../services/FirebaseContext';

export default function ContactSearch(props) {
  const serviceContext = useContext(FirebaseContext);
  const [filteredContacts, setFilteredContacts] = useState(
    props.location.state.contacts.slice(0, 100)
  );
  const [searching, setSearching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const onSearch = () => {
    setSearching(true);
    if (searchValue != '') {
      setFilteredContacts(
        props.location.state.contacts.filter(contact =>
          contact.name.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
    setSearching(false);
  };
  const onContactSelect = contact => {
    props.history.push({
      pathname: '/adddonar',
      state: { contact: contact },
    });
  };
  return (
    <Container>
      <Header
        searchBar
        rounded
        style={{
          backgroundColor: serviceContext.theme.colors.primary,
        }}>
        <Item>
          <Icon name="ios-people" />
          <Input
            placeholder="Search"
            onChangeText={val => setSearchValue(val)}
            onSubmitEditing={() => onSearch()}
          />
          {searching ? (
            <Spinner color={serviceContext.theme.colors.primary} padding={20} />
          ) : (
            <Icon name="ios-search" onPress={() => onSearch()} />
          )}
        </Item>
      </Header>
      <Content enableOnAndroid>
        {searching && (
          <Provider>
            <Portal>
              <Modal visible dismissable={false}>
                <Text>Loading...</Text>
              </Modal>
            </Portal>
          </Provider>
        )}
        <List>
          {filteredContacts.map(contact => (
            <ListItem key={contact.id} onPress={() => onContactSelect(contact)}>
              <Body>
                <Text>{contact.name}</Text>
                {contact &&
                  contact.phoneNumbers &&
                  contact.phoneNumbers.length > 0 && (
                    <Text note>
                      {contact.phoneNumbers[0].number}
                      {contact.phoneNumbers.length > 1 &&
                        ' (+' +
                          (contact.phoneNumbers.length - 1).toString() +
                          ' phone numbers)'}
                    </Text>
                  )}
                {contact && contact.emails && contact.emails.length > 0 && (
                  <Text note>
                    {contact.emails[0].email}
                    {contact.emails.length > 1 &&
                      ' (+' +
                        (contact.emails.length - 1).toString() +
                        ' emails)'}
                  </Text>
                )}
              </Body>
            </ListItem>
          ))}
          <ListItem
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text note>
              {props.location.state &&
                props.location.state.contacts &&
                props.location.state.contacts.length > 100 &&
                '+' +
                  (props.location.state.contacts.length - 100).toString() +
                  ' Contacts'}
            </Text>
          </ListItem>
        </List>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button
            full
            style={{
              padding: 0,
              backgroundColor: serviceContext.theme.colors.primary,
            }}
            onPress={() => props.history.push('/adddonar')}>
            <Title>Cancel</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
