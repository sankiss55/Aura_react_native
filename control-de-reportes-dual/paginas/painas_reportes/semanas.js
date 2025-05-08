import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL } from "../../otros/configuracion";
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native'; 
export default function Semanas({ route }) {
    const navigation = useNavigation(); 
  const { matricula, id_escolar } = route.params;
  const [semanas, setSemanas] = useState([]);

 useFocusEffect(
            React.useCallback(() => {
    axios.post(`${API_URL}/semanas_dependiendo_ciclo.php`, { id_ciclo: id_escolar })
      .then(res => {
        if (res.data.success) {
          setSemanas(res.data.semanas);
        } else {
          console.log('No se encontraron semanas');
        }
      })
      .catch(error => {
        console.log('Error al obtener semanas:', error);
      });
}, [id_escolar])
);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Semanas del Ciclo Escolar</Text>
      <ScrollView style={styles.scroll}>
        {semanas.map((semana) => (
          <TouchableOpacity
            key={semana.id_semanas}
            style={styles.button}
            onPress={() => navigation.navigate("Reportes", { id_semana: semana.id_semanas, matricula_alumno:matricula, id_escolar:id_escolar })}
          >
            <Icon name="folder" size={24} color="#555" style={styles.icon} />
            <Text style={styles.buttonText}>
              {semana.nombre_semana} - {semana.fecha_inicial} a {semana.fecha_final}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold"
  },
  scroll: {
    marginTop: 10
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
    marginRight: 10
  },
  buttonText: {
    color: "black",
    fontSize: 16
  }
});
