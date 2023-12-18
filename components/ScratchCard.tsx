import {
  Canvas,
  Group,
  Mask,
  Path,
  Rect,
  SkPath,
  Skia,
  TouchInfo,
  useTouchHandler,
} from "@shopify/react-native-skia";
import React, { useCallback, useRef, useState } from "react";
import { svgPathProperties } from "svg-path-properties";
import Scratcher from "./Scratcher";
import ScratcherImage from "./ScratcherImage";

interface ScratchCardProps {
  brushSize?: number;
  image: string;
  height?: number;
  width?: number;
  percentage?: number;
}

export const ScratchCard = ({
  brushSize = 20,
  image,
  height = 300,
  width = 300,
  percentage = 60,
}: ScratchCardProps) => {
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

    const currentPercentage = (totalArea / (height * width)) * 100;

    if (currentPercentage > percentage) {
      setAutoReveal(true);
      setPaths([]);
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

  return (
    <Canvas style={{ height, width }} onTouch={touchHandler}>
      {!autoReveal && <Scratcher height={height} width={width} />}
      <Mask
        mode="luminance"
        mask={
          <Group>
            {!autoReveal ? (
              paths.map((path, index) => {
                return (
                  <Path
                    key={`${path.toSVGString()}-${index}`}
                    path={path}
                    color={"white"}
                    style={"stroke"}
                    strokeWidth={brushSize}
                    invertClip
                  />
                );
              })
            ) : (
              <Rect x={0} y={0} width={width} height={height} color="white" />
            )}
          </Group>
        }
      >
        <ScratcherImage source={image} height={height} width={width} />
      </Mask>
    </Canvas>
  );
};

export default ScratchCard;
