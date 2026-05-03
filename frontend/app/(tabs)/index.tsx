import { StyleSheet, View } from 'react-native';
import LoginPage from "@/app/(tabs)/pages/auth/login";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  // return (
  //   <View>
  //     <LoginPage />
  //   </View>
  // );
    return <Redirect href="/(tabs)/pages/auth/splash" />;
}
const styles = StyleSheet.create({});