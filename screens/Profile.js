import React, { Component, useContext, useEffect, useState } from 'react';
import {
  Container,
  Header,
  Content,
  Tab,
  Tabs,
  Title,
  Left,
  Body,
  Right,
  Button,
  Icon,
  TabHeading,
  Text,
  Footer,
  FooterTab,
} from 'native-base';
import { Item, Label, Input } from 'native-base';
import { ScrollView } from 'react-native';
import { StyleSheet } from 'react-native';
import FirebaseContext from '../services/FirebaseContext';

export default function Profile(props) {
  const serviceContext = useContext(FirebaseContext);
  const [orgDetails, setOrgDetails] = useState();
  const [enableEdit, setEnableEdit] = useState(false);

  useEffect(() => {
    console.log('OrgDetails in profile page', props.location.state.orgDetails);
    if (props.location.state && props.location.state.orgDetails) {
      setOrgDetails(props.location.state.orgDetails);
      console.log(props.location.state.orgDetails);
    }
  }, []);

  const updateProfile = () => {
    setEnableEdit(false);
    serviceContext.database
      .updateOrg({
        ...orgDetails.org,
        lookupId: orgDetails.org.lookupId + 1,
        sender: orgDetails.sender,
      })
      .catch(_err =>
        serviceContext.setSnackMessage('OHR1001 - Unexpected error occured')
      );
    serviceContext.service.db
      .ref(`orgs/${orgDetails.org.userName.toLowerCase()}/profile`)
      .update({ ...orgDetails.org, lookupId: orgDetails.org.lookupId + 1 });
    serviceContext.service.db
      .ref(`users/${serviceContext.userName.toLowerCase()}/profile`)
      .update({
        ...orgDetails.sender,
        lookupId: orgDetails.org.lookupId + 1,
      });
  };
  const styles = StyleSheet.create({
    element: {
      marginTop: 25,
      marginRight: 10,
      marginLeft: 10,
    },
  });

  return (
    <Container>
      <Header style={{ backgroundColor: serviceContext.theme.colors.primary }}>
        <Left>
          <Button
            transparent
            onPress={() => props.history.push('/dashboard/receipts')}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
        <Body>
          <Title>Profile</Title>
        </Body>
        <Right>
          <Button transparent onPress={() => setEnableEdit(true)}>
            <Icon name="md-create" />
          </Button>
        </Right>
      </Header>
      <Content enableOnAndroid>
        <Tabs style={{ backgroundColor: serviceContext.theme.colors.primary }}>
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: serviceContext.theme.colors.primary,
                }}>
                <Text>Personal</Text>
              </TabHeading>
            }>
            <>
              {orgDetails && orgDetails.sender && (
                <ScrollView>
                  <Item floatingLabel style={styles.element}>
                    <Label>Name</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.sender.name}
                      onChangeText={_name =>
                        setOrgDetails({
                          ...orgDetails,
                          sender: { ...orgDetails.sender, name: _name },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Phone Number</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.sender.phoneNumber}
                      onChangeText={_phoneNumber =>
                        setOrgDetails({
                          ...orgDetails,
                          sender: {
                            ...orgDetails.sender,
                            phoneNumber: _phoneNumber,
                          },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Email</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.sender.email}
                      onChangeText={_email =>
                        setOrgDetails({
                          ...orgDetails,
                          sender: { ...orgDetails.sender, email: _email },
                        })
                      }
                    />
                  </Item>
                </ScrollView>
              )}
            </>
          </Tab>
          <Tab
            heading={
              <TabHeading
                style={{
                  backgroundColor: serviceContext.theme.colors.primary,
                }}>
                <Text>Organization</Text>
              </TabHeading>
            }>
            <>
              {orgDetails && orgDetails.org && (
                <ScrollView>
                  <Item floatingLabel style={styles.element}>
                    <Label>Name</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.name}
                      onChangeText={_name =>
                        setOrgDetails({
                          ...orgDetails,
                          org: { ...orgDetails.org, name: _name },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Address Line 1</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.addressLine1}
                      onChangeText={_addressLine1 =>
                        setOrgDetails({
                          ...orgDetails,
                          org: {
                            ...orgDetails.org,
                            addressLine1: _addressLine1,
                          },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Address Line 2</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.addressLine2}
                      onChangeText={_addressLine2 =>
                        setOrgDetails({
                          ...orgDetails,
                          org: {
                            ...orgDetails.org,
                            addressLine2: _addressLine2,
                          },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Country</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.registeredCountry}
                      onChangeText={_registeredCountry =>
                        setOrgDetails({
                          ...orgDetails,
                          org: {
                            ...orgDetails.org,
                            registeredCountry: _registeredCountry,
                          },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Pincode</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.pincode}
                      onChangeText={_pincode =>
                        setOrgDetails({
                          ...orgDetails,
                          org: { ...orgDetails.org, pincode: _pincode },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Phone Number</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.phoneNumber}
                      onChangeText={_phoneNumber =>
                        setOrgDetails({
                          ...orgDetails,
                          org: { ...orgDetails.org, phoneNumber: _phoneNumber },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Email</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.email}
                      onChangeText={_email =>
                        setOrgDetails({
                          ...orgDetails,
                          org: { ...orgDetails.org, email: _email },
                        })
                      }
                    />
                  </Item>
                  <Item floatingLabel style={styles.element}>
                    <Label>Website</Label>
                    <Input
                      editable={enableEdit}
                      returnKeyType="next"
                      value={orgDetails.org.website}
                      onChangeText={_website =>
                        setOrgDetails({
                          ...orgDetails,
                          org: { ...orgDetails.org, website: _website },
                        })
                      }
                    />
                  </Item>
                </ScrollView>
              )}
            </>
          </Tab>
        </Tabs>
      </Content>
      {enableEdit && (
        <Footer>
          <FooterTab
            style={{
              padding: 0,
              backgroundColor: serviceContext.theme.colors.primary,
            }}>
            <Button full onPress={() => updateProfile()}>
              <Title>Update Profile</Title>
            </Button>
          </FooterTab>
        </Footer>
      )}
    </Container>
  );
}
