import { createDrawerNavigator } from "@react-navigation/drawer";
import Inicio from "./Inicio";
import Grupo from "./grupos";
import Alumnos from "./alumnos";
import Reportes from "./reportes";
import Semanas from "./semanas";
import Usuarios from "./usuarios";
import Icon from 'react-native-vector-icons/Ionicons';
import Arreglos from "./arreglos";
import { useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import stack from "../inicio_de_sesion/stack";
import Ciclo_escolar from "./ciclo escolar";
import Toast from 'react-native-toast-message';
import stack from "../painas_reportes/stack";
const Drawers = createDrawerNavigator();

export default function Drawer() {
  const [idTipo, setIdTipo] = useState(null);

  useEffect(() => {
    const obtenerTipo = async () => {
      const tipo = await AsyncStorage.getItem('id_tipo');
      setIdTipo(parseInt(tipo));
    };
    obtenerTipo();
  }, []);

  if (idTipo === null) {
    return null;
  }
  return (
    <>
      <Drawers.Navigator
        screenOptions={{
          swipeEnabled: true,
          gestureEnabled: true,
          drawerType: 'front',
          edgeWidth: 50,
          headerStyle: {
            backgroundColor: 'rgb(38, 133, 12)',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 20,
          },
          drawerStyle: {
            backgroundColor: '#F2F2F2',
            width: 260,
          },
          drawerActiveTintColor: '#36D96F',
          drawerInactiveTintColor: '#025908',
          drawerLabelStyle: {
            fontFamily: 'Poppins_400Regular',
            fontSize: 16,
            marginLeft: -10,
          },
          drawerItemStyle: {
            marginVertical: 5,
          },
        }}
      >
        <Drawers.Screen
          name="Inicio"
          component={stack}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="document-text-outline" color={color} size={size} />
            ),
          }}
        />
          <Drawers.Screen
          name="Ciclo escolar"
          component={Ciclo_escolar}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="school-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawers.Screen
          name="Grupos"
          component={Grupo}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="people-outline" color={color} size={size} />
            ),
          }}
        />
        <Drawers.Screen
          name="Alumnos"
          component={Alumnos}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="school-outline" color={color} size={size} />
            ),
          }}
        />
        
        <Drawers.Screen
          name="Semanas"
          component={Semanas}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="calendar-outline" color={color} size={size} />
            ),
          }}
        />
       
        {idTipo == 1 && (
          <Drawers.Screen
            name="Usuarios"
            component={Usuarios}
            options={{
              drawerIcon: ({ color, size }) => (
                <Icon name="person-outline" color={color} size={size} />
              ),
            }}
          />
        )}
        <Drawers.Screen
          name="Arreglos"
          component={Arreglos}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="people-outline" color={color} size={size} />
            ),
          }}
        />
        {/* <Drawers.Screen
        name="Cerrar Sesión"
        component={stack} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Icon name="log-out-outline" color={color} size={size} />
          ),
        }}
      />
       */}
      </Drawers.Navigator>
  
      <Toast />
    </>
  );
  
}
