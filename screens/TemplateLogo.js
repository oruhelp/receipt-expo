import React, { Component } from 'react';
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
import { NativeRouter, Route, Link } from 'react-router-native';

export default function TemplateLogo(props) {
  return (
    <Container>
      <Header>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Template Logo</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Paragraph>
          Template Logo
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
