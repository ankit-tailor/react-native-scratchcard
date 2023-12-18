import {
  Canvas,
  Group,
  Image,
  Mask,
  Path,
  SkPath,
  Skia,
  TouchInfo,
  Vertices,
  useCanvasRef,
  useImage,
  useTouchHandler,
  vec,
} from "@shopify/react-native-skia";
import React, { useCallback, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { svgPathProperties } from "svg-path-properties";

export const ScratchCard = ({ brushSize = 20 }: any) => {
  const coverImage = useImage(
    "https://pbs.twimg.com/media/FZ249SNUYAAxes7.jpg"
  );

  const [paths, setPaths] = useState<SkPath[]>([]);
  const pathRef = useRef<SkPath>(Skia.Path.Make()).current;
  const [autoReveal, setAutoReveal] = useState(false);

  const onDrawingStart = useCallback((touchInfo: TouchInfo) => {
    setPaths((old) => {
      const { x, y } = touchInfo;
      const newPath = Skia.Path.Make();
      newPath.moveTo(x, y);
      return [...old, newPath];
    });
  }, []);

  const onDrawingActive = useCallback((touchInfo: TouchInfo) => {
    const pathSvgString = pathRef?.toSVGString();
    const pathProperties = new svgPathProperties(pathSvgString);

    const totalArea = pathProperties.getTotalLength() * brushSize;

    const currentPercentage = (totalArea / (300 * 300)) * 100;

    if (currentPercentage > 60) {
      setAutoReveal(true);
    } else {
      setPaths((currentPaths) => {
        const { x, y } = touchInfo;
        const currentPath = currentPaths[currentPaths.length - 1];
        const lastPoint = currentPath.getLastPt();
        const xMid = (lastPoint.x + x) / 2;
        const yMid = (lastPoint.y + y) / 2;

        currentPath.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
        pathRef.quadTo(lastPoint.x, lastPoint.y, xMid, yMid);
        return [...currentPaths.slice(0, currentPaths.length - 1), currentPath];
      });
    }
  }, []);

  const touchHandler = useTouchHandler(
    {
      onActive: onDrawingActive,
      onStart: onDrawingStart,
    },
    [onDrawingActive, onDrawingStart]
  );

  const vertices = [vec(0, 0), vec(300, 0), vec(300, 300), vec(0, 300)];
  const colors = ["#61DAFB", "#fb61da", "#dafb61", "#61fbcf"];
  const triangle1 = [0, 1, 2];
  const triangle2 = [0, 2, 3];
  const indices = [...triangle1, ...triangle2];

  return (
    <View style={{ height: 300, width: 300 }}>
      <Canvas style={{ flex: 1 }} onTouch={touchHandler}>
        {!autoReveal ? (
          <Vertices
            style={"fill"}
            vertices={vertices}
            colors={colors}
            indices={indices}
          />
        ) : (
          <Image
            image={coverImage}
            x={0}
            y={0}
            fit="cover"
            height={300}
            width={300}
          />
        )}
        <Mask
          mode="luminance"
          mask={
            <Group>
              {paths.map((path, index) => {
                return (
                  <Path
                    key={`${path.toSVGString()}-${index}`}
                    path={path}
                    color={"white"}
                    style={"stroke"}
                    strokeWidth={brushSize}
                    strokeJoin={"miter"}
                    strokeCap={"square"}
                    invertClip
                  />
                );
              })}
            </Group>
          }
        >
          <Image
            image={coverImage}
            x={0}
            y={0}
            fit="cover"
            height={300}
            width={300}
          />
        </Mask>
      </Canvas>
    </View>
  );
};

export default ScratchCard;

const style = StyleSheet.create({
  container: {
    height: 300,
    width: 300,
  },
});
