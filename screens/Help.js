import React, { useContext } from 'react';
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
  Accordion,
} from 'native-base';
import FirebaseContext from '../services/FirebaseContext';
import { Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';

export default function Help(props) {
  const serviceContext = useContext(FirebaseContext);
  const dataArray = [
    {
      title: 'How to report an issue',
      content:
        'You can send the issue details to the email address oruhelp@gmail.com with the subject starting ISSUE - . Please add as much as information about the issue you are facing(including screenshots if possible). This will help to resolve the issue as early as possible.',
    },
    {
      title: 'Add a feature',
      content:
        'You can send the feature request to the email address oruhelp@gmail.com with the subject starting FEATURE - . Based on the priority and complexity requested feature will be implemented.',
    },
    {
      title: 'Can I update the Receipt details',
      content:
        'No, you can only change the sender details and organization details through the Profile page. However, the older generated https://oru.li short URL will still have the old details.',
    },
    {
      title: 'Can I add multiple Organization',
      content:
        'No, currently it is not supported. Based on the priority it may be implemented later.',
    },
    {
      title: 'Where the receipt and donar details saved',
      content:
        'It will be saved in your mobile phone only. All the details may lose if the phone is not usable or the storage file is corrupted.',
    },
    {
      title: 'Can I backup the data online',
      content:
        'No, this feature is not yet implemented. Based on the priority this feature may be implemented later.',
    },
    {
      title: 'Can I use same account in multiple devices',
      content:
        'No, this is not advisable as the data will not synchronous across devices.',
    },
    {
      title: 'Can I financially contribute to this project',
      content:
        'Yes, please write to oruhelp@gmail.com with the subject starting with DONATE - .',
    },
    {
      title: 'What is the tech stack for this application',
      content:
        'For front-end React Native with Expo is used. For back-end Google Firebase is used.',
    },
    {
      title: 'Is OruHelp a registered company',
      content:
        'No, this is just a brand name as of now. It is being maintained by an single individual. Please read About page for more details.',
    },
  ];
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Help</Title>
        </Body>
        <Right />
      </Header>
      <Content padder>
        <Accordion
          dataArray={dataArray}
          contentStyle={{ backgroundColor: '#fff' }}
        />
      </Content>
    </Container>
  );
}
