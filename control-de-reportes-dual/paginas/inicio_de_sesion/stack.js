import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ToastProvider } from 'react-native-toast-notifications'; // <-- Importar
import drawer from "../Aplicacion/drawer";
import Login from "./Login";
import Recuperar_password from "./Recuperar_password";
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
          <Stack.Screen
          name="drawer"
          component={drawer}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </ToastProvider>
  );
}
