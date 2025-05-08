import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../../otros/configuracion';

import { useFocusEffect } from '@react-navigation/native';
export default function Grupos({ route }) {
  const { idCiclo } = route.params;
  const [grupos, setGrupos] = useState([]);
  const navigation = useNavigation();

  useFocusEffect(
         React.useCallback(() => {
    axios.post(`${API_URL}/buscar_grupo_depende_ciclo.php`, { id_ciclo: idCiclo })
      .then(respuesta => {
        if (respuesta.data.success) {
          setGrupos(respuesta.data.grupos);
        } else {
          console.log('No se encontraron grupos:', respuesta.data.message);
        }
      })
      .catch(error => {
        console.log('Error al obtener grupos:', error);
      });
    }, [])
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>

              <Text style={styles.title}>Grupos </Text>
      {grupos.map((grupo) => (
        <TouchableOpacity
          key={grupo.id_grupo}
          style={styles.button}
          onPress={() => navigation.navigate("All_alumnos", { idGrupo: grupo.id_grupo,nombre:grupo.nombre_grupo, id_escolar:idCiclo  })}
        >
          <Icon name="folder" size={24} color="#555" style={styles.icon} />
          <Text style={styles.text}>{grupo.nombre_grupo}</Text>
        </TouchableOpacity>
      ))}
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
