import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// import your screens
import LoginScreen from "../LoginScreen";
import RegisterScreen from "../RegisterScreen";
import AppointmentScreen from "./AppointmentScreen";
import ProfileScreen from "./ProfileScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

//  Dashboard uses bottom tabs
function DashboardTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Appointment" component={AppointmentScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/*  Dashboard points to the Tab Navigator */}
        <Stack.Screen
          name="Dashboard"
          component={DashboardTabs}
          options={{ headerShown: false }} // hides the extra stack header on top of tabs
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
