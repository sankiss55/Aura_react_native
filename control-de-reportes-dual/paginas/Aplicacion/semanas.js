import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import Agregar_btn from "../../componentes/componentes_app/agregar";
import { API_URL } from '../../otros/configuracion';

export default function Semanas() {
  const [semanaSeleccionada, setSemanaSeleccionada] = useState(null);
const [modoEdicion, setModoEdicion] = useState(false);

    const [cicloSeleccionado, setCicloSeleccionado] = useState("");
    const [listaCiclos, setListaCiclos] = useState([]);
      const [username, setUsername] = useState('');
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [nombreCiclo, setNombreCiclo] = useState('');
  const [diaInicio, setDiaInicio] = useState('');
  const [mesInicio, setMesInicio] = useState('');
  const [añoInicio, setAñoInicio] = useState('');
  const [diaFin, setDiaFin] = useState('');
  const [mesFin, setMesFin] = useState('');
  const [añoFin, setAñoFin] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [semanas, setsemanas]=useState();
  
  const abrirModalEditar = (semana) => {
    setSemanaSeleccionada(semana);
    setModoEdicion(true);
    setModalAgregarVisible(true);
  
    setNombreCiclo(semana.nombre_semana);
  
    const fechaInicio = new Date(semana.fecha_inicial);
    const fechaFin = new Date(semana.fecha_final);
  
    setDiaInicio(String(fechaInicio.getDate()));
    setMesInicio(String(fechaInicio.getMonth() + 1));
    setAñoInicio(String(fechaInicio.getFullYear()));
  
    setDiaFin(String(fechaFin.getDate()));
    setMesFin(String(fechaFin.getMonth() + 1));
    setAñoFin(String(fechaFin.getFullYear()));
  
    setCicloSeleccionado(String(semana.id_ciclo)); 
  };
  
      function eliminar(id) {
    axios.post(`${API_URL}/eliminaciones.php`, {
      id: id,
      id_name:'id_semanas',
      name:'semanas'
    }).then(function(respuesta){
      console.log(respuesta.data);
       Toast.show({
        type: respuesta.data.success==false?'error': 'success',
        text1: respuesta.data.success==false?'Error': 'Listo',
        text2: respuesta.data.message,
      });
      obtenerciclos(); 
    }).catch(function(error){
      console.log(error);
    });
    }
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
  const obtenerciclos = async () => {
    try {
      // Obtener todas las semanas para la lista principal
      const responseSemanas = await axios.post(`${API_URL}/all_semanas.php`);
      if (responseSemanas.data.success) {
        setUsuarios(responseSemanas.data.semanas);
      }

      // Obtener todos los ciclos escolares para el selector
      const responseCiclos = await axios.post(`${API_URL}/all_ciclos_escolar.php`);
      if (responseCiclos.data && Array.isArray(responseCiclos.data.usuarios)) {
        // Filtrar ciclos únicos y activos
        const ciclosMap = {};
        responseCiclos.data.usuarios.forEach(item => {
          if (item.activo !== 0 && !ciclosMap[item.id_ciclo]) {
            ciclosMap[item.id_ciclo] = {
              key: item.id_ciclo.toString(),
              value: `${item.nombre_ciclo} (Inicio: ${item.fecha_inicio}, Fin: ${item.fecha_fin})`
            };
          }
        });
        const ciclosUnicos = Object.values(ciclosMap);
        setListaCiclos(ciclosUnicos);
        return ciclosUnicos;
      } else {
        setListaCiclos([]);
        return [];
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener los ciclos.");
      setListaCiclos([]);
      return [];
    }
  };
  const buscarUsuario = async (searchText) => {
    if (!searchText) {
        obtenerciclos();

      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar_semana.php`, { nombre_semana: searchText });
      if (response.data.success) {
        setUsuarios(response.data.semanas);

      // Genera la lista de ciclos para el selector
      // const opciones = response.data.semanas.map((item) => ({
      //   key: item.id_ciclo.toString(),
      //   value: `${item.nombre_ciclo} (Inicio: ${item.fecha_inicio}, Fin: ${item.fecha_fin})`,
      // }));

      // setListaCiclos(opciones);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al buscar el usuario.");
    }
    
    // obtenerciclos();
  };
  useFocusEffect(
    React.useCallback(() => {
        const fetchCiclos = async () => {
          const opciones = await obtenerciclos(); // Espera el resultado
          setListaCiclos(opciones || []); // Lo asigna correctamente
        };
      
        fetchCiclos();
      }, [])
    );

      function guardar_ciclo_escolar() {
        if (!diaInicio || !mesInicio || !añoInicio || !diaFin || !mesFin || !añoFin) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'Por favor ingresa todas las fechas.' });
          return;
        }
      
        const fechaInicioSQL = `${añoInicio}-${mesInicio.padStart(2, '0')}-${diaInicio.padStart(2, '0')}`;
        const fechaFinSQL = `${añoFin}-${mesFin.padStart(2, '0')}-${diaFin.padStart(2, '0')}`;
      
        if (new Date(fechaInicioSQL) > new Date(fechaFinSQL)) {
          Toast.show({ type: 'error', text1: 'Error', text2: 'La fecha de inicio no puede ser posterior.' });
          return;
        }
      
      
        if (modoEdicion && semanaSeleccionada) {
          axios.post(`${API_URL}/actualizar_semana.php`, {
            nombreCiclo,
            fechaInicio: fechaInicioSQL,
            fechaFin: fechaFinSQL,
            idCiclo: cicloSeleccionado,
            idSemana: semanaSeleccionada.id_semanas
          })
          .then(respuesta => {
            Toast.show({ type: 'success', text1: 'Actualizado', text2: respuesta.data.message });
            limpiarFormulario();
            obtenerciclos();
          })
          .catch(error => {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo actualizar.' });
          });
        } else {
          axios.post(`${API_URL}/guardar_semana.php`, { nombreCiclo,
            fechaInicio: fechaInicioSQL,
            fechaFin: fechaFinSQL,
            idCiclo: cicloSeleccionado,})
          .then(respuesta => {
            Toast.show({ type: 'success', text1: 'Guardado', text2: respuesta.data.message });
            limpiarFormulario();
            obtenerciclos();
          })
          .catch(() => {
            Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo guardar.' });
          });
        }
      }
      
      function limpiarFormulario() {
        setNombreCiclo('');
        setDiaInicio('');
        setMesInicio('');
        setAñoInicio('');
        setDiaFin('');
        setMesFin('');
        setAñoFin('');
        setCicloSeleccionado('');
        setModoEdicion(false);
        setSemanaSeleccionada(null);
        setModalAgregarVisible(false);
      }
      
  return (
    <View style={style.container}>
      
            <Text style={style.title}>Buscar Semans</Text>
        <TextInput
                style={style.input}
                placeholder="Ingresa el nombre de la semana"
                value={username}
                onChangeText={handleChange}
                placeholderTextColor="#888"
              />
      <ScrollView contentContainerStyle={style.listContainer}>
        {usuarios.map((usuario) => {
          const fechaInicio = new Date(usuario.fecha_inicial).toLocaleDateString();
          const fechaFin = new Date(usuario.fecha_final).toLocaleDateString();

          return (
            <View key={usuario.id_semanas} style={style.cicloContainer}>
              <Text style={style.cicloText}>ID: {usuario.id_semanas}</Text>
              <Text style={style.cicloText}>Nombre: {usuario.nombre_semana}</Text>
              <Text style={style.cicloText}>Fecha Inicio: {fechaInicio}</Text>
              <Text style={style.cicloText}>Fecha Fin: {fechaFin}</Text>
               <View style={style.buttonsContainer}>
                   <TouchableOpacity
                                  style={style.modifyButton2}
                                    onPress={() => eliminar(usuario.id_semanas)}
                                >
                                  <Icon name="trash-outline" size={20} color="#fff" />
                                  <Text style={style.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
               <TouchableOpacity
                style={style.modifyButton}
               onPress={() => abrirModalEditar(usuario)}

              >
                <Icon name="pencil" size={20} color="#fff" />
                <Text style={style.buttonText}>Modificar</Text>
              </TouchableOpacity>
              
                             {/* <TouchableOpacity style={style.deleteButton} onPress={() => eliminar_ciclo_escolar(usuario.id_ciclo)}> 
                            
                              <Icon name="trash" size={20} color="#fff" />
                              <Text style={style.buttonText}>Eliminar</Text>
                            </TouchableOpacity> */}
                            </View>
            </View>
            
          );
        })}
      </ScrollView>

      <Agregar_btn onPress={() => setModalAgregarVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAgregarVisible}
        onRequestClose={() => setModalAgregarVisible(false)}
      >
        <View style={style.modalContainer}>
          <View style={style.modalContent}>
            <Text style={style.title}>Agregar Semana</Text>

            <TextInput
              placeholder="Nombre de la semana"
              value={nombreCiclo}
              onChangeText={setNombreCiclo}
              style={style.input}
              placeholderTextColor="#888"
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
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Mes"
                value={mesInicio}
                onChangeText={setMesInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Año"
                value={añoInicio}
                onChangeText={setAñoInicio}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#888"
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
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Mes"
                value={mesFin}
                onChangeText={setMesFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={2}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Año"
                value={añoFin}
                onChangeText={setAñoFin}
                style={style.inputSmall}
                keyboardType="numeric"
                maxLength={4}
                placeholderTextColor="#888"
              />
            </View>
            <Text>Selecciona ciclo escolar:</Text>
            <SelectList
  setSelected={(val) => setCicloSeleccionado(val)}
  data={listaCiclos}
  placeholder="Selecciona un ciclo"
  boxStyles={{ marginBottom: 10 }}
  defaultOption={
    modoEdicion && semanaSeleccionada
      ? {
          key: semanaSeleccionada.id_ciclo.toString(),
          value: listaCiclos.find(op => op.key === semanaSeleccionada.id_ciclo.toString())?.value || ''
        }
      : undefined
  }
/>

            <View style={style.buttonContainer}>
              <TouchableOpacity
                style={style.buttonCancelar}
                onPress={() => {setModalAgregarVisible(false);
                  limpiarFormulario();
                }}
              >
                <Text style={style.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.buttonGuardar}
                onPress={() => {
                  guardar_ciclo_escolar();
                }}
              >
                <Text style={style.buttonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
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
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    marginTop: 20,
  },
  cicloContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cicloText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: '#2C3E50', // Color más profesional

  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  inputSmall: {
    width: '30%',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchContainer: {
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCancelar: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonGuardar: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
  
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  
   modifyButton2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(163, 16, 16)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginLeft: 10,
  },
  modifyButton: {
    backgroundColor: '#2ECC71', // Verde
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C', // Rojo
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#fff',
  },
  input: {
    height: 45,
    borderColor: '#3498DB', // Azul más profesional
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
});
