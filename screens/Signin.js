import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Alert, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Title, Paragraph, Divider } from 'react-native-paper';
import { Item, Label, Input, Toast, Icon } from 'native-base';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link, Redirect } from 'react-router-native';
import { Snackbar } from 'react-native-paper';
import { validateEmail, checkValidator } from '../services/validator';

import FirebaseContext from '../services/FirebaseContext';

export default function Signin(props) {
  const INITIAL_STATE = {
    email: '',
    password: '',
  };
  const serviceContext = useContext(FirebaseContext);
  const [credentials, setCredentials] = useState(INITIAL_STATE);
  const [validator, setValidator] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const signin = () => {
    setIsLoading(true);
    Keyboard.dismiss();
    if (!checkValidator(validator)) {
      serviceContext.setSnackMessage('Please fix the errors to proceed');
      setIsLoading(false);
      return;
    }
    return serviceContext.service
      .doSignInWithEmailAndPassword(credentials.email, credentials.password)
      .then(() => {
        props.history.push('/dashboard/receipts');
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        serviceContext.setSnackMessage(err.message);
      });
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: Constants.statusBarHeight + 20,
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
  serviceContext;

  return (
    <View style={styles.container}>
      <View style={{ width: '80%' }}>
        <Image
          style={styles.logo}
          source={require('../assets/oruhelp-logo.png')}
        />
        <Item
          floatingLabel
          error={validator.email && validator.email.failed}
          style={styles.element}>
          <Label>Email</Label>
          <Input
            value={credentials.email}
            returnKeyType="next"
            keyboardType="email-address"
            onChangeText={email => {
              setCredentials({ ...credentials, email: email });
            }}
            onBlur={() => {
              setValidator({
                ...validator,
                email: validateEmail(credentials.email),
              });
            }}
          />
          {validator.email != '' && validator.email.failed && (
            <Icon
              name="alert"
              style={{ color: serviceContext.theme.colors.error }}
              onPress={() =>
                serviceContext.setSnackMessage(validator.email.errorMessage)
              }
            />
          )}
        </Item>
        <Item floatingLabel style={styles.element}>
          <Label>Password</Label>
          <Input
            value={credentials.password}
            secureTextEntry={true}
            returnKeyType="done"
            onChangeText={password =>
              setCredentials({ ...credentials, password: password })
            }
          />
        </Item>
        <Button
          mode="contained"
          style={styles.button}
          disabled={isLoading}
          onPress={() => signin()}>
          Sign In
        </Button>
        <Button
          mode="text"
          style={styles.element}
          color={serviceContext.theme.colors.primary}
          onPress={() => props.history.push('/forgotPassword')}>
          Forgot Password?
        </Button>
      </View>
      <View style={styles.footer}>
        <Paragraph>Don't have a OruHelp account?</Paragraph>
        <Button
          mode="text"
          color={serviceContext.theme.colors.primary}
          style={styles.element}
          onPress={() => props.history.push('/signup')}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}
