import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Avatar } from 'react-native-paper';
import {
  Container,
  Header,
  Item,
  Input,
  Content,
  Footer,
  FooterTab,
  Button,
  Icon,
  Text,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
  Title,
} from 'native-base';
import { View } from 'react-native';
import Constants from 'expo-constants';
import Drawer from 'react-native-drawer';

import SideBarContent from '../components/Drawer';
import FirebaseContext from '../services/FirebaseContext';
import Receipts from './Receipts';
import Donars from './Donars';
import { NativeRouter, Route, Link, BackButton } from 'react-router-native';

export default function Dashboard(props) {
  const [orgDetails, setOrgDetails] = useState();
  const [activeTab, setActiveTab] = useState();
  const serviceContext = useContext(FirebaseContext);

  useEffect(() => {
    if (serviceContext.database == null) {
      serviceContext.refreshDatabase();
    }
    if (serviceContext.database != null) {
      serviceContext.database.getActiveOrg().then(_res => {
        if (_res.rows._array.length == 0) {
          props.history.push('/addorg');
        }
      });
    }
  }, []);

  useEffect(() => {
    serviceContext.database
      .getActiveOrg()
      .then(res => {
        const _detailsFromDB = res.rows._array[0];
        const _value = {
          sender: {
            name: _detailsFromDB.senderName,
            role: _detailsFromDB.role,
            phoneNumber: _detailsFromDB.senderPhoneNumber,
            email: _detailsFromDB.senderEmail,
          },
          org: {
            name: _detailsFromDB.name,
            addressLine1: _detailsFromDB.addressLine1,
            addressLine2: _detailsFromDB.addressLine2,
            registeredCountry: _detailsFromDB.registeredCountry,
            pincode: _detailsFromDB.pincode,
            countryAndPincode:
              _detailsFromDB.registeredCountry + ',' + _detailsFromDB.pincode,
            phoneNumber: _detailsFromDB.phoneNumber
              ? _detailsFromDB.phoneNumber
              : '',
            email: _detailsFromDB.email ? _detailsFromDB.email : '',
            website: _detailsFromDB.website ? _detailsFromDB.website : '',
            logoSrc: _detailsFromDB.logoSrc,
            lastAutoReceiptNo: _detailsFromDB.lastAutoReceiptNo,
            userName: _detailsFromDB.userName,
            registeredDate: _detailsFromDB.registeredDate,
            registeredNumber: _detailsFromDB.registeredNumber,
            templateName: _detailsFromDB.templateName,
            lookupId: _detailsFromDB.lookupId,
          },
        };
        setOrgDetails(_value);
      })
      .catch(err => {
        // !userDetails &&
        //   serviceContext.service.db
        //     .ref('/users/' + serviceContext.userName + '/profile/')
        //     .once('value')
        //     .then(function(snapshot) {
        //       setReceiptDetails({
        //         ...receiptDetails,
        //         sender: { ...receiptDetails.sender, ...snapshot },
        //       });
        //     });
      });
  }, []);

  const closeControlPanel = () => {
    this._drawer.close();
  };
  const openControlPanel = () => {
    this._drawer.open();
  };

  const styles = StyleSheet.create({
    main: {
      paddingLeft: 3,
    },
    fab: {
      position: 'absolute',
      margin: 25,
      right: 0,
      bottom: 50,
      backgroundColor: serviceContext.theme.colors.primary,
    },
  });

  return (
    <Drawer
      type="overlay"
      tapToClose={true}
      openDrawerOffset={0.3} // 20% gap on the right side of drawer
      panCloseMask={0.2}
      closedDrawerOffset={-3}
      styles={[styles.drawer, styles.main]}
      tweenHandler={ratio => ({
        main: { opacity: (2 - ratio) / 2 },
      })}
      ref={ref => (this._drawer = ref)}
      content={<SideBarContent {...props} orgDetails={orgDetails} />}>
      <Container>
        <Header
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Left>
            <Button transparent onPress={() => openControlPanel()}>
              <Icon name="menu" />
            </Button>
          </Left>
          <Body>
            <Title>{activeTab === 'receipts' ? 'Receipts' : 'Donars'}</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <Route
            path="/dashboard/receipts"
            exact={true}
            component={() => {
              setActiveTab('receipts');
              return <Receipts {...props} orgDetails={orgDetails} />;
            }}
          />
          <Route
            path="/dashboard/donars"
            exact={true}
            component={() => {
              setActiveTab('donars');
              return <Donars {...props} orgDetails={orgDetails} />;
            }}
          />
        </Content>
        <FAB
          style={styles.fab}
          icon={() => (
            <Icon style={{ marginLeft: 3, color: '#fff' }} name="add" />
          )}
          onPress={() =>
            activeTab === 'receipts'
              ? props.history.push({
                  pathname: '/addreceipt',
                  state: {
                    orgDetails: orgDetails,
                  },
                })
              : props.history.push({
                  pathname: '/adddonar',
                  state: {
                    orgDetails: orgDetails,
                  },
                })
          }
        />
        <Footer>
          <FooterTab
            style={{
              padding: 0,
              backgroundColor:
                activeTab === 'receipts'
                  ? serviceContext.theme.colors.primary
                  : serviceContext.theme.colors.xprimary,
            }}>
            <Button
              style={{
                borderRadius: 0,
                backgroundColor: serviceContext.theme.colors.xprimary,
                margin: 0,
                marginTop: 2,
              }}
              vertical
              active={activeTab === 'receipts'}
              onPress={() => {
                activeTab != 'receipts' &&
                  props.history.push(`/dashboard/receipts`);
              }}>
              <Icon
                name="document"
                style={{
                  color: serviceContext.theme.colors.primary,
                }}
              />
              <Text
                style={{
                  color: serviceContext.theme.colors.primary,
                }}>
                Receipts
              </Text>
            </Button>
          </FooterTab>
          <FooterTab
            style={{
              padding: 0,
              backgroundColor:
                activeTab === 'donars'
                  ? serviceContext.theme.colors.primary
                  : serviceContext.theme.colors.xprimary,
            }}>
            <Button
              style={{
                borderRadius: 0,
                backgroundColor: serviceContext.theme.colors.xprimary,
                margin: 0,
                marginTop: 2,
              }}
              vertical
              active={activeTab === 'donars'}
              onPress={() => {
                activeTab != 'donars' &&
                  props.history.push(`/dashboard/donars`);
              }}>
              <Icon
                name="people"
                style={{
                  color: serviceContext.theme.colors.primary,
                }}
              />
              <Text
                style={{
                  color: serviceContext.theme.colors.primary,
                }}>
                Donars
              </Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </Drawer>
  );
}
