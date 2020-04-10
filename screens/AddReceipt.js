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
  Input,
  DatePicker,
} from 'native-base';
import { Overlay } from 'react-native-elements';
import { Paragraph } from 'react-native-paper';
import { List, ListItem, Thumbnail } from 'native-base';
import { StyleSheet, Alert } from 'react-native';
import Constants from 'expo-constants';
import FirebaseContext from '../services/FirebaseContext';
import { NativeRouter, Route, Link } from 'react-router-native';
import { openDatabase } from 'expo-sqlite';

export default function AddReceipt(props) {
  const serviceContext = useContext(FirebaseContext);
  const [receipt, setReceipt] = useState({
    number: '',
    dateTime: new Date().toString(),
    donarId: '',
    donarName: '',
    amount: '',
    notes: 'Donation',
    footer: 'Thank you for your contribution.',
  });
  const [donarPicker, setDonarPicker] = useState(false);
  const [donars, setDonars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoReceiptNumber, setAutoReceiptNumber] = useState(true);
  const showPreview = () => {
    props.history.push({
      pathname: '/preview',
      state: { receipt: receipt },
    });
  };

  useEffect(() => {
    serviceContext.database.getDonars().then(res => {
      if (res.rows._array.length < 1) {
        Alert.alert(
          'No Donars',
          'No donars available, please add a donar first.',
          [
            {
              text: 'Cancel',
              onPress: () => props.history.push('/dashboard/receipts'),
              style: 'cancel',
            },
            { text: 'OK', onPress: () => props.history.push('/adddonar') },
          ],
          { cancelable: false }
        );
      }
    });
  }, []);

  useEffect(() => {
    setReceipt({
      ...receipt,
      number:
        props.location.state &&
        props.location.state.orgDetails &&
        props.location.state.orgDetails.org.lastAutoReceiptNo.toString(),
    });
  }, []);

  const validate = () => {
    if (receipt.number == '') {
      serviceContext.setSnackMessage('Receipt number should not be empty');
      return false;
    }
    if (receipt.dateTime == '') {
      serviceContext.setSnackMessage('Date should not be empty');
      return false;
    }
    if (receipt.donarId == '' || receipt.donarName == '') {
      serviceContext.setSnackMessage('Donar should be selected');
      return false;
    }
    if (receipt.amount == '') {
      serviceContext.setSnackMessage('Amount should not be empty');
      return false;
    }
    if (!/^\d+$/.test(receipt.amount)) {
      serviceContext.setSnackMessage('Amount should be numbers only');
      return false;
    }
    if (receipt.notes == '') {
      serviceContext.setSnackMessage('Description should not be empty');
      return false;
    }
    return true;
  };

  const loadDonars = () => {
    setDonarPicker(true);
    serviceContext.database
      .getDonars()
      .then(res => {
        setDonars(res.rows._array);
      })
      .catch(err => console.log(err));
  };
  const addReceipt = () => {
    if (!validate() || loading) {
      return;
    }
    setLoading(true);
    serviceContext.database
      .addReceipt(receipt)
      .then(res => {
        if (autoReceiptNumber) {
          serviceContext.database
            .updateReceiptNumber(parseInt(receipt.number) + 1)
            .then(() => {
              setLoading(false);
              props.history.push('/dashboard/receipts');
            })
            .catch(_err => {
              setLoading(false);
              props.history.push('/dashboard/receipts');
            });
        } else {
          setLoading(false);
          props.history.push('/dashboard/receipts');
        }
      })
      .catch(err => {
        setLoading(false);
        console.log(err);
      });
  };
  return (
    <>
      <Overlay
        isVisible={donarPicker}
        onBackdropPress={() => setDonarPicker(false)}>
        <List>
          {donars &&
            donars.length > 0 &&
            donars.map(donar => {
              return (
                <ListItem
                  key={donar.id}
                  onPress={() => {
                    setReceipt({
                      ...receipt,
                      donarId: donar.id,
                      donarName: donar.name,
                    });
                    setDonarPicker(false);
                  }}>
                  <Body>
                    <Text>{donar.name}</Text>
                  </Body>
                </ListItem>
              );
            })}
        </List>
      </Overlay>
      <Container>
        <Header
          style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Left>
            <Button transparent onPress={() => props.history.goBack()}>
              <Icon name="close" />
            </Button>
          </Left>
          <Body>
            <Title>Add Receipt</Title>
          </Body>
          <Right />
        </Header>
        <Content enableOnAndroid>
          <Form>
            <Item stackedLabel>
              <Label>Invoice Number</Label>
              <Input
                value={receipt.number}
                keyboardType={'numeric'}
                onChangeText={_number => {
                  setAutoReceiptNumber(false);
                  setReceipt({ ...receipt, number: _number });
                }}
              />
            </Item>
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Date</Label>
              <DatePicker
                defaultDate={new Date(receipt.dateTime)}
                modalTransparent={false}
                animationType={'fade'}
                androidMode={'default'}
                textStyle={{ paddingLeft: 0 }}
                placeHolderTextStyle={{ color: 'red' }}
                onDateChange={date =>
                  setReceipt({ ...receipt, dateTime: date.toString() })
                }
              />
            </Item>
            <Item stackedLabel onPress={() => loadDonars()}>
              <Label>Donar</Label>
              <Input value={receipt.donarName} editable={false} />
            </Item>
            <Item stackedLabel>
              <Label>Amount</Label>
              <Input
                keyboardType={'number-pad'}
                value={receipt.amount}
                onChangeText={amount =>
                  setReceipt({ ...receipt, amount: amount })
                }
              />
            </Item>
            <Item stackedLabel>
              <Label>Description</Label>
              <Input
                value={receipt.notes}
                onChangeText={notes => setReceipt({ ...receipt, notes: notes })}
              />
            </Item>
            <Item stackedLabel>
              <Label>Footer</Label>
              <Input
                value={receipt.footer}
                onChangeText={footer =>
                  setReceipt({ ...receipt, footer: footer })
                }
              />
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
              style={{
                padding: 0,
                backgroundColor: serviceContext.theme.colors.primary,
              }}
              onPress={() => addReceipt()}>
              <Title>{loading ? 'Loading...' : 'Add Receipt'}</Title>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
}
