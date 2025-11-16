import React from "react";
import Svg, {
  Path,
  Defs,
  Filter,
  FeFlood,
  FeColorMatrix,
  FeOffset,
  FeGaussianBlur,
  FeComposite,
  FeBlend,
  G,
} from "react-native-svg";

interface TodayDayBackgroundProps {
  width?: number;
  height?: number;
}

export const TodayDayBackground: React.FC<TodayDayBackgroundProps> = ({
  width = 51,
  height = 62,
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 51 62" fill="none">
      <Defs>
        <Filter
          id="filter0_d_842_8932"
          x="0.488889"
          y="0.744444"
          filterUnits="userSpaceOnUse"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="1.25556" />
          <FeGaussianBlur stdDeviation="1.25556" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.0784314 0 0 0 0 0.0823529 0 0 0 0 0.101961 0 0 0 0.05 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_842_8932"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_842_8932"
            result="shape"
          />
        </Filter>
      </Defs>
      <G filter="url(#filter0_d_842_8932)">
        <Path
          d="M48 39.9949C48 43.5505 46.1202 46.8412 43.0574 48.6472L30.6019 55.9917C27.4539 57.8479 23.5461 57.8479 20.3981 55.9917L7.94258 48.6472C4.87978 46.8412 3 43.5505 3 39.9949V9.61638H48V39.9949Z"
          fill="#F1F6DE"
        />
        <Path
          d="M48 9.61638H3C3 5.40997 6.40997 2 10.6164 2H40.3836C44.59 2 48 5.40997 48 9.61638Z"
          fill="#F1F6DE"
        />
      </G>
    </Svg>
  );
};
