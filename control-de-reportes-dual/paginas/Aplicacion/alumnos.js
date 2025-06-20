import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import Agregar_btn from "../../componentes/componentes_app/agregar";
import { API_URL } from '../../otros/configuracion';
export default function Alumnos() {
        const [cicloSeleccionado, setCicloSeleccionado] = useState("");
const [listaCiclos, setListaCiclos] = useState([]);
      const [username, setUsername] = useState('');
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);

const [nombre, setNombre] = useState('');
const [apellidoPaterno, setApellidoPaterno] = useState('');
const [apellidoMaterno, setApellidoMaterno] = useState('');
    const [debounceTimeout, setDebounceTimeout] = useState(null);
  
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
  
        function eliminar(id) {
      axios.post(`${API_URL}/eliminaciones.php`, {
        id: id,
        id_name:'id_matricula',
        name:'alumnos'
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
  const obtenerciclos = async () => {
    try {
      const response = await axios.post(`${API_URL}/all_alumnos.php`);
      if (response.data.success) {
        setUsuarios(response.data.usuarios);
        const response_cliclos = await axios.post(`${API_URL}/all_grupo.php`);
                const opciones = response_cliclos.data.grupo.map(item => ({
                    key: item.id_grupo.toString(),
                    value: `${item.nombre_grupo}`
                  }));
                
                return opciones;
      } else {
        Alert.alert("Error", "No se pudieron obtener los ciclos.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener los ciclos.");
    }
  };
  const buscarUsuario = async (searchText) => {
    if (!searchText) {
        obtenerciclos();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar_alumnos.php`, { username: searchText });
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
    // Validar que todos los campos estén completos
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !cicloSeleccionado) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor ingresa todos los campos.',
      });
      return;
    }
  
    
  
    // Enviar los datos a la API
    axios.post(`${API_URL}/guardar_alumno.php`, {
        nombre,
        apellido_paterno: apellidoPaterno,
        apellido_materno: apellidoMaterno,
        id_grupo: cicloSeleccionado,
      })
      .then(function (respuesta) {
        if (respuesta.data.success === false) {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: respuesta.data.message,
          });
          return;
        } else {
          Toast.show({
            type: 'success',
            text1: 'Listo',
            text2: respuesta.data.message,
          });
  
          // Limpiar los campos después de guardar los datos
          setNombre('');
          setApellidoPaterno('');
          setApellidoMaterno('');
  
          setCicloSeleccionado('');
          // Volver a obtener la lista de ciclos escolares
          obtenerciclos();
        }
      })
      .catch(function (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Por ahora no se puede hacer esa acción.',
        });
      });
  
    setModalAgregarVisible(false);  
  }
  
function limpiar_datos() {
  setNombre('');
  setApellidoPaterno('');
  setApellidoMaterno('');
  setCicloSeleccionado('');
  setModalAgregarVisible(false);
  setModoEdicion(false);
  setAlumnoSeleccionado(null);


  }
  const actualizarAlumno = () => {
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !cicloSeleccionado) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor completa todos los campos.',
      });
      return;
    }
  
    axios.post(`${API_URL}/actualizar_alumno.php`, {
      id_matricula: alumnoSeleccionado.id_matricula,
      nombre,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      id_grupo: cicloSeleccionado,
    })
    .then(respuesta => {
      if (respuesta.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Alumno actualizado',
          text2: respuesta.data.message,
        });
        limpiar_datos();
        obtenerciclos();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: respuesta.data.message,
        });
      }
    })
    .catch(error => {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar el alumno.',
      });
    });
  };
  
  return (
    <View style={style.container}>
        <TextInput
                style={style.input}
                placeholder="Busca a alumno (nombre, apellido paterno o materno)"
                value={username}
                onChangeText={handleChange}
                placeholderTextColor="#888"
              />
      <ScrollView contentContainerStyle={style.listContainer}>
        {usuarios.map((usuario) => {
          return (
            <View key={usuario.id_matricula} style={style.cicloContainer}>
              <Text style={style.cicloText}>ID: {usuario.id_matricula}</Text>
              <Text style={style.cicloText}>Nombre: {usuario.nombre}</Text>
              <Text style={style.cicloText}>Apelido Paterno: {usuario.apellido_paterno }</Text>
              <Text style={style.cicloText}>Apelido Materno: {usuario.apellido_materno}</Text>
              <Text style={style.cicloText}>Grupo: {usuario.nombre_grupo}</Text>
             
               <View style={style.buttonsContainer}>
                 <TouchableOpacity
                                                  style={style.modifyButton2}
                                                    onPress={() => eliminar(usuario.id_matricula)}
                                                >
                                                  <Icon name="trash-outline" size={20} color="#fff" />
                                                  <Text style={style.buttonText}>Eliminar</Text>
                                                </TouchableOpacity>
               <TouchableOpacity
                style={style.modifyButton}
                onPress={() => {
                  setModoEdicion(true);
                  setAlumnoSeleccionado(usuario);
                  setNombre(usuario.nombre);
                  setApellidoPaterno(usuario.apellido_paterno);
                  setApellidoMaterno(usuario.apellido_materno);
                  setCicloSeleccionado(usuario.id_grupo?.toString()); 
                  setModalAgregarVisible(true);
                }}
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
      <Text style={style.title}>Agregar nuevo estudiante </Text>

      {/* Campo Nombre */}
      <TextInput
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        style={style.input}
        placeholderTextColor="#888"
      />

      {/* Campo Apellido Paterno */}
      <TextInput
        placeholder="Apellido Paterno"
        value={apellidoPaterno}
        onChangeText={setApellidoPaterno}
        style={style.input}
        placeholderTextColor="#888"
      />

      {/* Campo Apellido Materno */}
      <TextInput
        placeholder="Apellido Materno"
        value={apellidoMaterno}
        onChangeText={setApellidoMaterno}
        style={style.input}
        placeholderTextColor="#888"
      />

    
<SelectList
  setSelected={(val) => setCicloSeleccionado(val)}
  data={listaCiclos}
  placeholder="Selecciona un grupo"
  boxStyles={{ marginBottom: 10 }}
  defaultOption={
    modoEdicion && alumnoSeleccionado
      ? {
          key: alumnoSeleccionado.id_grupo.toString(),
          value: listaCiclos.find(op => op.key === alumnoSeleccionado.id_grupo.toString())?.value || ''
        }
      : undefined
  }
/>

      <View style={style.buttonContainer}>
        <TouchableOpacity
          style={style.buttonCancelar}
          onPress={() => {setModalAgregarVisible(false)
            limpiar_datos();
          }}
        >
          <Text style={style.buttonText}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={style.buttonGuardar}
          onPress={() => {
              if (modoEdicion) {
                actualizarAlumno();
              } else {
                guardar_ciclo_escolar();
              }
          
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
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'center',
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
    backgroundColor: '#2ECC71', 
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#E74C3C', 
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
