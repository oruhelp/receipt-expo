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
import FirebaseContext from '../services/FirebaseContext';

export default function AddOrg(props) {
  const [ngoDetails, setNgoDetails] = useState({
    orgName: '',
    userName: '',
    registeredCountry: '',
    registeredDate: new Date(),
    registeredNumber: '',
    role: '',
  });

  const serviceContext = useContext(FirebaseContext);

  const roleChange = val => {
    console.log(val);
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
        <Body>
          <Title>Add Organization</Title>
        </Body>
        <Right />
      </Header>
      <Content style={styles.paragraph}>
        <Title style={styles.title}>Enter NGO/Trust Details</Title>
        <Item floatingLabel style={styles.element}>
          <Label>Organization Name</Label>
          <Input
            value={ngoDetails.orgName}
            onChangeText={_orgName =>
              setNgoDetails({ ...ngoDetails, orgName: _orgName })
            }
          />
        </Item>
        <Item floatingLabel style={styles.element}>
          <Label>User Name</Label>
          <Input
            value={ngoDetails.userName}
            onChangeText={userName =>
              setNgoDetails({ ...ngoDetails, userName: userName })
            }
          />
        </Item>
        <Item floatingLabel style={styles.element}>
          <Label>Registered Country</Label>
          <Input
            value={ngoDetails.registeredCountry}
            onChangeText={registeredCountry =>
              setNgoDetails({
                ...ngoDetails,
                registeredCountry: registeredCountry,
              })
            }
          />
        </Item>
        <DatePicker
          defaultDate={new Date(ngoDetails.registeredDate)}
          maximumDate={new Date()}
          locale={'en'}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          placeHolderText="Registration date"
          placeHolderTextStyle={{ color: '#d3d3d3' }}
          onDateChange={date =>
            setNgoDetails({ ...ngoDetails, registeredDate: date })
          }
          disabled={false}
        />
        <Item floatingLabel style={styles.element}>
          <Label>Registration Number</Label>
          <Input
            value={ngoDetails.registeredNumber}
            onChangeText={registeredNumber =>
              setNgoDetails({
                ...ngoDetails,
                registeredNumber: registeredNumber,
              })
            }
          />
        </Item>
        <Form>
          <Item picker style={styles.dropdown}>
            <Picker
              mode="dropdown"
              iosIcon={<Icon name="arrow-down" />}
              style={{ marginTop: 20 }}
              placeholderStyle={{ color: '#bfc6ea' }}
              placeholderIconColor="#007aff"
              selectedValue={ngoDetails.role}
              onValueChange={value =>
                setNgoDetails({ ...ngoDetails, role: value })
              }>
              <Picker.Item label="I am the President" value="president" />
              <Picker.Item label="I am the Secretary" value="secretary" />
              <Picker.Item label="I am a Trustee" value="trustee" />
              <Picker.Item label="I am a Volunteer" value="volunteer" />
              <Picker.Item label="Others" value="others" />
            </Picker>
          </Item>
        </Form>
      </Content>
      <Footer>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button
            full
            onPress={() => props.history.push('/dashboard/receipts')}>
            <Title>Skip</Title>
          </Button>
        </FooterTab>
        <FooterTab
          style={{
            padding: 0,
            backgroundColor: serviceContext.theme.colors.primary,
          }}>
          <Button full onPress={() => addOrg()}>
            <Title>Register</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}

const styles = StyleSheet.create({
  element: {
    marginTop: 10,
  },
  paragraph: {
    margin: 10,
  },
});
