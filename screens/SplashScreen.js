import React, { useContext } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';

export default function AssetExample() {
  return (
    <View style={styles.container}>
      <Text
        style={{
          alignSelf: 'center',
          fontSize: 40,
          marginTop: 20,
          marginBottom: 20,
          color: '#29264E',
        }}>
        OruHelp
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});
