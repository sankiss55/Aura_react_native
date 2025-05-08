import { StyleSheet, Text, View, Modal, TextInput, Switch, TouchableOpacity, ScrollView, Alert } from "react-native"; 
import Agregar_btn from "../../componentes/componentes_app/agregar";
import { useState, useEffect } from "react";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import { API_URL } from '../../otros/configuracion'; 

export default function CicloEscolar() {
  const [username, setUsername] = useState('');
  
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [nombreCiclo, setNombreCiclo] = useState('');
  const [diaInicio, setDiaInicio] = useState('');
  const [mesInicio, setMesInicio] = useState('');
  const [añoInicio, setAñoInicio] = useState('');
  const [diaFin, setDiaFin] = useState('');
  const [mesFin, setMesFin] = useState('');
  const [añoFin, setAñoFin] = useState('');
  const [activo, setActivo] = useState(false);
  const [cicloIdEditar, setCicloIdEditar] = useState(null);

  const obtenerciclos = async () => {
    try {
      const response = await axios.post(`${API_URL}/all_ciclos_escolar.php`);
      if (response.data.success) {
        setUsuarios(response.data.usuarios);
      } else {
        Alert.alert("Error", "No se pudieron obtener los ciclos.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener los ciclos.");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
    obtenerciclos();
  }, [])
);

  const editarCicloEscolar = (usuario) => {
    setCicloIdEditar(usuario.id_ciclo);
    setNombreCiclo(usuario.nombre_ciclo);
    const fechaInicio = new Date(usuario.fecha_inicio);
    setDiaInicio(fechaInicio.getDate().toString());
    setMesInicio((fechaInicio.getMonth() + 1).toString());
    setAñoInicio(fechaInicio.getFullYear().toString());
    const fechaFin = new Date(usuario.fecha_fin);
    setDiaFin(fechaFin.getDate().toString());
    setMesFin((fechaFin.getMonth() + 1).toString());
    setAñoFin(fechaFin.getFullYear().toString());
    setActivo(usuario.activo === 1);
    setModalEditarVisible(true);
  };

  const guardarCicloEscolar = () => {
    if (!diaInicio || !mesInicio || !añoInicio || !diaFin || !mesFin || !añoFin) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa todas las fechas.',
      });
      return;
    }

    const fechaInicioSQL = `${añoInicio}-${mesInicio.padStart(2, '0')}-${diaInicio.padStart(2, '0')}`;
    const fechaFinSQL = `${añoFin}-${mesFin.padStart(2, '0')}-${diaFin.padStart(2, '0')}`;
    const fechaInicioObj = new Date(fechaInicioSQL);
    const fechaFinObj = new Date(fechaFinSQL);

    if (fechaInicioObj > fechaFinObj) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
      });
      return;
    }

    axios.post(`${API_URL}/Guardar_ciclo.php`, {
      nombreCiclo,
      fechaInicio: fechaInicioSQL,
      fechaFin: fechaFinSQL,
      activo,
    }).then((respuesta) => {
      if (!respuesta.data.success) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: respuesta.data.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Listo',
          text2: respuesta.data.message,
        });
        obtenerciclos();
        setModalAgregarVisible(false);
      }
    }).catch((error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por ahora no se puede hacer esa acción.',
      });
    });
  };

  const editarCiclo = () => {
    if (!diaInicio || !mesInicio || !añoInicio || !diaFin || !mesFin || !añoFin) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa todas las fechas.',
      });
      return;
    }

    const fechaInicioSQL = `${añoInicio}-${mesInicio.padStart(2, '0')}-${diaInicio.padStart(2, '0')}`;
    const fechaFinSQL = `${añoFin}-${mesFin.padStart(2, '0')}-${diaFin.padStart(2, '0')}`;

    const fechaInicioObj = new Date(fechaInicioSQL);
    const fechaFinObj = new Date(fechaFinSQL);

    if (fechaInicioObj > fechaFinObj) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
      });
      return;
    }

    axios.post(`${API_URL}/Editar_ciclo.php`, {
      idCiclo: cicloIdEditar,
      nombreCiclo,
      fechaInicio: fechaInicioSQL,
      fechaFin: fechaFinSQL,
      activo,
    }).then((respuesta) => {
      if (!respuesta.data.success) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: respuesta.data.message,
        });
      } else {
        Toast.show({
          type: 'success',
          text1: 'Listo',
          text2: 'El ciclo escolar ha sido actualizado.',
        });
        obtenerciclos();
        setModalEditarVisible(false);
      }
    }).catch((error) => {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por ahora no se puede hacer esa acción.',
      });
    });
  };
 
  const handleChange = (text) => {
    setUsername(text);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      buscarUsuario(text);
    }, 500);

    setDebounceTimeout(timeout);
  };
  const buscarUsuario = async (searchText) => {
    if (!searchText) {
        obtenerciclos();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar_ciclos.php`, { username: searchText });
      if (response.data.success) {
        setUsuarios(Array.isArray(response.data.usuario) ? response.data.usuario : []);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al buscar el usuario.");
    }
    
    // obtenerciclos();
  };
  return (
    <View style={style.container}>
        <TextInput
                style={style.input}
                placeholder="Ingresa el nombre de ciclo escolar"
                value={username}
                onChangeText={handleChange}
              />
      <ScrollView contentContainerStyle={style.listContainer}>
        {usuarios.map((usuario) => {
          const fechaInicio = new Date(usuario.fecha_inicio).toLocaleDateString();
          const fechaFin = new Date(usuario.fecha_fin).toLocaleDateString();
          const estado = usuario.activo === 1 ? 'Activo' : 'Desactivado';

          return (
            <View key={usuario.id_ciclo} style={style.cicloContainer}>
              <Text style={style.cicloText}>ID: {usuario.id_ciclo}</Text>
              <Text style={style.cicloText}>Nombre: {usuario.nombre_ciclo}</Text>
              <Text style={style.cicloText}>Fecha Inicio: {fechaInicio}</Text>
              <Text style={style.cicloText}>Fecha Fin: {fechaFin}</Text>
              <Text style={style.cicloText}>Estado: {estado}</Text>
              <View style={style.buttonsContainer}>
                <TouchableOpacity
                  style={style.modifyButton}
                  onPress={() => editarCicloEscolar(usuario)}
                >
                  <Icon name="pencil" size={20} color="#fff" />
                  <Text style={style.buttonText}>Modificar</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Agregar_btn onPress={() => setModalAgregarVisible(true)} />

      {/* Modal para agregar ciclo escolar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAgregarVisible}
        onRequestClose={() => setModalAgregarVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.title}>Agregar Ciclo Escolar</Text>

            <TextInput
              placeholder="Nombre del Ciclo"
              value={nombreCiclo}
              onChangeText={setNombreCiclo}
              style={style.input}
            />

            <Text>Fecha de Inicio:</Text>
            <View style={style.inputContainer}>
              <TextInput
                placeholder="Día"
                value={diaInicio}
                onChangeText={setDiaInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Mes"
                value={mesInicio}
                onChangeText={setMesInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Año"
                value={añoInicio}
                onChangeText={setAñoInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <Text>Fecha de Fin:</Text>
            <View style={style.inputContainer}>
              <TextInput
                placeholder="Día"
                value={diaFin}
                onChangeText={setDiaFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Mes"
                value={mesFin}
                onChangeText={setMesFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Año"
                value={añoFin}
                onChangeText={setAñoFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={style.switchContainer}>
              <Text>Activo</Text>
              <Switch
                value={activo}
                onValueChange={setActivo}
              />
            </View>

            <TouchableOpacity onPress={guardarCicloEscolar} style={style.saveButton}>
              <Text style={style.saveButtonText}>Guardar</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalAgregarVisible(false)} style={style.closeButton}>
              <Text style={style.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para editar ciclo escolar */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEditarVisible}
        onRequestClose={() => setModalEditarVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.title}>Editar Ciclo Escolar</Text>

            <TextInput
              placeholder="Nombre del Ciclo"
              value={nombreCiclo}
              onChangeText={setNombreCiclo}
              style={style.input}
            />

            <Text>Fecha de Inicio:</Text>
            <View style={style.inputContainer}>
              <TextInput
                placeholder="Día"
                value={diaInicio}
                onChangeText={setDiaInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Mes"
                value={mesInicio}
                onChangeText={setMesInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Año"
                value={añoInicio}
                onChangeText={setAñoInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <Text>Fecha de Fin:</Text>
            <View style={style.inputContainer}>
              <TextInput
                placeholder="Día"
                value={diaFin}
                onChangeText={setDiaFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Mes"
                value={mesFin}
                onChangeText={setMesFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
              />
              <TextInput
                placeholder="Año"
                value={añoFin}
                onChangeText={setAñoFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
              />
            </View>

            <View style={style.switchContainer}>
              <Text>Activo</Text>
              <Switch
                value={activo}
                onValueChange={setActivo}
              />
            </View>

            <TouchableOpacity onPress={editarCiclo} style={style.saveButton}>
              <Text style={style.saveButtonText}>Guardar Cambios</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalEditarVisible(false)} style={style.closeButton}>
              <Text style={style.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  cicloContainer: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
    borderRadius: 8,
  },
  cicloText: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  inputSmall: {
    width: '30%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#f44336',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
