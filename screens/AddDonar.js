import React, { Component, useState, useContext } from 'react';
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Left,
  Right,
  Body,
  Icon,
  Text,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
import { Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import * as Contacts from 'expo-contacts';
import FirebaseContext from '../services/FirebaseContext';
import { openDatabase } from 'expo-sqlite';

export default function AddDonar(props) {
  const db = openDatabase('db');
  const serviceContext = useContext(FirebaseContext);

  db.transaction(tx => {
    tx.executeSql(
      'create table if not exists donars (id integer primary key not null, fname text, lname text, orgname text);'
    );
  });

  const [contact, setContact] = useState(
    props.location.state &&
      props.location.state.contact &&
      props.location.state.contact
  );
  const addDonar = () => {
    if (contact) {
      db.transaction(
        tx => {
          tx.executeSql(
            'insert into donars (id, fname, lname) values (?, ?, ?)',
            [contact.id, contact.firstName, contact.lastName],
            (_, { rows }) => {
              props.history.push('/dashboard/donars');
            },
            (_, error) => {
              console.log(error);
            }
          );
        },
        null,
        this.update
      );
    }
  };
  const importFromContacts = () => {
    if (serviceContext.contacts != null) {
      if (serviceContext.contacts.length > 0) {
        props.history.push({
          pathname: '/contactsearch',
          state: { contacts: serviceContext.contacts },
        });
      }
    } else {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.PHONE_NUMBERS,
              Contacts.Fields.Emails,
              Contacts.Fields.UrlAddresses,
            ],
          });

          if (data.length > 0) {
            props.history.push({
              pathname: '/contactsearch',
              state: { contacts: data },
            });
          }
        }
      })();
    }
  };
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="close" />
          </Button>
        </Left>
        <Body>
          <Title>Add Donar</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Button
          bordered
          small
          full
          rounded
          onPress={() => importFromContacts()}>
          <Text>Import from contacts</Text>
        </Button>
        <Form>
          {contact && (
            <Item floatingLabel>
              <Label>Name</Label>
              <Input value={contact && contact.name} />
            </Item>
          )}
          {contact &&
            contact.phoneNumbers &&
            contact.phoneNumbers.length > 0 &&
            contact.phoneNumbers.map(phoneNumber => (
              <Item floatingLabel last>
                <Label>{phoneNumber.label}</Label>
                <Input value={phoneNumber.number} />
              </Item>
            ))}
          {contact &&
            contact.emails &&
            contact.emails.length > 0 &&
            contact.emails.map(email => (
              <Item floatingLabel last>
                <Label>{email.label}</Label>
                <Input value={email.email} />
              </Item>
            ))}
          {contact &&
            contact.urlAddresses &&
            contact.urlAddresses.length > 0 &&
            contact.urlAddresses.map(urlAddress => (
              <Item floatingLabel last>
                <Label>{urlAddress.label}</Label>
                <Input value={urlAddress.url} />
              </Item>
            ))}
        </Form>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => addDonar()}>
            <Title>Add Donar</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 10,
  },
});
