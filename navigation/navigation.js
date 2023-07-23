import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Homepage from "../pages/homePage";
import Moviescreen from "../pages/Moviescreen";
import PersonScreen from "../pages/persons";
import SearchScreen from "../pages/search";

const Stack = createNativeStackNavigator();
export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Homepage} />
        <Stack.Screen name="Movie" component={Moviescreen} />
        <Stack.Screen name="person" component={PersonScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
