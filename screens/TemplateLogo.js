import React, { useContext, useState, useEffect } from 'react';
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
import { StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import * as Permissions from 'expo-permissions';
import FirebaseContext from '../services/FirebaseContext';

export default function TemplateLogo(props) {
  const serviceContext = useContext(FirebaseContext);
  const [image, setImage] = useState();

  useEffect(() => {
    getPermissionAsync();
  }, []);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };
  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Logo</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Button
          onPress={_pickImage}
          style={{
            justifyContent: 'center',
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Text>Browse</Text>
        </Button>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: 200,
                height: 200,
                marginTop: 50,
                marginBottom: 50,
              }}
            />
          )}
        </View>
      </Content>
      <Footer>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button
            full
            onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button
            full
            onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Next</Title>
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
});
