import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  NativeRouter,
  Route,
  Link,
  BackButton,
  Redirect,
} from 'react-router-native';

import About from './About';
import AddDonar from './AddDonar';
import AddOrg from './AddOrg';
import AddReceipt from './AddReceipt';
import BuyPremium from './BuyPremium';
import ChangePassword from './ChangePassword';
import ContactSearch from './ContactSearch';
import Dashboard from './Dashboard';
import Donar from './Donar';
import Donars from './Donars';
import ForgotPassword from './ForgotPassword';
import Preview from './Preview';
import Receipt from './Receipt';
import Receipts from './Receipts';
import Settings from './Settings';
import ShareReceipt from './ShareReceipt';
import Signin from './Signin';
import Signup from './Signup';
import SplashScreen from './SplashScreen';
import Help from './Help';
import Template from './Template';
import TemplateColor from './TemplateColor';
import TemplateLogo from './TemplateLogo';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';

export default function Index() {
  const firebase = useContext(FirebaseContext);

  return (
    <NativeRouter>
      {firebase.authUser && (
        <View
          style={{
            height: Constants.statusBarHeight,
            backgroundColor: firebase.theme.colors.primary,
          }}
        />
      )}
      <BackButton>
        <Route exact path="/">
          {firebase.authUser ? (
            <Redirect to="/dashboard/receipts" />
          ) : (
            <Redirect to="/signin" />
          )}
        </Route>
        <Route exact path="/about" component={About} />
        <Route exact path="/adddonar" component={AddDonar} />
        <Route exact path="/addorg" component={AddOrg} />
        <Route exact path="/addreceipt" component={AddReceipt} />
        <Route exact path="/buypremium" component={BuyPremium} />
        <Route exact path="/changepassword" component={ChangePassword} />
        <Route exact path="/contactsearch" component={ContactSearch} />
        <Route path="/dashboard" component={Dashboard} />
        <Route exact path="/donar" component={Donar} />
        <Route exact path="/donars" component={Donars} />
        <Route exact path="/forgotpassword" component={ForgotPassword} />
        <Route exact path="/settings" component={Settings} />
        <Route exact path="/sharereceipt" component={ShareReceipt} />
        <Route exact path="/signin" component={Signin} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/preview" component={Preview} />
        <Route exact path="/receipt" component={Receipt} />
        <Route exact path="/splashscreen" component={SplashScreen} />
        <Route exact path="/help" component={Help} />
        <Route exact path="/template" component={Template} />
        <Route exact path="/templatecolor" component={TemplateColor} />
        <Route exact path="/templatelogo" component={TemplateLogo} />
      </BackButton>
    </NativeRouter>
  );
}
