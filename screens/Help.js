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
    { title: 'Report an issue', content: 'Lorem ipsum dolor sit amet' },
    { title: 'Add a feature', content: 'Lorem ipsum dolor sit amet' },
    { title: 'Send a feedback', content: 'Lorem ipsum dolor sit amet' },
    { title: 'Technical details', content: 'Lorem ipsum dolor sit amet' },
  ];
  return (
    <Container>
      <Header  style={{ backgroundColor: serviceContext.theme.colors.primary }}>
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
