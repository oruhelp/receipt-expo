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
  const [userName, setUserName] = useState(null);
  const [snackMessage, setSnackMessage] = useState('');
  const [profile, setProfile] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [database, setDatabase] = useState(null);
  const firebase = new Firebase();

  useEffect(() => {
    this.listener = firebase.auth.onAuthStateChanged(_authUser => {
      if (_authUser) {
        setAuthUser(_authUser);
        if (_authUser.displayName != '') {
          setUserName(_authUser.displayName.split('#')[0]);
        }
        if (database == null) {
          setDatabase(new Database(_authUser.uid));
        }
      } else {
        setAuthUser(null);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (database == null && authUser != null) {
      setDatabase(new Database(authUser.uid));
    }
  }, []);
  const refreshDatabase = () => {
    if (database == null) {
      setDatabase(new Database(authUser.uid));
    }
  };
  return loading ? (
    <SplashScreen />
  ) : (
    <FirebaseContext.Provider
      value={{
        service: firebase,
        database: database,
        refreshDatabase: refreshDatabase,
        userName: userName,
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
            style={{
              backgroundColor: theme.colors.primary,
              borderWidth: 1,
              borderColor: theme.colors.xprimary,
            }}
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
