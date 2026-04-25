import {Button, StyleSheet, Text, View} from 'react-native';
import {useState} from "react";
import LoginPage from "@/app/(tabs)/pages/auth/login";



export default function HomeScreen() {
  const [count, setCount]= useState(0);
  function increment() {
    setCount(count + 1);
  }
  return (
      <View>
        <LoginPage></LoginPage>
      </View>
  );
}

const styles = StyleSheet.create({

});
