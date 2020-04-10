import React, { useContext, useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
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
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { templates, getCompletedHtml } from '../constants/templates/index';

export default function Preview(props) {
  const serviceContext = useContext(FirebaseContext);

  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="close" />
          </Button>
        </Left>
        <Body>
          <Title>Preview Receipt</Title>
        </Body>
        <Right />
      </Header>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled
        source={{
          html:
            props.location.state && props.location.state.receipt
              ? getCompletedHtml(
                  templates[0].html,
                  props.location.state.receipt
                )
              : '<h1>Loading<h1>',
        }}
      />
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
            onPress={() =>
              props.history.push({
                pathname: '/sharereceipt',
                state: { receipt: props.location.state.receipt },
              })
            }>
            <Title>Share</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
