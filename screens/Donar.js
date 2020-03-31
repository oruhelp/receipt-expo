import React, { Component, useState, useEffect, useContext } from 'react';
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
  List,
  ListItem,
} from 'native-base';
import { Caption, Subheading, Divider } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { openDatabase } from 'expo-sqlite';
import { NativeRouter, Route, Link } from 'react-router-native';
import FirebaseContext from '../services/FirebaseContext';

export default function Donar(props) {
  const [contact, setContact] = useState(null);
  const [donations, setDonations] = useState(null);

  const serviceContext = useContext(FirebaseContext);
  const db = openDatabase('db');
  useEffect(() => {
    if (
      serviceContext.contacts != null &&
      props.location.state &&
      props.location.state.id
    ) {
      setContact(
        serviceContext.contacts.filter(
          contact => contact.id == props.location.state.id
        )[0]
      );
      db.transaction(
        tx => {
          tx.executeSql(
            `select * from receipt where donarId = ${props.location.state.id}`,
            [],
            (_, { rows }) => {
              setDonations(rows._array);
            }
          );
        },
        null,
        this.update
      );
    }
  }, []);

  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{contact && contact.firstName}</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="md-more" />
          </Button>
        </Right>
      </Header>
      <Content style={styles.paragraph}>
        <View style={styles.elements}>
          <Caption>Name</Caption>
          <Subheading>{contact && contact.name}</Subheading>
        </View>
        {contact &&
          contact.phoneNumbers &&
          contact.phoneNumbers.length > 0 &&
          contact.phoneNumbers.map(phoneNumber => (
            <View style={styles.elements} key={phoneNumber.id}>
              <Caption>{phoneNumber.label}</Caption>
              <Subheading>{phoneNumber.number}</Subheading>
            </View>
          ))}
        {contact &&
          contact.emails &&
          contact.emails.length > 0 &&
          contact.emails.map(email => (
            <View style={styles.elements} key={email.id}>
              <Caption>{email.label}</Caption>
              <Subheading>{email.email}</Subheading>
            </View>
          ))}
        {contact &&
          contact.urlAddresses &&
          contact.urlAddresses.length > 0 &&
          contact.urlAddresses.map(urlAddress => (
            <View style={styles.elements} key={urlAddress.id}>
              <Caption>{urlAddress.label}</Caption>
              <Subheading>{urlAddress.url}</Subheading>
            </View>
          ))}
        <Divider style={styles.divider} />
        <List>
          <ListItem itemHeader style={{ paddingBottom: 0, paddingTop: 20 }}>
            <Body style={{ alignItems: 'center' }}>
              <Text note>Donation History</Text>
            </Body>
          </ListItem>
          {donations &&
            donations.length > 0 &&
            donations.map(donation => (
              <ListItem>
                <Body>
                  <Subheading>Rs.{donation.amount}/-</Subheading>
                </Body>
                <Right>
                  <Text note>
                    {new Date(donation.dateTime).toLocaleDateString()}
                  </Text>
                </Right>
              </ListItem>
            ))}
        </List>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 10,
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
  elements: {
    margin: 5,
  },
});
