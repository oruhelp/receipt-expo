import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Container, Header, Content, Button, Text, Icon } from 'native-base';
import { Divider, Headline, Subheading } from 'react-native-paper';
import Constants from 'expo-constants';
import { Link } from 'react-router-native';

import FirebaseContext from '../services/FirebaseContext';

export default function SideBarContent(props) {
  const serviceContext = useContext(FirebaseContext);

  const styles = StyleSheet.create({
    container: {
      paddingTop: Constants.statusBarHeight + 50,
      backgroundColor: '#f8f8f8',
    },
    title: {
      paddingLeft: 10,
      marginTop: 20,
      marginBottom: 20,
    },
    listButton: {
      fontSize: 18,
      color: serviceContext.theme.colors.primary,
    },
    icon: {
      fontSize: 25,
      color: serviceContext.theme.colors.primary,
    },
  });
  const getUser = () => {
    serviceContext.setSnackMessage(serviceContext.userName);
  };
  return (
    <Container style={styles.container}>
      <Content>
        <View style={styles.title}>
          <Headline>
            {serviceContext.authUser &&
              serviceContext.authUser.displayName &&
              serviceContext.authUser.displayName.split('#')[1]}
          </Headline>
          <Subheading>
            {serviceContext.profile && serviceContext.profile.orgName
              ? serviceContext.profile.orgName
              : 'Org Name'}
          </Subheading>
        </View>
        <Divider />
        <Button transparent style={{ justifyContent: 'flex-start' }}>
          <Icon name="person" style={styles.icon} />
          <Text style={styles.listButton}>Profile</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: 'flex-start' }}
          onPress={() => getUser()}>
          <Icon name="person" style={styles.icon} />
          <Text style={styles.listButton}>Get User</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: 'flex-start' }}
          onPress={() => props.history.push('/settings')}>
          <Icon name="settings" style={styles.icon} />
          <Text style={styles.listButton}>Settings</Text>
        </Button>
        <Divider />
        <Button
          transparent
          style={{ justifyContent: 'flex-start' }}
          onPress={() => props.history.push('/buypremium')}>
          <Icon name="heart" style={styles.icon} />
          <Text style={styles.listButton}>Sponsor</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: 'flex-start' }}
          onPress={() => props.history.push('/help')}>
          <Icon name="help-circle" style={styles.icon} />
          <Text style={styles.listButton}>Help</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: 'flex-start' }}
          onPress={() => props.history.push('/about')}>
          <Icon name="information-circle" style={styles.icon} />
          <Text style={styles.listButton}>About</Text>
        </Button>
        <Divider />
        <Button
          style={{ justifyContent: 'flex-start' }}
          transparent
          onPress={() => {
            props.history.push('/signin');
            return serviceContext.service.doSignOut().then(() => {});
          }}>
          <Icon name="log-out" style={styles.icon} />
          <Text style={styles.listButton}>Sign Out</Text>
        </Button>
      </Content>
    </Container>
  );
}
