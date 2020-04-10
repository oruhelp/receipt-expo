import React, { Component, useState, useContext, useEffect } from 'react';
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
  const [receipt, setReceipt] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const serviceContext = useContext(FirebaseContext);

  useEffect(() => {
    console.log('Share receipt constructor', props.location.state.receipt);
    if (
      props.location.state &&
      props.location.state.receipt &&
      receipt == null
    ) {
      setReceipt(props.location.state.receipt);
    }
  }, []);

  const generateLink = () => {
    setLoading(true);
    if (loading) {
      return;
    }
    fetch('https://oru.li/api/shorturl/receipt', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receipt),
    })
      .then(response => response.json())
      .then(responseJson => {
        const _shortUrl = 'https://oru.li/' + responseJson.alias;
        serviceContext.database
          .updateshortUrlOfReceipt(receipt.donation.id, _shortUrl)
          .then(() => {
            setReceipt({
              ...receipt,
              donation: { ...receipt.donation, shortUrl: _shortUrl },
            });
            setLoading(false);
          })
          .catch(err => {
            setReceipt({
              ...receipt,
              donation: { ...receipt.donation, shortUrl: _shortUrl },
            });
            setLoading(false);
            serviceContext.setSnackMessage('Short URL generated but not saved');
          });
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };
  const copyReceiptUrl = async () => {
    await Clipboard.setString(receipt.donation.shortUrl);
    serviceContext.setSnackMessage('Short URL copied to clipboard');
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
    const ENTER = '%0A';
    const SPACE = '%20';
    if (receipt && receipt.receiver && receipt.donation) {
      let _message = `Dear${SPACE}${
        receipt.receiver.name
      },${ENTER}Received${SPACE}your${SPACE}donation${SPACE}of${SPACE}Rs:${
        receipt.donation.amount
      }/-${SPACE}for${SPACE}"${
        receipt.donation.description
      }"${SPACE}on${SPACE}${new Date(
        receipt.donation.date
      ).toLocaleDateString()}.${ENTER}Receipt${SPACE}Number:${SPACE}${
        receipt.donation.id
      }${ENTER}Receipt:${SPACE}${receipt.donation.shortUrl}${ENTER}${ENTER}${
        receipt.donation.footer
      }`;
      Linking.openURL(
        'http://api.whatsapp.com/send?phone=' +
          receipt.receiver.phoneNumber +
          '&text=' +
          _message
      );
    }
  };

  const sendAsSMS = () => {
    if (receipt && receipt.receiver && receipt.donation) {
      let _message = `Dear ${
        receipt.receiver.name
      },\nReceived your donation of Rs:${receipt.donation.amount}/- for "${
        receipt.donation.description
      }" on ${new Date(
        receipt.donation.date
      ).toLocaleDateString()}.\nReceipt Number: ${
        receipt.donation.id
      }\nReceipt: ${receipt.donation.shortUrl}\n\n${receipt.donation.footer}`;
      Linking.openURL(
        'sms:' + receipt.receiver.phoneNumber + '?body=' + _message
      );
    }
  };

  const sendAsMail = () => {
    if (receipt && receipt.receiver && receipt.donation) {
      let _message = `Dear ${
        receipt.receiver.name
      },\nReceived your donation of Rs:${receipt.donation.amount}/- for "${
        receipt.donation.description
      }" on ${new Date(
        receipt.donation.date
      ).toLocaleDateString()}.\nReceipt Number: ${
        receipt.donation.id
      }\nReceipt: ${receipt.donation.shortUrl}\n\n${receipt.donation.footer}`;

      MailComposer.composeAsync({
        recipients: [receipt.receiver.email],
        subject:
          receipt.receiver.name +
          ' Donation Receipt Rs:' +
          receipt.donation.amount +
          '/-',
        body: _message,
      });
    }
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
          onPress={() =>
            receipt && receipt.donation && receipt.donation.shortUrl
              ? copyReceiptUrl()
              : generateLink()
          }>
          <Text
            uppercase={
              loading
                ? false
                : !(receipt && receipt.donation && receipt.donation.shortUrl)
            }>
            {loading
              ? 'Loading...'
              : receipt && receipt.donation && receipt.donation.shortUrl
              ? receipt.donation.shortUrl
              : 'Generate receipt link'}
          </Text>
        </Button>
        {receipt && receipt.donation && receipt.donation.shortUrl && (
          <Button
            primary
            bordered
            style={styles.button}
            onPress={() => generateLink()}>
            <Text uppercase={!loading}>
              {loading ? 'Loading...' : 'Generate new receipt link'}
            </Text>
          </Button>
        )}

        <Button
          primary
          disabled={!(receipt && receipt.donation && receipt.donation.shortUrl)}
          bordered
          style={styles.button}
          onPress={() => sendThroughWhatsapp()}>
          <Text> Send through WhatsApp </Text>
        </Button>
        <Button
          primary
          disabled={!(receipt && receipt.donation && receipt.donation.shortUrl)}
          bordered
          style={styles.button}
          onPress={() => sendAsSMS()}>
          <Text> Send as SMS </Text>
        </Button>
        <Button
          primary
          disabled={!(receipt && receipt.donation && receipt.donation.shortUrl)}
          bordered
          style={styles.button}
          onPress={() => sendAsMail()}>
          <Text> Send as Mail </Text>
        </Button>
      </Content>
    </Container>
  );
}
