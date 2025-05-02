import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { API_URL } from "../../otros/configuracion"; 

import { useNavigation } from '@react-navigation/native'; 
export default function Alumnos({ route }) {
  const { idGrupo, nombre, id_escolar } = route.params;
  const [alumnos, setAlumnos] = useState([]);

  const navigation = useNavigation(); 
  useEffect(() => {
    axios.post(`${API_URL}/alumnos_dependiendo_grupo.php`, { id_grupo: idGrupo })
      .then(res => {
        if (res.data.success) {
          setAlumnos(res.data.alumnos);
        } else {
          console.log('No se encontraron alumnos');
        }
      })
      .catch(error => {
        console.log('Error al obtener alumnos:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alumnos del Grupo {nombre}</Text>
      <ScrollView style={styles.scroll}>
        {alumnos.map((alumno) => (
          <TouchableOpacity
            key={alumno.id_matricula}
            style={styles.button}
            onPress={() => navigation.navigate("Semanas", { matricula:alumno.id_matricula, id_escolar:id_escolar  })}
          >
            <Icon name="folder" size={24} color="#555" style={styles.icon} />
            <Text style={styles.buttonText}>
              {alumno.nombre} {alumno.apellido_paterno} {alumno.apellido_materno}
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
    color: "balck",
    fontSize: 16
  }
});
