import React, { useContext, useState, useEffect } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import { Input, Divider } from 'react-native-elements';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
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
import { FlatList } from 'react-native';
import { Surface } from 'react-native-paper';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { getDisplayTextOfRole } from '../constants/roles';
import { templates, getCompletedHtml } from '../constants/templates/index';

export default function Template(props) {
  const serviceContext = useContext(FirebaseContext);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      props.location.state &&
      props.location.state.orgDetails &&
      props.location.state.orgDetails.userDetails
    ) {
      setOrgDetails({
        sender: {
          name: props.location.state.orgDetails.userDetails.name,
          phoneNumber: props.location.state.orgDetails.userDetails.phoneNumber,
          email: props.location.state.orgDetails.userDetails.email,
          role: getDisplayTextOfRole(props.location.state.orgDetails.role),
        },
        approver: {
          name: '',
          role: '',
          phoneNumber: '',
          email: '',
        },
        receiver: {
          name: 'Donar Name',
          phoneNumber: '+91-1234567890',
          email: 'noreply@oruhelp.com',
        },
        org: {
          name: props.location.state.orgDetails.name,
          addressLine1: props.location.state.orgDetails.addressLine1,
          addressLine2: props.location.state.orgDetails.addressLine2,
          registeredCountry: props.location.state.orgDetails.registeredCountry,
          pincode: props.location.state.orgDetails.pincode,
          phoneNumber: props.location.state.orgDetails.phoneNumber,
          email: props.location.state.orgDetails.email,
          website: props.location.state.orgDetails.website,
          logoSrc: props.location.state.orgDetails.logoSrc,
          userName: props.location.state.orgDetails.userName,
          registeredDate: props.location.state.orgDetails.registeredDate,
          registeredNumber: props.location.state.orgDetails.registeredNumber,
          templateName: activeTemplate.id,
          templateColor: props.location.state.orgDetails.templateColor,
        },
        donation: {
          id: '1343',
          amount: '1000',
          date: new Date().toLocaleDateString(),
          description: 'This is donated for student education',
          footer: 'Thank you for your contribution',
        },
      });
    } else if (
      props.location.state &&
      props.location.state.orgDetails &&
      serviceContext.userName
    ) {
      serviceContext.service.db
        .ref(`users/${serviceContext.userName}/profile`)
        .once('value')
        .then(function(snapshot) {
          setOrgDetails({
            sender: {
              name: snapshot.val().name,
              phoneNumber: snapshot.val().phoneNumber,
              email: snapshot.val().email,
              role: getDisplayTextOfRole(props.location.state.orgDetails.role),
            },
            approver: {
              name: '',
              role: '',
              phoneNumber: '',
              email: '',
            },
            receiver: {
              name: 'Donar Name',
              phoneNumber: '+91-1234567890',
              email: 'noreply@oruhelp.com',
            },
            org: {
              name: props.location.state.orgDetails.name,
              addressLine1: props.location.state.orgDetails.addressLine1,
              addressLine2: props.location.state.orgDetails.addressLine2,
              registeredCountry:
                props.location.state.orgDetails.registeredCountry,
              pincode: props.location.state.orgDetails.pincode,
              phoneNumber: props.location.state.orgDetails.phoneNumber,
              email: props.location.state.orgDetails.email,
              website: props.location.state.orgDetails.website,
              logoSrc: props.location.state.orgDetails.logoSrc,
              userName: props.location.state.orgDetails.userName,
              registeredDate: props.location.state.orgDetails.registeredDate,
              registeredNumber:
                props.location.state.orgDetails.registeredNumber,
              templateName: activeTemplate.id,
              templateColor: props.location.state.orgDetails.templateColor,
            },
            donation: {
              id: '1343',
              amount: '1000',
              date: new Date().toLocaleDateString(),
              description: 'This is donated for student education',
              footer: 'Thank you for your contribution',
            },
          });
        });
    }
  }, []);

  useEffect(() => {
    if (serviceContext.database == null) {
      serviceContext.refreshDatabase();
    }
  }, []);

  const updateOrgDetailsToFirebase = _userName => {
    return serviceContext.service.db
      .ref('orgs/' + orgDetails.org.userName.toLowerCase())
      .set({
        profile: { ...orgDetails.org, lookupId: 1 },
        users: {
          creator: {
            uid: serviceContext.authUser.uid,
            userName: _userName,
            role: orgDetails.sender.role,
          },
        },
      });
  };
  const updateOrgDetailsToDb = () => {
    if (serviceContext.database == null)
      console.log('Local database instance is null', serviceContext.database);
    return serviceContext.database.addOrg({
      ...orgDetails.org,
      sender: orgDetails.sender,
    });
  };
  const updateOrgDetailsToUserInFirebase = _userName => {
    return serviceContext.service.db.ref('users/' + _userName + '/orgs').set({
      [orgDetails.org.userName]: orgDetails.sender.role,
    });
  };
  const registerOrg = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    const _userName = serviceContext.authUser.displayName.split('#')[0];
    return updateOrgDetailsToUserInFirebase(_userName)
      .then(() => {
        return updateOrgDetailsToFirebase(_userName)
          .then(() => {
            return updateOrgDetailsToDb()
              .then(res => {
                setLoading(false);
                props.history.push('/dashboard/receipts');
              })
              .catch(err => {
                setLoading(false);
                serviceContext.setSnackMessage(
                  'OHR1330 - Some unexpected error occurred, and could not proceed. Please contact support.'
                );
              });
          })
          .catch(err => {
            setLoading(false);
            serviceContext.setSnackMessage(
              'OHR1331 - Some unexpected error occurred, and could not proceed. Please contact support.'
            );
          });
      })
      .catch(err => {
        setLoading(false);
        serviceContext.setSnackMessage(
          'OHR1332 - Some unexpected error occurred, and could not proceed. Please contact support.'
        );
      });
  };

  const getHtml = () => {
    if (orgDetails && orgDetails.sender && orgDetails.org) {
      return getCompletedHtml(activeTemplate.html, orgDetails);
    } else {
      return '<h1>Loading<h1>';
    }
  };
  const styles = StyleSheet.create({
    surface: {
      margin: 8,
      height: 90,
      width: 90,
      backgroundColor: serviceContext.theme.colors.xprimary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
    },
    surfaceSelected: {
      margin: 8,
      height: 90,
      width: 90,
      backgroundColor: serviceContext.theme.colors.xprimary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      borderColor: serviceContext.theme.colors.primary,
      borderWidth: 2,
    },
  });
  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button transparent onPress={() => props.history.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Template1</Title>
        </Body>
        <Right />
      </Header>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}>
        <WebView
          style={styles.list}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          source={{
            html: getHtml(),
          }}
        />
        <View>
          <FlatList
            horizontal
            data={templates}
            renderItem={({ item: rowData }) => {
              return (
                <Button
                  style={
                    activeTemplate.id == rowData.id
                      ? styles.surfaceSelected
                      : styles.surface
                  }
                  onPress={() => setActiveTemplate(rowData)}>
                  <Text>{rowData.name}</Text>
                </Button>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
      <Footer>
        <FooterTab
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Button full onPress={() => registerOrg()}>
            <Title>{loading ? 'Loading..' : 'Register'}</Title>
          </Button>
        </FooterTab>
      </Footer>
    </Container>
  );
}
