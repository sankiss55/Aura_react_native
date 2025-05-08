import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import { useNavigation } from '@react-navigation/native'; 
import { useFocusEffect } from '@react-navigation/native';

import { API_URL } from "../../otros/configuracion";

export default function Ciclos_escolares_all() {
  const [ciclos, setCiclos] = useState([]);
  const navigation = useNavigation(); 

  useFocusEffect(
        React.useCallback(() => {
    axios.post(`${API_URL}/all_ciclos_escolar.php`)
      .then(respuesta => {
        setCiclos(respuesta.data.usuarios);
      })
      .catch(error => {
        console.log(error);
      });
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Ciclos Escolares</Text>
     <ScrollView contentContainerStyle={styles.container}>
  {ciclos
    .map((ciclo) => (
      <TouchableOpacity
        key={ciclo.id_ciclo}
        style={styles.button}
        onPress={() => navigation.navigate("Grupos", { idCiclo: ciclo.id_ciclo })}
      >
        <Icon name="folder" size={24} color="#555" style={styles.icon} />
        <Text style={styles.text}>{ciclo.nombre_ciclo}</Text>
      </TouchableOpacity>
    ))}
</ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold"
  },
});
