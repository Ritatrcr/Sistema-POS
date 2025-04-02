import { Redirect } from "expo-router";
import 'react-native-get-random-values'; // Import the polyfill

import { Text, View } from "react-native";

export default function Index() {
  return (
    <Redirect href="./auth" />
  );
}
