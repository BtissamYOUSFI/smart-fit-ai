import { StyleSheet, View } from 'react-native';
import LoginPage from "@/app/auth/login";
import { Redirect } from "expo-router";

export default function HomeScreen() {
  // return (
  //   <View>
  //     <LoginPage />
  //   </View>
  // );
    return <Redirect href="/auth/splash" />;
}
const styles = StyleSheet.create({});