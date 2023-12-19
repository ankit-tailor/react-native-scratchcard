import { Text } from "react-native";

import { WithSkiaWeb } from "@shopify/react-native-skia/lib/module/web";

export default function ExampleDemo() {
  return (
    <WithSkiaWeb
      getComponent={() => import("../components/ScratchCard.tsx")}
      fallback={<Text style={{ textAlign: "center" }}>Loading Skia...</Text>}
    />
  );
}
