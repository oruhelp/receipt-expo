import React, { useContext, useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Left,
  Body,
  Button,
  Icon,
  Picker,
  Form,
  Item,
  Input,
  List,
  ListItem,
  Title,
  DatePicker,
} from 'native-base';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Paragraph, Divider } from 'react-native-paper';
import Constants from 'expo-constants';
import { countries } from '../constants/countries';
import { roles } from '../constants/roles';
import FirebaseContext from '../services/FirebaseContext';

export default function AddOrg(props) {
  const INITIAL_STATE = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    registeredCountry: countries[0].name,
    pincode: '',
    role: roles[0].value,
    phoneNumber: '',
    email: '',
    website: '',
    userName: '',
    registeredDate: '',
    registeredNumber: '',
    templateName: '',
    templateColor: '',
    logoSrc: '',
  };
  const [ngoDetails, setNgoDetails] = useState(INITIAL_STATE);
  const [validator, setValidator] = useState(INITIAL_STATE);

  const serviceContext = useContext(FirebaseContext);

  useEffect(() => {
    // If displayName not updated earlier let it update now
    if (
      serviceContext.authUser.displayName == '' &&
      props.location.state.signUpDetails
    )
      serviceContext.authUser.updateProfile({
        displayName: `${props.location.state.signUpDetails.userName.toLowerCase()}#1#1`,
      });
  }, []);

  const validate = () => {
    console.log('Validating NGO details', ngoDetails);
    if (ngoDetails.name.length < 4) {
      serviceContext.setSnackMessage(
        'Organization Name should be minimum 4 characters'
      );
      return false;
    }
    if (!/^[a-z0-9]+$/i.test(ngoDetails.userName)) {
      serviceContext.setSnackMessage('Username should be alphanumeric');
      return false;
    }
    if (ngoDetails.userName.length < 4) {
      serviceContext.setSnackMessage('Username should be minimum 4 characters');
      return false;
    }
    if (ngoDetails.userName.length > 15) {
      serviceContext.setSnackMessage(
        'Username should not be greater than 15 characters'
      );
      return false;
    }
    if (validator.userName.failed) {
      serviceContext.setSnackMessage('Username not available');
      return false;
    }

    if (ngoDetails.addressLine1.length < 1) {
      serviceContext.setSnackMessage('Address Line 1 should not be empty');
      return false;
    }

    if (ngoDetails.addressLine2.length < 1) {
      serviceContext.setSnackMessage('Address Line 2 should not be empty');
      return false;
    }

    if (ngoDetails.registeredCountry.length < 1) {
      serviceContext.setSnackMessage('Country should not be empty');
      return false;
    }

    if (!/^[1-9][0-9]{5}$/.test(ngoDetails.pincode)) {
      serviceContext.setSnackMessage('Not a valid Pincode');
      return false;
    }

    if (ngoDetails.role.length < 1) {
      serviceContext.setSnackMessage('Role should not be empty');
      return false;
    }

    if (ngoDetails.registeredDate.length < 1) {
      serviceContext.setSnackMessage('Please select the registered date');
      return false;
    }

    if (ngoDetails.registeredNumber.length < 1) {
      serviceContext.setSnackMessage('Registered number should not be empty');
      return false;
    }
    return true;
  };

  const checkUserName = () => {
    if (ngoDetails.userName.length < 4) {
      setValidator({
        ...validator,
        userName: {
          failed: true,
          errorMessage: 'Username should be atlease 4 characters',
        },
      });
      return false;
    }
    if (ngoDetails.userName.length > 15) {
      setValidator({
        ...validator,
        userName: {
          failed: true,
          errorMessage: 'Username should not be greater than 15 characters',
        },
      });
      return false;
    }
    if (!/^[a-z0-9]+$/i.test(ngoDetails.userName)) {
      setValidator({
        ...validator,
        userName: {
          failed: true,
          errorMessage: 'Username should be alphanumeric',
        },
      });
      return false;
    }
    serviceContext.service.db
      .ref(`orgs/${ngoDetails.userName.toLowerCase()}`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          setValidator({
            ...validator,
            userName: {
              failed: true,
              errorMessage: ngoDetails.userName + ' - username already taken',
            },
          });
          return false;
        } else {
          setValidator({
            ...validator,
            userName: {
              failed: false,
              errorMessage: '',
            },
          });
          return true;
        }
      });
  };
  const addOrg = () => {
    if (!validate()) {
      return false;
    }
    console.log('From NGO page', ngoDetails);
    props.history.push({
      pathname: '/templatelogo',
      state: {
        orgDetails: {
          ...ngoDetails,
          userDetails:
            props.location &&
            props.location.state &&
            props.location.state.signUpDetails,
        },
      },
    });
    return true;
  };
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left />
        <Body>
          <Title>Add Organization</Title>
        </Body>
      </Header>
      <Content style={styles.paragraph} enableOnAndroid>
        <Item
          style={styles.element}
          error={validator.name != '' && validator.name.failed}>
          <Input
            placeholder="Organization Name"
            value={ngoDetails.name}
            onChangeText={_name =>
              setNgoDetails({ ...ngoDetails, name: _name })
            }
          />
          {validator.name != '' && validator.name.failed && (
            <Icon
              name="alert"
              onPress={() => {
                serviceContext.setSnackMessage(validator.name.errorMessage);
              }}
            />
          )}
        </Item>
        <Item
          style={styles.element}
          error={validator.userName != '' && validator.userName.failed}>
          <Input
            placeholder="User Name"
            value={ngoDetails.userName}
            onChangeText={userName =>
              setNgoDetails({ ...ngoDetails, userName: userName })
            }
            onBlur={() => checkUserName()}
          />
          {validator.userName != '' && validator.userName.failed && (
            <Icon
              name="alert"
              onPress={() => {
                serviceContext.setSnackMessage(validator.userName.errorMessage);
              }}
            />
          )}
        </Item>
        <Item
          style={styles.element}
          error={validator.addressLine1 != '' && validator.addressLine1.failed}>
          <Input
            placeholder="Address Line 1"
            value={ngoDetails.addressLine1}
            onChangeText={_addressLine1 =>
              setNgoDetails({ ...ngoDetails, addressLine1: _addressLine1 })
            }
          />
          {validator.addressLine1 != '' && validator.addressLine1.failed && (
            <Icon
              name="alert"
              onPress={() => {
                serviceContext.setSnackMessage(
                  validator.addressLine1.errorMessage
                );
              }}
            />
          )}
        </Item>
        <Item
          style={styles.element}
          error={validator.addressLine2 != '' && validator.addressLine2.failed}>
          <Input
            placeholder="Address Line 2"
            value={ngoDetails.addressLine2}
            onChangeText={_addressLine2 =>
              setNgoDetails({ ...ngoDetails, addressLine2: _addressLine2 })
            }
          />
          {validator.addressLine2 != '' && validator.addressLine2.failed && (
            <Icon
              name="alert"
              onPress={() => {
                serviceContext.setSnackMessage(
                  validator.addressLine2.errorMessage
                );
              }}
            />
          )}
        </Item>
        <Form>
          <Item picker style={styles.element}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={ngoDetails.registeredCountry}
              onValueChange={value => {
                setNgoDetails({ ...ngoDetails, registeredCountry: value });
              }}>
              {countries.map(country => (
                <Picker.Item label={country.name} value={country.name} />
              ))}
            </Picker>
          </Item>
        </Form>
        <Item
          style={styles.element}
          error={validator.pincode != '' && validator.pincode.failed}>
          <Input
            placeholder="Pincode"
            keyboardType="number-pad"
            value={ngoDetails.pincode}
            onChangeText={_pincode =>
              setNgoDetails({
                ...ngoDetails,
                pincode: _pincode,
              })
            }
          />
          {validator.pincode != '' && validator.pincode.failed && (
            <Icon
              name="alert"
              onPress={() => {
                serviceContext.setSnackMessage(validator.pincode.errorMessage);
              }}
            />
          )}
        </Item>
        <Form>
          <Item picker style={styles.element}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={ngoDetails.role}
              onValueChange={_role => {
                setNgoDetails({ ...ngoDetails, role: _role });
              }}>
              {roles.map(role => (
                <Picker.Item label={role.label} value={role.value} />
              ))}
            </Picker>
          </Item>
        </Form>
        <Item style={styles.element}>
          <DatePicker
            defaultDate={new Date()}
            maximumDate={new Date()}
            locale={'en'}
            style={{ margin: 0, padding: 0 }}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={'fade'}
            androidMode={'default'}
            placeHolderText="Registration date"
            onDateChange={date =>
              setNgoDetails({ ...ngoDetails, registeredDate: date })
            }
            disabled={false}
          />
        </Item>
        <Divider style={styles.element} />
        <Item
          style={styles.element}
          error={
            validator.registeredNumber != '' &&
            validator.registeredNumber.failed
          }>
          <Input
            placeholder="Registration Number"
            value={ngoDetails.registeredNumber}
            onChangeText={registeredNumber =>
              setNgoDetails({
                ...ngoDetails,
                registeredNumber: registeredNumber,
              })
            }
          />
          {validator.registeredNumber != '' &&
            validator.registeredNumber.failed && (
              <Icon
                name="alert"
                onPress={() => {
                  serviceContext.setSnackMessage(
                    validator.registeredNumber.errorMessage
                  );
                }}
              />
            )}
        </Item>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => addOrg()}>
            <Title>Next</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  element: {
    marginRight: 10,
    marginLeft: 10,
  },
  paragraph: {},
});
