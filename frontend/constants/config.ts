// // export const API_URL = "http://localhost:8080/api";
//
// import { Platform } from "react-native";
//
// const LOCAL_IP = "192.168.1.19";
//
// export const API_URL =
//     Platform.OS === "android"
//         ? "http://10.0.2.2:8080/api"
//         : `http://${LOCAL_IP}:8080/api`;

import { Platform } from "react-native";


const PUBLIC_IP = "localhost";

export const API_URL = `http://${PUBLIC_IP}:8080/api`;
