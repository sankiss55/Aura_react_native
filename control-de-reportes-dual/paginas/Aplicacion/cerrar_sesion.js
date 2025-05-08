import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cerrar() {
  const navigation = useNavigation(); 
  const cerrarSesion = async () => {
    await AsyncStorage.removeItem('id_tipo');
    navigation.replace('Login'); 
  };
  useEffect(() => {
    cerrarSesion();
  }, []); 

  return null; 
}
