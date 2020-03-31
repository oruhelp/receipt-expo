import React, { useContext } from 'react';
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
import { template1 } from '../constants/templates';

export default function Preview(props) {
  const serviceContext = useContext(FirebaseContext);
  const data = {
    sender: {
      name: 'Karthikeyan',
      role: 'Volunteer',
      phoneNumber: '+91-7708662218',
      email: 'karthikeyan@gmail.com',
    },
    approver: {
      name: 'Surya Kumar',
      role: 'President',
      phoneNumber: '+91-1234567890',
      email: 'suryakmr@gmail.com',
    },
    receiver: {
      name: 'Guru',
      phoneNumber: '+91-9659657101',
      email: 'rajfml@gmail.com',
    },
    org: {
      name: 'Aarathy Charitable Trust',
      addressLine1: '10, VGP Santhi Nagar',
      addressLine2: 'Pallikaranai, Chennai',
      countryAndPincode: 'India, 600100',
      phoneNumber: '+91-0987654321',
      email: 'info@aarathy.org',
      website: 'www.aarathy.org',
    },
    donation: {
      id: '23423243',
      amount: '1000',
      date: '18/Mar/2020',
      description: 'This is donated for student education',
      footer: 'From PostMan',
    },
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
          <Title>Preview Receipt</Title>
        </Body>
        <Right />
      </Header>
      <WebView
        originWhitelist={['*']}
        javaScriptEnabled
        source={{
          html: template1.replace('___###input###___', JSON.stringify(data)),
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
            onPress={() => props.history.goBack()}>
            <Title>Save Draft</Title>
          </Button>
        </FooterTab>
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
            onPress={() => props.history.goBack()}>
            <Title>Share</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
