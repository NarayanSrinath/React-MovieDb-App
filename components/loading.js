import { View, Text, Dimensions } from "react-native";
import React from "react";
import * as Progress from "react-native-progress";
import { theme } from "../theme";

export default function Loading() {
  var { width, height } = Dimensions.get("window");
  return (
    <View
      style={{ height, width }}
      className=" absolute flex-row justify-center items-center"
    >
      <Progress.CircleSnail
        thickness={12}
        size={160}
        color={theme.background}
      />
    </View>
  );
}
