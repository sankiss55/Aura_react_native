import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";

export default function VisorPDF({ route }) {
  const { uri_p } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: uri_p }}
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
