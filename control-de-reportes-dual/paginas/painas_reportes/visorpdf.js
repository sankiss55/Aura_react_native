import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";

export default function VisorPDF() {
  const googleViewerUrl = "https://drive.google.com/viewerng/viewer?embedded=true&url=https://yofibox.com/api_aura/archivos/santy-2.pdf";

  return (
    <View style={{ flex: 1 }}>
      <WebView
        source={{ uri: googleViewerUrl }}
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
