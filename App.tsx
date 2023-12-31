import Constants from "expo-constants";
import { View, StyleSheet, Text } from "react-native";
import { ScratchCard } from "./components";

export default function App() {
  return (
    <View style={styles.container}>
      <ScratchCard />
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
