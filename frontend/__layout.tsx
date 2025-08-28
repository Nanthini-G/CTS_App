import { Tabs } from "expo-router";
import { IconSymbol } from "@/components/ui/IconSymbol";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment"
        options={{
          title: "Appointments",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="diabetes"
        options={{
          title: "Diabetes",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="drop.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="heart"
        options={{
          title: "Heart",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="heart.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={26} name="person.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
