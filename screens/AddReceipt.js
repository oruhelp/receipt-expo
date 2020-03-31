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
  const db = openDatabase('db');
  const serviceContext = useContext(FirebaseContext);
  const [receipt, setReceipt] = useState({
    title: '',
    id: '',
    dateTime: '',
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
    db.transaction(
      tx => {
        tx.executeSql(
          'select * from donars',
          [],
          (_, { rows }) => {
            setDonars(rows._array);
            console.log(rows._array);
          },
          err => console.log(err)
        );
      },
      null,
      this.update
    );
  };
  const shareReceipt = () => {
    db.transaction(tx => {
      tx.executeSql(
        'create table if not exists receipt (id integer primary key not null, title text, dateTime text, donarId text, donarName text, amount text, notes text, footer text);'
      );
    });
    db.transaction(
      tx => {
        console.log('Executing query');
        tx.executeSql(
          'insert into receipt (id, title, dateTime, donarId, donarName, amount, notes, footer) values (?, ?, ?, ?, ?, ?, ?, ?)',
          [
            parseInt(receipt.id, 10),
            receipt.title,
            receipt.dateTime,
            receipt.donarId.toString(),
            receipt.donarName,
            receipt.amount,
            receipt.notes,
            receipt.footer,
          ],
          (_, { rows }) => {
            console.log('Success receipt added to db');
            props.history.push({
              pathname: '/sharereceipt',
              state: { receipt: receipt },
            });
          },
          (_, error) => {
            console.log(error);
          }
        );
      },
      null,
      this.update
    );
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
                  onPress={() => (
                    setReceipt({
                      ...receipt,
                      donarId: donar.id,
                      donarName: donar.fname + ' ' + donar.lname,
                    }),
                    setDonarPicker(false)
                  )}>
                  <Body>
                    <Text>
                      {(donar.fname != null ? donar.fname : '') +
                        ' ' +
                        (donar.lname != null ? donar.lname : '')}
                    </Text>
                    {donar.orgname != null && <Text note>{donar.orgname}</Text>}
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
              <Label>Invoice Title</Label>
              <Input
                value={receipt.title}
                onChangeText={title => setReceipt({ ...receipt, title: title })}
              />
            </Item>
            <Item stackedLabel>
              <Label>Invoice Number</Label>
              <Input
                value={receipt.id}
                keyboardType={'numeric'}
                onChangeText={id => setReceipt({ ...receipt, id: id })}
              />
            </Item>
            <Item stackedLabel style={{ alignItems: 'flex-start' }}>
              <Label>Date</Label>
              <DatePicker
                defaultDate={new Date()}
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
              <Label>Notes</Label>
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
              onPress={() => showPreview()}>
              <Title>Preview</Title>
            </Button>
          </FooterTab>
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
              onPress={() => shareReceipt()}>
              <Title>Share</Title>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    </>
  );
}
