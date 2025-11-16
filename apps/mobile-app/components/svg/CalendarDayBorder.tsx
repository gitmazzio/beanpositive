import React from "react";
import Svg, { Path } from "react-native-svg";

interface CalendarDayBorderProps {
  width?: number;
  height?: number;
  color?: string;
}

export const CalendarDayBorder: React.FC<CalendarDayBorderProps> = ({
  width = 45,
  height = 55,
  color = "#C8C8C8",
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 45 55" fill="none">
      <Path
        d="M43.7109 7.98242V37.3281C43.7109 40.6444 41.9572 43.714 39.1006 45.3984L26.8633 52.6133C23.9272 54.3445 20.2827 54.3445 17.3467 52.6133L5.10938 45.3984C2.25288 43.714 0.5 40.6443 0.5 37.3281V7.98242H43.7109ZM7.48242 0.5H36.7275C40.4157 0.5 43.4338 3.35956 43.6904 6.98242H0.519531C0.77609 3.35965 3.79438 0.500174 7.48242 0.5Z"
        stroke={color}
        strokeLinejoin="bevel"
        fill="none"
      />
    </Svg>
  );
};
