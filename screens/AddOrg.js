import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, Image, Alert } from 'react-native';
import {
  Container,
  Header,
  Content,
  Footer,
  FooterTab,
  Left,
  Right,
  Body,
  Button,
  Icon,
  Picker,
  Form,
  Item,
  Label,
  Input,
  List,
  ListItem,
  Title,
  DatePicker,
} from 'native-base';
import { TextInput } from 'react-native-paper';
import { Paragraph, Divider } from 'react-native-paper';
import Constants from 'expo-constants';
import { countries } from '../constants/countries';
import FirebaseContext from '../services/FirebaseContext';

export default function AddOrg(props) {
  const INITIAL_STATE = {
    name: '',
    addressLine1: '',
    addressLine2: '',
    registeredCountry: '',
    pincode: '',
    role: '',
    phoneNumber: '',
    email: '',
    website: '',
    userName: '',
    registeredDate: new Date(),
    registeredNumber: '',
    templateName: '',
    templateColor: '',
    logo: '',
  };
  const [ngoDetails, setNgoDetails] = useState(INITIAL_STATE);
  const [validator, setValidator] = useState({
    ...INITIAL_STATE,
    registeredDate: '',
  });

  const serviceContext = useContext(FirebaseContext);

  const roleChange = val => {
    console.log(val);
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
      return;
    }
    serviceContext.service.db
      .ref(`orgs/${ngoDetails.userName}`)
      .once('value', snapshot => {
        if (snapshot.exists()) {
          setValidator({
            ...validator,
            userName: {
              failed: true,
              errorMessage: ngoDetails.userName + ' - username already taken',
            },
          });
        } else {
          setValidator({
            ...validator,
            userName: {
              failed: false,
              errorMessage: '',
            },
          });
        }
      });
  };
  const addOrg = () => {
    serviceContext.database
      .addOrg(ngoDetails)
      .then(res => {
        props.history.push('/template');
      })
      .catch(err => {
        serviceContext.setSnackMessage(err);
      });

    serviceContext.service.db
      .ref('orgs/' + ngoDetails.userName)
      .set({
        profile: { ...ngoDetails },
        users: {
          creator: { uid: serviceContext.authUser.uid, role: ngoDetails.role },
        },
      })
      .then(() => {
        return serviceContext.service.db
          .ref('users/' + serviceContext.authUser.uid + '/orgs')
          .set({
            [ngoDetails.userName]: ngoDetails.role,
          })
          .then(() => {
            serviceContext.setProfile({
              ...serviceContext.profile,
              orgName: ngoDetails.orgName,
            });
            props.history.push('/template');
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  };
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left />
        <Body>
          <Title>Add Organization</Title>
        </Body>
      </Header>
      <Content style={styles.paragraph}>
        <Item style={styles.element}>
          <Input
            placeholder="Organization Name"
            value={ngoDetails.name}
            onChangeText={_name =>
              setNgoDetails({ ...ngoDetails, name: _name })
            }
          />
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
        <Item style={styles.element}>
          <Input
            placeholder="Address Line 1"
            value={ngoDetails.addressLine1}
            onChangeText={_addressLine1 =>
              setNgoDetails({ ...ngoDetails, addressLine1: _addressLine1 })
            }
          />
        </Item>
        <Item style={styles.element}>
          <Input
            placeholder="Address Line 2"
            value={ngoDetails.addressLine2}
            onChangeText={_addressLine2 =>
              setNgoDetails({ ...ngoDetails, addressLine2: _addressLine2 })
            }
          />
        </Item>
        <Form>
          <Item picker style={styles.element}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={ngoDetails.registeredCountry}
              onValueChange={value =>
                setNgoDetails({ ...ngoDetails, registeredCountry: value })
              }>
              {countries.map(country => (
                <Picker.Item label={country.name} value={country.name} />
              ))}
            </Picker>
          </Item>
        </Form>
        <Item style={styles.element}>
          <Input
            placeholder="Pincode"
            value={ngoDetails.pincode}
            onChangeText={_pincode =>
              setNgoDetails({
                ...ngoDetails,
                pincode: _pincode,
              })
            }
          />
        </Item>
        <Form>
          <Item picker style={styles.element}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={ngoDetails.role}
              onValueChange={value =>
                setNgoDetails({ ...ngoDetails, role: value })
              }>
              <Picker.Item label="I am the President" value="president" />
              <Picker.Item label="I am the Secretary" value="secretary" />
              <Picker.Item label="I am a Trustee" value="trustee" />
              <Picker.Item label="I am a Staff" value="staff" />
              <Picker.Item label="I am a Volunteer" value="volunteer" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </Item>
        </Form>
        <Item style={styles.element}>
          <DatePicker
            defaultDate={new Date(ngoDetails.registeredDate)}
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
        <Item style={styles.element}>
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
        </Item>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() =>  props.history.push({
          pathname: '/template',
          state: { ngoDetails: ngoDetails },
        })}>
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
