import React, { useContext } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { Dimensions } from 'react-native';
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
import Constants from 'expo-constants';

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]} />
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: '#673ab7' }]} />
);

const initialLayout = { width: Dimensions.get('window').width };

export default function Template(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'First' },
    { key: 'second', title: 'Second' },
  ]);
  const cards = [
    {
      text: 'Card One',
      name: 'One',
      image: { uri: 'https://picsum.photos/700/1000' },
    },
    {
      text: 'Card One',
      name: 'One',
      image: { uri: 'https://picsum.photos/700/1000' },
    },
    {
      text: 'Card One',
      name: 'One',
      image: { uri: 'https://picsum.photos/700/1000' },
    },
  ];

  return (
    <Container>
      <Header>
        <Body>
          <Title>Select Receipt Template</Title>
        </Body>
      </Header>
      <Content style={styles.paragraph}>
        <View style={styles.container}>
          <Title style={styles.title}>Select a Template</Title>
          <View style={styles.imageContainer}>
            <DeckSwiper
              style={styles.imageContainer}
              dataSource={cards}
              renderItem={item => (
                <Image
                  style={{ height: 500, width: '100%' }}
                  source={item.image}
                />
              )}
            />
          </View>
        </View>
      </Content>
      <Footer>
        <FooterTab>
          <Button full onPress={() => props.history.push('/templatecolor')}>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab>
          <Button full onPress={() => props.history.push('/templatecolor')}>
            <Title>Next</Title>
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
  imageContainer: {
    flexGrow: 1,
  },
});
