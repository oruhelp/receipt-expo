import React, { useState } from 'react';
import { Text } from 'react-native';

export default function AdjustLabel({
  fontSize,
  text,
  style,
  numberOfLines = 1,
}) {
  const [currentFont, setCurrentFont] = useState(fontSize);

  return (
    <Text
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit
      style={[style, { fontSize: currentFont }]}
      onTextLayout={e => {
        const { lines } = e.nativeEvent;
        if (lines.length > numberOfLines) {
          setCurrentFont(currentFont - 1);
        }
      }}>
      {text}
    </Text>
  );
}
