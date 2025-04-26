import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Recuperar_password from "./Recuperar_password";
import { NavigationContainer } from "@react-navigation/native";
import { ToastProvider } from 'react-native-toast-notifications'; // <-- Importar

const Stack = createStackNavigator();

export default function stack() {
  return (
    <ToastProvider> 
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Recuperar Contraseña"
            component={Recuperar_password}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
