import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Title, Paragraph, Divider } from 'react-native-paper';
import { Item, Label, Input, Icon } from 'native-base';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { Snackbar } from 'react-native-paper';
import {
  checkValidator,
  validateEmail,
  validateName,
  validateUserName,
} from '../services/validator';

export default function Signup(props) {
  const INITIAL_STATE = {
    name: '',
    phoneNumber: '',
    email: '',
    userName: '',
    password: '',
  };
  const [signupDetails, setSignupDetails] = useState(INITIAL_STATE);
  const [validator, setValidator] = useState(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState(false);
  const service = useContext(FirebaseContext);

  const checkUserName = () => {
    service.service.db
      .ref(`users/${signupDetails.userName}`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          setValidator({
            ...validator,
            userName: {
              failed: true,
              errorMessage:
                signupDetails.userName + ' - username already taken',
            },
          });
        }
      });
  };

  const signup = () => {
    if (isLoading) return;
    setIsLoading(true);
    Keyboard.dismiss();
    if (!checkValidator(validator)) {
      service.setSnackMessage('Please fix the errors to proceed');
      setIsLoading(false);
      return;
    }
    return service.service
      .doCreateUserWithEmailAndPassword(
        signupDetails.email,
        signupDetails.password
      )
      .then(authUser => {
        const profile = {
          ...signupDetails,
          password: '',
          uid: authUser.user.uid,
          lookupId: 1,
        };
        delete profile.password;
        return service.service.db
          .ref(`users/${signupDetails.userName.toLowerCase()}/profile`)
          .set(profile)
          .then(() => {
            console.log(
              'Sign Updetails before updateing to database',
              signupDetails
            );
            return authUser.user
              .updateProfile({
                displayName: `${signupDetails.userName.toLowerCase()}#1#1`,
              })
              .then(() => {
                setSignupDetails(INITIAL_STATE);
                props.history.push({
                  pathname: '/addorg',
                  state: { signUpDetails: profile },
                });
                setIsLoading(false);
              })
              .catch(error => {
                console.log('OHR1351 - ', error);
                service.setSnackMessage(
                  'OHR1316 - User created but profile not updated properly'
                );
                props.history.push({
                  pathname: '/addorg',
                  state: { signUpDetails: profile },
                });
                setIsLoading(false);
              });
          })
          .catch(error => {
            console.log('OHR1320 - ', error);
            props.history.push({
              pathname: '/addorg',
              state: { signUpDetails: profile },
            });
            service.setSnackMessage(
              'OHR1320 - User created but profile not updated properly'
            );
            setIsLoading(false);
          });
      })
      .catch(error => {
        service.setSnackMessage('OHR1311' + error.message);
        setIsLoading(false);
      });
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginTop: Constants.statusBarHeight,
    },
    element: {
      marginTop: 10,
    },
    button: {
      marginTop: 10,
      backgroundColor: service.theme.colors.primary,
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
        <Item
          floatingLabel
          error={validator.name != '' && validator.name.failed}>
          <Label>Name</Label>
          <Input
            returnKeyType="next"
            value={signupDetails.name}
            onChangeText={_name =>
              setSignupDetails({ ...signupDetails, name: _name })
            }
            onBlur={() => {
              setValidator({
                ...validator,
                name: validateName(signupDetails.name),
              });
            }}
          />
          {validator.name != '' && validator.name.failed && (
            <Icon
              name="alert"
              onPress={() => {
                service.setSnackMessage(validator.name.errorMessage);
              }}
            />
          )}
        </Item>
        <Item
          floatingLabel
          style={styles.element}
          error={validator.email != '' && validator.email.failed}>
          <Label>Email</Label>
          <Input
            returnKeyType="next"
            value={signupDetails.email}
            keyboardType="email-address"
            onChangeText={_email => {
              setSignupDetails({ ...signupDetails, email: _email });
            }}
            onBlur={() => {
              setValidator({
                ...validator,
                email: validateEmail(signupDetails.email),
              });
            }}
          />
          {validator.email != '' && validator.email.failed && (
            <Icon
              name="alert"
              onPress={() => {
                service.setSnackMessage(validator.email.errorMessage);
              }}
            />
          )}
        </Item>

        <Item
          floatingLabel
          error={validator.userName != '' && validator.userName.failed}
          style={styles.element}>
          <Label>User Name</Label>
          <Input
            returnKeyType="next"
            value={signupDetails.userName}
            onChangeText={_userName =>
              setSignupDetails({ ...signupDetails, userName: _userName })
            }
            onBlur={() => {
              const valResult = validateUserName(signupDetails.userName);
              if (valResult.failed) {
                setValidator({
                  ...validator,
                  userName: valResult,
                });
              } else {
                setValidator({
                  ...validator,
                  userName: { failed: false, errorMessage: '' },
                });
                checkUserName();
              }
            }}
          />
          {validator.userName != '' && validator.userName.failed && (
            <Icon
              name="alert"
              onPress={() => {
                service.setSnackMessage(validator.userName.errorMessage);
              }}
            />
          )}
        </Item>
        <Item floatingLabel style={styles.element}>
          <Label>Password</Label>
          <Input
            returnKeyType="done"
            value={signupDetails.password}
            secureTextEntry={true}
            onChangeText={_password =>
              setSignupDetails({ ...signupDetails, password: _password })
            }
          />
        </Item>
        <Button mode="contained" style={styles.button} onPress={() => signup()}>
          {isLoading ? 'Loading..' : 'Sign Up'}
        </Button>
      </View>
      <View style={styles.footer}>
        <Paragraph>Already have a OruHelp account?</Paragraph>
        <Button
          mode="text"
          color={service.theme.colors.primary}
          onPress={() => props.history.push('/signin')}>
          Sign In
        </Button>
      </View>
    </View>
  );
}
