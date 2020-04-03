import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import { TextInput } from 'react-native';
import {
  Container,
  Header,
  DeckSwiper,
  Card,
  Button,
  CardItem,
  Thumbnail,
  Left,
  Body,
  Icon,
  Footer,
  Right,
  Content,
  FooterTab,
  Title,
} from 'native-base';
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { templates , getCompletedHtml} from '../constants/templates/index';

export default function Template(props) {
  const serviceContext = useContext(FirebaseContext);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [orgDetails, setOrgDetails] = useState();
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

  const styles = StyleSheet.create({
    surface: {
      margin: 8,
      height: 90,
      width: 90,
      backgroundColor: serviceContext.theme.colors.xprimary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    surfaceSelected: {
      margin: 8,
      height: 90,
      width: 90,
      backgroundColor: serviceContext.theme.colors.xprimary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      borderColor: serviceContext.theme.colors.primary,
      borderWidth: 2,
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
          <Title>Template</Title>
        </Body>
        <Right />
      </Header>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <WebView
          style={styles.list}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          source={{
            html: getCompletedHtml(activeTemplate.html, data),
          }}
        />
        <View>
          <FlatList
            horizontal
            data={templates}
            renderItem={({ item: rowData }) => {
              return (
                <Button
                  style={
                    activeTemplate.id == rowData.id
                      ? styles.surfaceSelected
                      : styles.surface
                  }
                  onPress={() => setActiveTemplate(rowData)}>
                  <Text>{rowData.name}</Text>
                </Button>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
      <Footer>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button
            full
            onPress={() =>
              props.history.push({
                pathname: '/templatelogo',
                state: { orgDetails: orgDetails },
              })
            }>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button full onPress={() => props.history.push('/templatecolor')}>
            <Title>Next</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
