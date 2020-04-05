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
  const [orgDetails, setOrgDetails] = useState();

  useEffect(() => {
    getPermissionAsync();
    if (props.location.state && props.location.state.orgDetails) {
      setOrgDetails(props.location.state.orgDetails);
    }
  }, []);

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        serviceContext.setSnackMessage(
          'Sorry, need camera roll permissions to make this work!'
        );
      }
    }
  };
  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result);
    }
  };

  const navigateToTemplate = () => {
    props.history.push({
      pathname: '/template',
      state: {
        orgDetails: {
          ...orgDetails,
          logoSrc: image ? `data:image/jpg;base64,${image.base64}` : '',
        },
      },
    });
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
          <Image
            source={{
              uri: image ? `data:image/jpg;base64,${image.base64}` : null,
            }}
            style={{
              width: 200,
              height: 200,
              marginTop: 50,
              marginBottom: 50,
            }}
          />
        </View>
      </Content>
      <Footer>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button full onPress={() => navigateToTemplate()}>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button full onPress={() => navigateToTemplate()}>
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
