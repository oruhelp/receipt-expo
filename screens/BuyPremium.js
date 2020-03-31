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
  ListItem,
  Radio,
  Picker,
  Form,
  Item,
} from 'native-base';
import { Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { NativeRouter, Route, Link } from 'react-router-native';

export default function BuyPremium(props) {
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
          <Title>Sponsor</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Paragraph>
          As mentioned in the about page, this mission needs your help. My
          intention is not to sell this application, but however your financial
          support will cheer me up and getting many things done.
          {'\n'}
          {'\n'}
          If you wish,
        </Paragraph>
        <ListItem>
          <Left>
            <Paragraph>Send me a Coffee (Rs.100/-)</Paragraph>
          </Left>
          <Right>
            <Radio selected={false} />
          </Right>
        </ListItem>
        <ListItem>
          <Left>
            <Paragraph>Send me a Cake (Rs.300/-)</Paragraph>
          </Left>
          <Right>
            <Radio selected={true} />
          </Right>
        </ListItem>
        <ListItem>
          <Left>
            <Paragraph>Send me a Lunch (Rs.500/-)</Paragraph>
          </Left>
          <Right>
            <Radio selected={false} />
          </Right>
        </ListItem>
        <Form>
          <Item picker style={styles.dropdown}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ marginTop: 20 }}
              placeholder="One-time support"
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
            >
              <Picker.Item label="One-time" value="key0" />
              <Picker.Item label="Every Year" value="key1" />
              <Picker.Item label="Every Month" value="key2" />
            </Picker>
          </Item>
        </Form>
        <Paragraph style={styles.paragraph}>
          So, you wish to send me (a cup of coffee)/(a cake)/(lunch) (every
          month)/(every year)/(one time).
        </Paragraph>
      </Content>
      <Footer>
        <FooterTab  style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button full>
            <Title>Yes, take my offer</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    margin: 10,
  },
  dropdown: {
    marginBottom: 10
  },
});
