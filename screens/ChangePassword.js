import React, { useContext, useState } from 'react';
import { View, StyleSheet, Image, Alert } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Paragraph, Divider } from 'react-native-paper';
import { Item, Label, Input } from 'native-base';
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
} from 'native-base';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';

import FirebaseContext from '../services/FirebaseContext';

export default function ChangePassword(props) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>About</Title>
        </Body>
        <Right />
      </Header>
      <Content>
        <View style={{ width: '80%' }}>
          <Title>Change Password</Title>
          <Item floatingLabel s>
            <Label>Current Password</Label>
            <Input />
          </Item>
          <Item floatingLabel>
            <Label>New Password</Label>
            <Input />
          </Item>
          <Item floatingLabel>
            <Label>Confirm New Password</Label>
            <Input />
          </Item>
        </View>
      </Content>

      <Footer>
        <FooterTab>
          <Button
            full
            onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Change Password</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
