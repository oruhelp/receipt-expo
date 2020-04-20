import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, View, ImageBackground, Dimensions } from "react-native";
import { Container, Header, Content, Button, Text, Icon } from "native-base";
import { Divider, Headline, Subheading } from "react-native-paper";
import { Avatar, Card, Title, Paragraph } from "react-native-paper";
import Constants from "expo-constants";
import { Link } from "react-router-native";

import FirebaseContext from "../services/FirebaseContext";
import AdjustLabel from "../components/AdjustLabel";

export default function SideBarContent(props) {
  const serviceContext = useContext(FirebaseContext);
  const [profile, setProfile] = useState();

  useEffect(() => {
    serviceContext.database
      .getActiveOrg()
      .then((_res) => {
        setProfile({
          userDisplayName: _res.rows._array[0].senderName,
          logoSrc: _res.rows._array[0].logoSrc,
          orgName: _res.rows._array[0].name,
        });
      })
      .catch((_err) => console.log("Error in Drawer constructoru", _err));
  }, []);
  const styles = StyleSheet.create({
    title: {
      color: "white",
      fontSize: 20,
    },
    orgTitle: {
      color: "white",
      fontSize: 15,
    },
    backImage: {
      height: Math.round(Dimensions.get("window").height) * 0.2,
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      backgroundColor: serviceContext.theme.colors.primary,
      margin: 0,
      padding: 0,
      paddingBottom: 10,
    },
    container1: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 0,
      margin: 0,
    },
    container: {
      backgroundColor: serviceContext.theme.colors.xprimary,
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
  return (
    <Container style={styles.container}>
      <Content>
        <View style={styles.container1}>
          <ImageBackground style={styles.backImage}>
            <Text style={styles.title}>
              {profile && profile.userDisplayName}
            </Text>
            <Text style={styles.orgTitle}>{profile && profile.orgName}</Text>
          </ImageBackground>
        </View>
        <Divider />
        <Button
          transparent
          style={{ justifyContent: "flex-start" }}
          onPress={() =>
            props.history.push({
              pathname: "/profile",
              state: { orgDetails: props.orgDetails },
            })
          }
        >
          <Icon name="person" style={styles.icon} />
          <Text style={styles.listButton}>Profile</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: "flex-start" }}
          onPress={() => props.history.push("/settings")}
        >
          <Icon name="settings" style={styles.icon} />
          <Text style={styles.listButton}>Settings</Text>
        </Button>
        <Divider />
        <Button
          transparent
          style={{ justifyContent: "flex-start" }}
          onPress={() => props.history.push("/help")}
        >
          <Icon name="help-circle" style={styles.icon} />
          <Text style={styles.listButton}>FAQs</Text>
        </Button>
        <Button
          transparent
          style={{ justifyContent: "flex-start" }}
          onPress={() => props.history.push("/about")}
        >
          <Icon name="information-circle" style={styles.icon} />
          <Text style={styles.listButton}>About</Text>
        </Button>
        <Divider />
        <Button
          style={{ justifyContent: "flex-start" }}
          transparent
          onPress={() => {
            props.history.push("/signin");
            return serviceContext.service.doSignOut().then(() => {});
          }}
        >
          <Icon name="log-out" style={styles.icon} />
          <Text style={styles.listButton}>Sign Out</Text>
        </Button>
      </Content>
    </Container>
  );
}
