import React, { useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { TextInput } from 'react-native';
import { Surface } from 'react-native-paper';
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
import Constants from 'expo-constants';

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function TemplateColor(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);

  return (
    <Container>
      <Header>
        <Body>
          <Title>Select Template Color</Title>
        </Body>
      </Header>
      <Content style={styles.paragraph}>
        <View>
          <Title style={styles.title}>Select a Template Color</Title>
          <View style={styles.tiles}>
            <Surface style={[styles.tile, { backgroundColor: '#0ff' }]} />
            <Surface style={[styles.tile, { backgroundColor: '#f0f' }]} />
            <Surface
              style={[styles.tile, { backgroundColor: '#ff0', elevation: 4 }]}
            />
            <Surface style={[styles.tile, { backgroundColor: '#00f' }]} />
            <Surface style={[styles.tile, { backgroundColor: '#f00' }]} />
            <Surface style={[styles.tile, { backgroundColor: '#0f0' }]} />
          </View>
        </View>
      </Content>
      <Footer>
        <FooterTab>
          <Button full onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab>
          <Button full onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Done</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: 'center',
    marginTop: '3%',
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tile: {
    height: 80,
    width: '25%',
    elevation: 0,
    margin: '2%',
  },
});
