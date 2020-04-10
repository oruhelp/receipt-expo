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
import FirebaseContext from '../services/FirebaseContext';

export default function Receipt(props) {
  const serviceContext = useContext(FirebaseContext);
  const [receipt, setReceipt] = useState();
  const showPreview = () => {
    props.history.push({
      pathname: '/preview',
      state: { receipt: receipt },
    });
  };

  useEffect(() => {
    if (
      props.location &&
      props.location.state &&
      props.location.state.receipt
    ) {
      const _value = {
        sender: { ...props.location.state.receipt.sender },
        org: { ...props.location.state.receipt.org },
        receiver: {
          name: props.location.state.receipt.donarDetails.name,
          phoneNumber: props.location.state.receipt.donarDetails.number,
          email: props.location.state.receipt.donarDetails.email,
        },
        donation: {
          id: props.location.state.receipt.number,
          amount: props.location.state.receipt.amount,
          date: new Date(
            props.location.state.receipt.dateTime
          ).toLocaleDateString(),
          description: props.location.state.receipt.notes,
          footer: props.location.state.receipt.footer,
          shortUrl: props.location.state.receipt.shortUrl,
        },
      };
      setReceipt(_value);
    }
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
            <Label>Invoice Number</Label>
            <Input
              value={receipt && receipt.donation.id.toString()}
              editable={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Date</Label>
            <Input
              value={new Date(
                receipt && receipt.donation.dateTime
              ).toLocaleDateString()}
              editable={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Donar</Label>
            <Input value={receipt && receipt.receiver.name} editable={false} />
          </Item>
          <Item stackedLabel>
            <Label>Amount</Label>
            <Input
              value={receipt && receipt.donation.amount}
              editable={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Description</Label>
            <Input
              value={receipt && receipt.donation.description}
              editable={false}
            />
          </Item>
          <Item stackedLabel>
            <Label>Footer</Label>
            <Input
              value={receipt && receipt.donation.footer}
              editable={false}
            />
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
          <Button
            full
            onPress={() => {
              shareReceipt();
            }}>
            <Title>Share</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
