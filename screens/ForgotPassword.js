import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Title, Paragraph, Divider } from 'react-native-paper';
import { Item, Label, Input } from 'native-base';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import FirebaseContext from '../services/FirebaseContext';

export default function ForgotPassword(props) {
  const [email, setEmail] = useState('');
  const serviceContext = useContext(FirebaseContext);

  const resetPassword = () => {
    Keyboard.dismiss();
    serviceContext.service
      .doPasswordReset(email)
      .then(() => props.history.push('/signin'))
      .catch(err => serviceContext.setSnackMessage(err.message));
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: 20,
    },
    title: {
      textAlign: 'center',
    },
    element: {
      marginTop: 10,
    },
    button: {
      marginTop: 10,
      backgroundColor: serviceContext.theme.colors.primary,
    },
    logo: {
      height: 128,
      width: 128,
      alignSelf: 'center',
    },
    footer: {
      marginBottom: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={{ width: '80%' }}>
        <Image
          style={styles.logo}
          source={require('../assets/oruhelp-logo.png')}
        />
        <Title style={styles.title}>Reset Password</Title>
        <Paragraph>
          Reset password link will be sent to the mail id. If you didn't
          received the mail, please check your spam folder.
        </Paragraph>
        <Item floatingLabel style={styles.element}>
          <Label>Email</Label>
          <Input
            value={email}
            keyboardType="email-address"
            onChangeText={email => setEmail(email)}
          />
        </Item>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => resetPassword()}>
          Send
        </Button>
      </View>
      <View style={styles.footer}>
        <Button
          mode="text"
          color={serviceContext.theme.colors.primary}
          style={styles.element}
          onPress={() => props.history.push('/signin')}>
          Sign In
        </Button>
      </View>
    </View>
  );
}
