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
  const [userDetails, setUserDetails] = useState();
  const [receiptDetails, setReceiptDetails] = useState();
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

  useEffect(() => {
    console.log('Preview constructor - ', props.location.state);
    serviceContext.database
      .getActiveOrg()
      .then(res => {
        const _detailsFromDB = res.rows._array[0];
        console.log('Details from DB', _detailsFromDB);
        const _value = {
          ...receiptDetails,
          sender: {
            name: _detailsFromDB.senderName,
            role: _detailsFromDB.role,
            phoneNumber: _detailsFromDB.senderPhoneNumber,
            email: _detailsFromDB.senderEmail,
          },
          receiver: { ...props.location.state.receipt.receiver },
          org: {
            name: _detailsFromDB.name,
            addressLine1: _detailsFromDB.addressLine1,
            addressLine2: _detailsFromDB.addressLine2,
            countryAndPincode:
              _detailsFromDB.registeredCountry + ',' + _detailsFromDB.pincode,
            phoneNumber: _detailsFromDB.phoneNumber,
            email: _detailsFromDB.email,
            website: _detailsFromDB.website,
          },
          donation: { ...props.location.state.receipt.donation },
        };
        console.log('Preview with the details -> ', _value);
        setReceiptDetails(_value);
      })
      .catch(err => console.log('OHR1245 - ', err));

    // !userDetails &&
    //   serviceContext.service.db
    //     .ref('/users/' + serviceContext.userName + '/profile/')
    //     .once('value')
    //     .then(function(snapshot) {
    //       setReceiptDetails({
    //         ...receiptDetails,
    //         sender: { ...receiptDetails.sender, ...snapshot },
    //       });
    //     });
  }, []);
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
          html: receiptDetails
            ? getCompletedHtml(templates[0].html, receiptDetails)
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
            onPress={() => props.history.goBack()}>
            <Title>Share</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
