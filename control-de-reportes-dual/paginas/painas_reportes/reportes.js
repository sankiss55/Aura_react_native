import { useFocusEffect, useNavigation } from '@react-navigation/native';
import axios from "axios";
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from 'react-native-toast-message';
import Icon from "react-native-vector-icons/Ionicons";
import Agregar_btn from "../../componentes/componentes_app/agregar";
import { API_URL } from "../../otros/configuracion";

import AsyncStorage from "@react-native-async-storage/async-storage";
export default function Reportes({ route }) {
  const [archivoPDF, setArchivoPDF] = useState(null);

  const [idTipo, setIdTipo] = useState(null);
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const { id_semana, matricula_alumno, id_escolar } = route.params;
  const [reportes, setReportes] = useState([]);
  const [estados, setEstados] = useState([]);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
  
  const navigation = useNavigation();
  const seleccionarPDF = async () => {
    try {
      const resultado = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });
  console.log(resultado);
      if (resultado.canceled==true) {
        
        console.log('Selección cancelada');
      } else {
        setArchivoPDF(resultado);
        console.log('Archivo seleccionado:', resultado.assets[0].name);
      }
    } catch (error) {
      console.log('Error al seleccionar archivo:', error);
    }
  };
   useFocusEffect(
      React.useCallback(() => {
        const obtenerTipo = async () => {
          const tipo = await AsyncStorage.getItem('id_tipo');
          setIdTipo(parseInt(tipo));
        };
        obtenerTipo();
      }, [])
    );
function buscar_usuarios(){
  axios
  .post(`${API_URL}/buscar_reportes.php`, {
    id_semana,
    matricula_alumno,
    id_escolar,
  })
  .then((res) => {
    if (res.data.success) {
      setReportes(res.data.data);
    } else {
      console.log("Error desde el servidor:", res.data.message);
    }
  })
  .catch((error) => {
    console.log("Error al obtener reportes:", error);
  });
};
    useFocusEffect(
           React.useCallback(() => {
    buscar_usuarios();
  }, [])
);
useFocusEffect(
  React.useCallback(() => {
    axios
      .post(`${API_URL}/buscar_estado.php`)
      .then((res) => {
        if (res.data.success) {
          const lista = res.data.reportes.map((item) => ({
            key: item.id_estado,
            value: item.estado,
          }));
          setEstados(lista);
        } else {
          console.log("Error al traer estados:", res.data.message);
        }
      })
      .catch((error) => {
        console.log("Error en axios:", error);
      });
    }, [])
  );
  const enviarReporte = async () => {
    if (!archivoPDF || !nombreArchivo || !estadoSeleccionado) {
      Toast.show({
        type: 'error',
        text1: 'Completa todos los campos',
      });
      return;
    }
  
    try {
      const base64PDF = await FileSystem.readAsStringAsync(
        archivoPDF.assets[0].uri,
        { encoding: FileSystem.EncodingType.Base64 }
      );
  
      const datos = {
        nombre_archivo: nombreArchivo,
        id_estado: estadoSeleccionado,
        archivo_base64: base64PDF,
        nombre_pdf: archivoPDF.assets[0].name,
        id_ciclo: id_escolar,
        id_semanas: id_semana,
        id_matricula: matricula_alumno
      };
  
      const response = await axios.post(`${API_URL}/agregar_reporte.php`, datos);
  
      if (response.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Reporte guardado correctamente',
        });
        setNombreArchivo('');
        setArchivoPDF(null);
        setEstadoSeleccionado('');
        setModalAgregarVisible(false);
        buscar_usuarios();
      } else {
        console.error(response.data);
        Toast.show({
          type: 'error',
          text1: 'Error al guardar',
          text2: response.data.message || 'Inténtalo más tarde.',
        });
      }
    } catch (error) {
      console.error("Error al enviar el reporte:", error);
      Toast.show({
        type: 'error',
        text1: 'Error al enviar',
        text2: 'Intenta nuevamente.',
      });
    }
  };
  const eliminarReporte = (id_reporte) => {
    axios.post(`${API_URL}/eliminar_reporte.php`, {
      id_reporte: id_reporte
    })
    .then((res) => {
      if (res.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Reporte eliminado correctamente',
        });
        buscar_usuarios(); 
      } else {
        Toast.show({
          type: 'error',
          text1: 'No se pudo eliminar',
          text2: res.data.message,
        });
      }
    })
    .catch((error) => {
      console.log("Error al eliminar reporte:", error);
      Toast.show({
        type: 'error',
        text1: 'Error de red',
      });
    });
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reportes del alumno</Text>

      <ScrollView style={styles.scroll}>
      {reportes.length > 0 ? (
  reportes.map((reporte, index) => (
    <View key={index} style={styles.button}>
      <TouchableOpacity
        onPress={() => {
          if (reporte.url_pdf) {
            navigation.navigate("VisorPDF", { uri: reporte.url_pdf });
          } else {
            alert("El reporte no tiene archivo disponible.");
          }
        }}
        style={{ flexDirection: "row", flex: 1, alignItems: "center" }}
      >
        <Icon name="document-text-outline" size={24} color="#444" style={styles.icon} />
        <View style={styles.textContainer}>
          <Text style={styles.fileName}>{reporte.nombre_archivo}</Text>
          <Text style={styles.estado}>Estado: {reporte.estado_reporte}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => eliminarReporte(reporte.id_reporte)}
        style={{
          marginLeft: 10,
          backgroundColor: "#ff4d4d",
          padding: 8,
          borderRadius: 5,
        }}
      >
        <Icon name="trash-outline" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  ))
) : (
  <Text style={styles.noData}>No hay reportes disponibles.</Text>
)}
      </ScrollView>

      <Modal
        transparent={true}
        visible={modalAgregarVisible}
        animationType="slide"
        onRequestClose={() => setModalAgregarVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Agregar Reporte</Text>
            
            <TextInput
  value={nombreArchivo}
  onChangeText={setNombreArchivo}
  placeholder="Ingresa nombre archivo"
  style={{
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16
  }}
  placeholderTextColor="#888"
/>
            <Text style={styles.buttonText}>Seleccionar PDF</Text>
            <TouchableOpacity
  onPress={seleccionarPDF}
  style={{
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  }}
>
  <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>
    Seleccionar PDF
  </Text>
</TouchableOpacity>

{archivoPDF && (
  <Text style={{ marginBottom: 10, color: '#555', fontSize: 14 }}>
    Archivo: {archivoPDF.assets[0].name}
  </Text>
)}


            <Text style={{ marginBottom: 10 }}>Selecciona un estado:</Text>
      <SelectList
        setSelected={setEstadoSeleccionado}
        data={estados}
        save="key"
        placeholder="Selecciona un estado"
        boxStyles={{ marginBottom: 15 }}
      />
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={styles.saveButton}  onPress={enviarReporte}>
                <Text style={styles.buttonText}>Guardar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1, marginLeft: 5 }]}
                onPress={() => setModalAgregarVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* BOTÓN AGREGAR */}
      {
idTipo !==3 && (
      <Agregar_btn onPress={() => setModalAgregarVisible(true)} />
)
    }
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scroll: {
    marginTop: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  icon: {
    marginRight: 12,
  },
  textContainer: {
    flexDirection: "column",
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  estado: {
    fontSize: 14,
    color: "#777",
  },
  noData: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
