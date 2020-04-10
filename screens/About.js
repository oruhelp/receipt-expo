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
} from 'native-base';
import { Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { NativeRouter, Route, Link } from 'react-router-native';

export default function About(props) {
  const serviceContext = useContext(FirebaseContext);
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
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
      <Content style={styles.paragraph}>
        <Paragraph>
          OruHelp (oruhelp.com) is an initiation to empower volunteers and NGOs.
          The vison is to provide multiple utility applications for the
          volunteers and NGOs. This app is built and being maintained by me
          individually with my personal resource. Support me through your
          feedback, thoughts and quality reviews. You can reach me through the
          below email address.
          {'\n'}
          {'\n'}
          Thanks,
          {'\n'}
          Karthikeyan Chandrasekar
          {'\n'}
          oruhelp@gmail.com
        </Paragraph>
      </Content>
    </Container>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 10,
  },
});
