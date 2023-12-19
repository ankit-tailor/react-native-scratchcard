import Constants from "expo-constants";
import { View, StyleSheet, Text } from "react-native";

import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export default function App() {
  return (
    <View style={styles.container}>
      <WithSkiaWeb
        getComponent={() => import("./components/ScratchCard.tsx")}
        fallback={<Text style={{ textAlign: "center" }}>Loading Skia...</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#000",
  },
});
