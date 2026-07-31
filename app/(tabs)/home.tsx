import React, { useState } from "react";
 import { Alert } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
// } from "react-native-gesture-handler";
import SwipeToConfirmModal from "@/components/checkin/SwipeToConfirmModal";
import { useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import { toggleLanguage } from "@/utils/translation";
import { useTranslation } from "react-i18next";
import BeforeCheckInOut from "@/components/checkin/BeforeCheckInOut";
import AfterCheckInOut from "@/components/checkin/AfterCheckInOut";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/libs/axios";
import { useAuth } from "@/libs/authContext";
import { SafeAreaView } from "react-native-safe-area-context";
import NoInternetWrapper from "@/components/NoInternetWrapper";
import MapView, { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

import { StatusBar as RNStatusBar } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

export default function CheckInScreen() {
  // const [activeTab, setActiveTab] = useState("home"); // State to track the active tab
  const [isShiftCompleted, setIsShiftCompleted] = useState(false);
  // const [hasPunchedIn, setHasPunchedIn] = useState(false);
  // const [hasPunchedOut, setHasPunchedOut] = useState(false);
  // const [showSwipeModal, setShowSwipeModal] = useState(false);
  // const [timer, setTimer] = useState(40); //in percentage
  // const navigation = useNavigation();
  // const { t } = useTranslation();
  const { userDetails, logout } = useAuth();
 const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  console.log("userDetails", userDetails);

  const { isLoading, isError, data, refetch } = useQuery({
    queryKey: ["get-duties-list"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/userApp/get-duties/${userDetails?.id}`
      );
      // console.log("stragtegy id: this statement executed");
      // console.log("stragtegy id: ", Object.keys(response.data?.upcomingShift));
      if (response.data?.currentShift?.isCompleted) {
        setIsShiftCompleted(true);
      } else {
        // console.log("stragtegy id: this statement executed");
        setIsShiftCompleted(false);
      }
      Toast.show({
        type: "success",
        text1: "Fetched duties data successfully.",
        visibilityTime: 5000,
        autoHide: true,
      });
      // setSelectedBacktestID(response?.data?.data?.results[0]?.id);
      return response.data;
    },
    throwOnError: async (error, query) => {
      console.log(
        "Error fetching data:",
        error.message,
        error.response.data,
        Object.keys(error.response)
      );
      // console.log("Query key:", query.queryKey);
    },
    // placeholderData: keepPreviousData,
  });

  const headerHeight = useHeaderHeight();

 
  return (
    <NoInternetWrapper>
   




      <StatusBar style="dark" backgroundColor="white" /> 
    
  <View style={styles.container}>
      <View style={styles.header}>

        <View style={styles.profileInfo}>
          <View>
            <Text style={styles.name}>{userDetails?.fullName}</Text>
            <Text style={styles.id}>BN. {userDetails?.beltNumber}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Pressable
            onPress={() => {
              toggleLanguage();
            }}
          >
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color={"#4787FF"}
            />
          </Pressable>
         
         
        

<Pressable
  onPress={() => {
    Alert.alert(
      "Confirm Logout 🚦",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive", // 🔥 red button (traffic warning feel)
          onPress: () => logout(),
        },
      ],
      { cancelable: true }
    );
  }}
>
  <MaterialCommunityIcons name="logout" size={24} color={"#CA282C"} />
</Pressable>
         
          {/* <Pressable
            onPress={() => {
              logout();
            }}
          >
            <MaterialCommunityIcons name="logout" size={24} color={"#CA282C"} />
          </Pressable> */}
        </View>
      </View>

      {isShiftCompleted ? (
        <AfterCheckInOut
          currentShiftData={data?.currentShift}
          upcomingShiftData={data?.upcomingShift}
        />
      ) : (
        <BeforeCheckInOut
          upcomingShiftData={data?.currentShift}
          setIsShiftCompleted={setIsShiftCompleted}
        />
      )}
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "white",
          borderRadius: 50,
          padding: 8,
          elevation: 5,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowRadius: 5,
          shadowOpacity: 1.0,
        }}
      >
        <Pressable
          disabled={isLoading}
          onPress={() => {
            // console.log("refetch");
            refetch();
          }}
        >
          {/* <Text>Refresh</Text>{" "} */}
          {isLoading ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            <Ionicons name="refresh-outline" size={30} color="blue" />
          )}
        </Pressable>
      </View>




</View>


    </NoInternetWrapper>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    paddingTop: 5,
    paddingLeft: 16,
    paddingRight:16,
    paddingBottom:16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  id: {
    fontSize: 12,
    color: "#888",
  },
  clockContainer: {
    alignItems: "center",
  },
  time: {
    fontSize: 32,
    fontWeight: "light",
    color: Colors.primary.textBlack,
    marginTop: 16,
  },
  date: {
    color: "#666",
    marginTop: 8,
  },
  outermostPunchinContainer: {
    // backgroundColor: "red",
  },
  punchContainer: {
    alignItems: "center",
  },
  punchButton: {
    marginTop: "auto",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#fff",
    // borderWidth: 4,
    // borderColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  punchButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9, // Reduce opacity when pressed
  },
  punchImage: {
    width: 34,
    height: 52,
    resizeMode: "contain",
  },
  punchText: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#444",
  },
  punchStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 16,
    // marginTop:"auto"
  },
  stat: {
    alignItems: "center",
  },
  statTime: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#555",
  },
  bottomTab: {
    backgroundColor: "#0c1f79",
    padding: 12,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tab: {
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: Colors.secondary.background,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingBlock: 6,
    gap: 4,
  },
  tabText: {
    // marginTop: 4,
    fontSize: 13,
    color: Colors.primary.yellowColor,
    fontWeight: "bold",
  },
  
});
