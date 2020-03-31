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
  DatePicker,
} from 'native-base';
import { Overlay } from 'react-native-elements';
import { Paragraph } from 'react-native-paper';
import { List, ListItem, Thumbnail } from 'native-base';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import { openDatabase } from 'expo-sqlite';
import FirebaseContext from '../services/FirebaseContext';

export default function Receipt(props) {
  const db = openDatabase('db');
  const serviceContext = useContext(FirebaseContext);
  const [receipt, setReceipt] = useState({
    title: '',
    id: '',
    dateTime: '',
    donarId: '',
    donarName: '',
    amount: '',
    notes: '',
    footer: '',
  });
  const showPreview = () => {};

  useEffect(() => {
    const receiptId =
      props.location && props.location.state && props.location.state.id;
    db.transaction(
      tx => {
        tx.executeSql(
          `select * from receipt where id = ${receiptId}`,
          [],
          (_, { rows }) => {
            setReceipt(rows._array[0]);
            console.log(rows._array);
          },
          err => console.log(err)
        );
      },
      null,
      this.update
    );
  }, []);

  const shareReceipt = () => {
    props.history.push({
      pathname: '/sharereceipt',
      state: { receipt: receipt },
    });
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
          <Title>Receipt</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <Form>
          <Item stackedLabel>
            <Label>Invoice Title</Label>
            <Input value={receipt.title} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Invoice Number</Label>
            <Input value={receipt.id.toString()} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Date</Label>
            <Input
              value={new Date(receipt.dateTime).toLocaleDateString()}
              editable={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Donar</Label>
            <Input value={receipt.donarName} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Amount</Label>
            <Input value={receipt.amount} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Notes</Label>
            <Input value={receipt.notes} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Footer</Label>
            <Input value={receipt.footer} editable={false} />
          </Item>
        </Form>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => showPreview()}>
            <Title>Preview</Title>
          </Button>
        </FooterTab>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => shareReceipt()}>
            <Title>Share</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
