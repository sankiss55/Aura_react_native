import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";

export default function VisorPDF({ route }) {
  const { uri } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: `https://docs.google.com/viewer?url=https://tikisweb.42web.io/santy.pdf` }}
        style={styles.webview}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
