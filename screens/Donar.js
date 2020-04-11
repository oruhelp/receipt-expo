import React, { Component, useState, useEffect, useContext } from "react";
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
  ActionSheet,
} from "native-base";
import { Caption, Subheading, Divider } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Overlay } from "react-native-elements";
import Constants from "expo-constants";
import { openDatabase } from "expo-sqlite";
import { NativeRouter, Route, Link } from "react-router-native";
import FirebaseContext from "../services/FirebaseContext";

export default function Donar(props) {
  const [contact, setContact] = useState(null);
  const [donations, setDonations] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const serviceContext = useContext(FirebaseContext);
  useEffect(() => {
    if (props.location.state && props.location.state.donar) {
      setContact(props.location.state.donar);
      serviceContext.database
        .getReceiptsOfDonar(props.location.state.donar.id)
        .then((_receiptsData) => setDonations(_receiptsData.rows._array));
    }
  }, []);

  const deleteDonar = () => {
    serviceContext.database
      .deleteDonar(contact.id)
      .then(() => props.history.push("/dashboard/donars"))
      .catch((err) => console.log("Error deleting Donar", err));
  };
  return (
    <Container>
      <Overlay isVisible={openMenu} onBackdropPress={() => setOpenMenu(false)}>
        <List>
          <ListItem onPress={() => deleteDonar()}>
            <Button transparent>
              <Text onPress={() => deleteDonar()}>Delete</Text>
            </Button>
          </ListItem>
        </List>
      </Overlay>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>{contact && contact.name}</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph} enableOnAndroid>
        <View style={styles.elements}>
          <Caption>Name</Caption>
          <Subheading>{contact && contact.name}</Subheading>
        </View>
        {contact && contact.number != "" && (
          <View style={styles.elements}>
            <Caption>Number</Caption>
            <Subheading>{contact && contact.number}</Subheading>
          </View>
        )}
        {contact && contact.email != "" && (
          <View style={styles.elements}>
            <Caption>Email</Caption>
            <Subheading>{contact && contact.email}</Subheading>
          </View>
        )}
        {contact && contact.website != "" && (
          <View style={styles.elements}>
            <Caption>Website</Caption>
            <Subheading>{contact && contact.website}</Subheading>
          </View>
        )}
        <Divider style={styles.divider} />
        <List>
          {donations && donations.length > 0 && (
            <ListItem itemHeader style={{ paddingBottom: 0, paddingTop: 20 }}>
              <Body style={{ alignItems: "center" }}>
                <Text note>Donation History</Text>
              </Body>
            </ListItem>
          )}
          {donations &&
            donations.length > 0 &&
            donations.map((donation) => (
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
