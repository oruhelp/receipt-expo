import React, {useContext} from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function AssetExample() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={require('../assets/oruhelp-logo.png')} />
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  logo: {
    height: 128,
    width: 128,
  }
});
