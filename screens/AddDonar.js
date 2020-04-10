import React, { Component, useState, useContext, useEffect } from 'react';
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
  Form,
  Item,
  Label,
  Picker,
  Input,
} from 'native-base';
import { Paragraph } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { NativeRouter, Route, Link } from 'react-router-native';
import * as Contacts from 'expo-contacts';
import FirebaseContext from '../services/FirebaseContext';
import {
  validateName,
  validatePhoneNumber,
  validateEmail,
} from '../services/validator';

export default function AddDonar(props) {
  const serviceContext = useContext(FirebaseContext);
  const INITIAL_STATE = {
    name: '',
    number: '',
    email: '',
    website: '',
    contactBookId: '',
  };
  const [contact, setContact] = useState(INITIAL_STATE);
  const [validator, setValidator] = useState(INITIAL_STATE);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.location.state && props.location.state.contact) {
      setContact({
        ...contact,
        name: props.location.state.contact.name,
        number:
          props.location.state.contact.phoneNumbers &&
          props.location.state.contact.phoneNumbers.length > 0
            ? props.location.state.contact.phoneNumbers[0].number
            : '',
        email:
          props.location.state.contact.emails &&
          props.location.state.contact.emails.length > 0
            ? props.location.state.contact.emails[0].email
            : '',
        website:
          props.location.state.contact.urlAddresses &&
          props.location.state.contact.urlAddresses.length > 0
            ? props.location.state.contact.urlAddresses[0].url
            : '',
        contactBookId: props.location.state.contact.id,
      });
    }
  }, []);

  function validate() {
    if (contact.name == '') {
      serviceContext.setSnackMessage('Name is required');
      return false;
    }
    if (contact.number == '' && contact.email == '') {
      serviceContext.setSnackMessage('Phone number or email is required');
      return false;
    }
    if (
      contact.number != '' &&
      !/^\d+$/.test(
        contact.number
          .replace('+', '')
          .replace('(', '')
          .replace(')', '')
          .replace(' ', '')
      )
    ) {
      serviceContext.setSnackMessage('Not a valid phone number');
      return false;
    }
    if (
      contact.email != '' &&
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(contact.email).toLowerCase()
      )
    ) {
      serviceContext.setSnackMessage('Not a valid email');
      return false;
    }

    if (
      contact.website != '' &&
      !/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi.test(
        String(contact.website).toLowerCase()
      )
    ) {
      serviceContext.setSnackMessage('Not a valid website');
      return false;
    }
    return true;
  }

  const addDonar = () => {
    if (!validate() || loading) {
      return;
    }
    setLoading(true);
    serviceContext.database
      .addDonar(contact)
      .then(result => {
        setLoading(false);
        props.history.push('/dashboard/donars');
      })
      .catch(err => console.log(err));
  };
  const importFromContacts = () => {
    setLoadingContacts(true);
    if (loadingContacts) return;
    if (serviceContext.contacts != null) {
      if (serviceContext.contacts.length > 0) {
        setLoadingContacts(false);
        props.history.push({
          pathname: '/contactsearch',
          state: { contacts: serviceContext.contacts },
        });
      }
    } else {
      (async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.PHONE_NUMBERS,
              Contacts.Fields.Emails,
              Contacts.Fields.UrlAddresses,
            ],
          });

          if (data.length > 0) {
            setLoadingContacts(false);
            props.history.push({
              pathname: '/contactsearch',
              state: { contacts: data },
            });
          }
        } else {
          setLoadingContacts(false);
          serviceContext.setSnackMessage(
            'Give permission to access the contacts.'
          );
        }
      })();
    }
  };
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button
            transparent
            onPress={() => props.history.push('/dashboard/donars')}>
            <Icon name="close" />
          </Button>
        </Left>
        <Body>
          <Title>Add Donar</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph} enableOnAndroid>
        {props.location.state && props.location.state.contact ? (
          <Form>
            <Item
              stackedLabel
              error={validator.name != '' && validator.name.failed}>
              <Label>Name</Label>
              <Input
                value={contact.name}
                onChangeText={_name => {
                  setContact({ ...contact, name: _name });
                }}
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
            {props.location.state.contact &&
            props.location.state.contact.phoneNumbers &&
            props.location.state.contact.phoneNumbers.length > 0 ? (
              <Item>
                <Label>Phone</Label>
                <Picker
                  note
                  mode="dropdown"
                  selectedValue={contact.number}
                  onValueChange={_number => {
                    setContact({ ...contact, number: _number });
                  }}>
                  {props.location.state.contact.phoneNumbers.map(
                    _phoneNumber => (
                      <Picker.Item
                        label={_phoneNumber.number}
                        value={_phoneNumber.number}
                      />
                    )
                  )}
                </Picker>
              </Item>
            ) : (
              <Item stackedLabel last>
                <Label>Phone Number</Label>
                <Input
                  value={contact.number}
                  keyboardType={'numeric'}
                  onChangeText={_number => {
                    setContact({ ...contact, number: _number });
                  }}
                />
              </Item>
            )}
            {props.location.state.contact &&
            props.location.state.contact.emails &&
            props.location.state.contact.emails.length > 0 ? (
              <Item>
                <Label>Email</Label>
                <Picker
                  note
                  mode="dropdown"
                  selectedValue={contact.email}
                  onValueChange={_email => {
                    setContact({ ...contact, email: _email });
                  }}>
                  {props.location.state.contact.emails.map(_email => (
                    <Picker.Item label={_email.email} value={_email.email} />
                  ))}
                </Picker>
              </Item>
            ) : (
              <Item stackedLabel last>
                <Label>Email</Label>
                <Input
                  keyboardType={'email-address'}
                  value={contact.email}
                  onChangeText={_email => {
                    setContact({ ...contact, email: _email });
                  }}
                />
              </Item>
            )}
            {props.location.state.contact &&
            props.location.state.contact.urlAddresses &&
            props.location.state.contact.urlAddresses.length > 0 ? (
              <Item>
                <Label>Website</Label>
                <Picker
                  note
                  mode="dropdown"
                  selectedValue={contact.website}
                  onValueChange={_url => {
                    setContact({ ...contact, website: _url });
                  }}>
                  {props.location.state.contact.urlAddresses.map(_url => (
                    <Picker.Item label={_url.url} value={_url.url} />
                  ))}
                </Picker>
              </Item>
            ) : (
              <Item stackedLabel last>
                <Label>Website</Label>
                <Input
                  value={contact.website}
                  onChangeText={_website => {
                    setContact({ ...contact, website: _website });
                  }}
                />
              </Item>
            )}
          </Form>
        ) : (
          <Form>
            <Button
              bordered
              small
              full
              rounded
              onPress={() => importFromContacts()}>
              <Text>
                {loadingContacts ? 'Loading...' : 'Import from contacts'}
              </Text>
            </Button>
            <Item floatingLabel>
              <Label>Name</Label>
              <Input
                value={contact && contact.name}
                onChangeText={_name => {
                  setContact({ ...contact, name: _name });
                }}
              />
            </Item>

            <Item floatingLabel last>
              <Label>Phone Number</Label>
              <Input
                keyboardType={'numeric'}
                value={contact.number}
                onChangeText={_number => {
                  setContact({ ...contact, number: _number });
                }}
                onBlur={() => validate()}
              />
            </Item>

            <Item floatingLabel last>
              <Label>Email</Label>
              <Input
                keyboardType={'email-address'}
                value={contact.email}
                onChangeText={_email => {
                  setContact({ ...contact, email: _email });
                }}
                onBlur={() => validate()}
              />
            </Item>

            <Item floatingLabel last>
              <Label>Website</Label>
              <Input
                value={contact.url}
                onChangeText={_website => {
                  setContact({ ...contact, website: _website });
                }}
                onBlur={() => validate()}
              />
            </Item>
          </Form>
        )}
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => addDonar()}>
            <Title>{loading ? 'Loading...' : 'Add Donar'}</Title>
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
