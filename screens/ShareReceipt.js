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
  Item,
  Label,
  Input,
  Toast,
} from 'native-base';
import { Paragraph, Snackbar } from 'react-native-paper';
import { StyleSheet, Linking, Clipboard } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import * as FileSystem from 'expo-file-system';
import FirebaseContext from '../services/FirebaseContext';
import * as MailComposer from 'expo-mail-composer';
import * as SMS from 'expo-sms';
import Expo from 'expo';

export default function ShareReceipt(props) {
  const [shortUrl, setShortUrl] = useState('');
  const serviceContext = useContext(FirebaseContext);
  const [snackMessage, setSnackMessage] = useState('');
  const generateLink = () => {
    const receiptData = {
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
        name: props.location.state.receipt.donarName,
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
        id: props.location.state.receipt.id,
        amount: props.location.state.receipt.amount,
        date: props.location.state.receipt.dateTime,
        description: props.location.state.receipt.notes,
        footer: props.location.state.receipt.footer,
      },
    };
    fetch('https://oru.li/api/shorturl/receipt', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData),
    })
      .then(response => response.json())
      .then(responseJson => {
        setShortUrl('https://oru.li/' + responseJson.alias);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const copyReceiptUrl = async () => {
    await Clipboard.setString(shortUrl);
    setSnackMessage('Receipt URL copied to clipboard!');
  };

  const saveAsPdf = () => {
    FileSystem.downloadAsync(
      'http://gahp.net/wp-content/uploads/2017/09/sample.pdf',
      FileSystem.documentDirectory + 'small.pdf'
    )
      .then(({ uri }) => {
        console.log('Finished downloading to ', uri);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const sendThroughWhatsapp = async () => {
    Linking.openURL(
      'http://api.whatsapp.com/send?phone=917708662218&text=Thank%20you%20for%20your%20contribution%2E%0A' +
        shortUrl
    );
  };

  const sendAsSMS = () => {
    Linking.openURL('sms:7708662218?body=' + shortUrl);
  };

  const sendAsMail = () => {
    FileSystem.downloadAsync(
      'http://gahp.net/wp-content/uploads/2017/09/sample.pdf',
      FileSystem.documentDirectory + 'small.pdf'
    )
      .then(({ uri }) => {
        MailComposer.composeAsync({
          recipients: ['ckind90@gmail.com'],
          ccRecipients: ['owner@trust.com'],
          subject: 'Test mail with some attachment',
          body: 'Some body text over here',
          attachments: [uri],
        });
      })
      .catch(error => {
        console.error(error);
      });
  };

  const styles = StyleSheet.create({
    paragraph: {
      margin: 10,
    },
    button: {
      margin: 5,
      justifyContent: 'center',
    },
  });

  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Share Receipt</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Button
          primary
          bordered
          style={styles.button}
          onPress={() => (shortUrl == '' ? generateLink() : copyReceiptUrl())}>
          <Text uppercase={shortUrl == ''}>
            {shortUrl == '' ? 'Generate receipt link' : shortUrl}
          </Text>
        </Button>
        <Button
          primary
          disabled={shortUrl == ''}
          bordered
          style={styles.button}
          onPress={() => sendThroughWhatsapp()}>
          <Text> Send through WhatsApp </Text>
        </Button>
        <Button
          primary
          disabled={shortUrl == ''}
          bordered
          style={styles.button}
          onPress={() => sendAsSMS()}>
          <Text> Send as SMS </Text>
        </Button>
        <Button
          primary
          disabled={shortUrl == ''}
          bordered
          style={styles.button}
          onPress={() => sendAsMail()}>
          <Text> Send as Mail </Text>
        </Button>
      </Content>
      <Snackbar
        visible={snackMessage != ''}
        duration={Snackbar.DURATION_SHORT}
        onDismiss={() => setSnackMessage('')}
        action={{
          label: 'Okay',
          onPress: () => setSnackMessage(''),
        }}>
        {snackMessage}
      </Snackbar>
    </Container>
  );
}
