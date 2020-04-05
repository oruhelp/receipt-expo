import React, { Component, useState, useContext } from 'react';
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
import { StyleSheet } from 'react-native';
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
    notes: '',
    footer: '',
  });
  const [donarPicker, setDonarPicker] = useState(false);
  const [donars, setDonars] = useState([]);
  const showPreview = () => {
    props.history.push({
      pathname: '/preview',
      state: { receipt: receipt },
    });
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
    serviceContext.database
      .addReceipt(receipt)
      .then(res => {
        props.history.push('/dashboard/receipts');
      })
      .catch(err => console.log(err));
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
                    console.log(donar);
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
        <Content>
          <Form>
            <Item stackedLabel>
              <Label>Invoice Number</Label>
              <Input
                value={receipt.number}
                keyboardType={'numeric'}
                onChangeText={_number =>
                  setReceipt({ ...receipt, number: _number })
                }
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
              <Title>Add Receipt</Title>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
}
