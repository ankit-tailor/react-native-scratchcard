import { Image, useImage } from "@shopify/react-native-skia";
import React from "react";

interface ScratcherImageProps {
  source: string;
  height: number;
  width: number;
}

const ScratcherImage = ({ source, height, width }: ScratcherImageProps) => {
  const loadedImage = useImage(source);

  return (
    <Image
      image={loadedImage}
      x={0}
      y={0}
      fit="cover"
      height={height}
      width={width}
    />
  );
};

export default ScratcherImage;
