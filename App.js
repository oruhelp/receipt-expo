import React, { useState, useEffect } from 'react';
import { NativeRouter, Route } from 'react-router-native';
import { Snackbar } from 'react-native-paper';
import * as Contacts from 'expo-contacts';
import * as Permissions from 'expo-permissions';
import { Keyboard, View } from 'react-native';
import Firebase from './services/firebase';
import Database from './services/database';
import FirebaseContext from './services/FirebaseContext';
import Index from './screens/Index';
import SplashScreen from './screens/SplashScreen';
import { theme } from './constants/theme';

export default function App() {
  const [authUser, setAuthUser] = useState(null);
  const [snackMessage, setSnackMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(true);
  const firebase = new Firebase();

  useEffect(() => {
    this.listener = firebase.auth.onAuthStateChanged(_authUser => {
      if (_authUser) {
        setAuthUser(_authUser);
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });
    if (contacts == null) {
      (async () => {
        const { status } = await Permissions.getAsync(Permissions.CONTACTS);
        if (status === 'granted') {
          const { data } = await Contacts.getContactsAsync({
            fields: [
              Contacts.PHONE_NUMBERS,
              Contacts.Fields.Emails,
              Contacts.Fields.UrlAddrFirebaseContextesses,
            ],
          });

          if (data.length > 0) {
            setContacts(data);
          }
        }
      })();
    }
  });
  return loading ? (
    <SplashScreen />
  ) : (
    <FirebaseContext.Provider
      value={{
        service: firebase,
        authUser: authUser,
        profile: profile,
        setProfile: setProfile,
        setSnackMessage: setSnackMessage,
        contacts: contacts,
        theme: theme,
      }}>
      <NativeRouter>
        <Route exact path="/" component={Index} />
        {(snackMessage != '' && Keyboard.dismiss()) || (
          <Snackbar
            style={{ backgroundColor: theme.colors.primary }}
            visible={snackMessage != ''}
            duration={Snackbar.DURATION_SHORT}
            onDismiss={() => setSnackMessage('')}
            action={{
              label: 'Okay',
              onPress: () => setSnackMessage(''),
            }}>
            {snackMessage}
          </Snackbar>
        )}
      </NativeRouter>
    </FirebaseContext.Provider>
  );
}
