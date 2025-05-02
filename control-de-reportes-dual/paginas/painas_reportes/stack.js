import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { ToastProvider } from 'react-native-toast-notifications';
import Ciclos_escolares from "./ciclos_escolares";
import Grupos from "./grupos";
import Reportes from "./reportes";
import Semanas from "./semanas";
import Alumnos from "./alumnos";
import VisorPDFs from "./visorpdf";
const Stack = createStackNavigator();

export default function stack() {
  return (
    <ToastProvider> 
        <Stack.Navigator>
          <Stack.Screen
            name="Ciclo escolar"
            component={Ciclos_escolares}
            options={{headerShown:false}}
          />
          <Stack.Screen
            name="Grupos"
            
            options={{headerShown:false}}
            component={Grupos}
          /> 
          <Stack.Screen
          name="All_alumnos"
          
          options={{headerShown:false}}
          component={Alumnos}
        />
        
        <Stack.Screen
          name="Semanas"
          
          options={{headerShown:false}}
          component={Semanas}
        />
         <Stack.Screen
          name="Reportes"
          
          options={{headerShown:false}}
          component={Reportes}
        />
        <Stack.Screen
          name="VisorPDF"
          
          options={{headerShown:false}}
          component={VisorPDFs}
        />
        </Stack.Navigator>
    </ToastProvider>
  );
}
