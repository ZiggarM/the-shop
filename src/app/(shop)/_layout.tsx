import { Redirect, Tabs } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityIndicator, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useAuth } from "../../providers/auth-provider";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ color: "#1bc464" }} {...props} />;
}

const TabsLayouts = () => {
  const { session, mounting } = useAuth();

  if (mounting) {
    return <ActivityIndicator />;
  }

  if (!session) {
    return <Redirect href="/auth" />;
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#1bc464",
          tabBarInactiveTintColor: "gray",
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: "600",
            marginBottom: Platform.OS === "android" ? 5 : 2, // Different spacing for mobile
          },
          tabBarStyle: {
            height: Platform.OS === "web" ? 50 : 60, // Shorter on web
            paddingBottom: Platform.OS === "android" ? 10 : 5, // Adjust for mobile virtual buttons
          },
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Shop",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="shopping-cart" />;
            },
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon(props) {
              return <TabBarIcon {...props} name="book" />;
            },
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
};

export default TabsLayouts;

const styles = StyleSheet.create({ safeArea: { flex: 1 } });
