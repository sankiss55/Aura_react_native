import { useFocusEffect } from '@react-navigation/native';
import axios from "axios";
import React, { useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import Agregar_btn from "../../componentes/componentes_app/agregar";
import { API_URL } from '../../otros/configuracion';
export default function Grupo() {
  const [grupoEditar, setGrupoEditar] = useState(null);

        const [cicloSeleccionado, setCicloSeleccionado] = useState("");
    const [listaCiclos, setListaCiclos] = useState([]);
      const [username, setUsername] = useState('');
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [nombreCiclo, setNombreCiclo] = useState('');
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
  const obtenerciclos = async () => {
    try {
      const response = await axios.post(`${API_URL}/all_grupo.php`);
      if (response.data.success) {
        setUsuarios(response.data.grupo);  
        const response_cliclos = await axios.post(`${API_URL}/all_ciclos_escolar.php`);
        const opciones = response_cliclos.data.usuarios
          .filter(item => item.activo != 0) 
          .map(item => ({
            key: item.id_ciclo.toString(),
            value: `${item.nombre_ciclo} (Fecha de inicio: ${item.fecha_inicio} Fecha final: ${item.fecha_fin})`
          }));
        
        return opciones;
        
      } else {
        Alert.alert("Error", "No se pudieron obtener los ciclos.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener los ciclos."+error);
    }
  };
  const buscarUsuario = async (searchText) => {
    if (!searchText) {
        obtenerciclos();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar_grupos.php`, { username: searchText });
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
    function Guardar_grupo() {
        // Validación de campos
        if (!nombreCiclo.trim() || !cicloSeleccionado) {
          Toast.show({
            type: 'error',
            text1: 'Campos incompletos',
            text2: 'Por favor, completa todos los campos requeridos.',
          });
          return;
        }
      
        // Enviar los datos a la API
        axios.post(`${API_URL}/guardar_grupo.php`, {
          nombre_grupo: nombreCiclo,
          id_ciclo: cicloSeleccionado,
        })
        .then(function (respuesta) {
          if (respuesta.data.success === false) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: respuesta.data.message,
            });
          } else {
            Toast.show({
              type: 'success',
              text1: 'Grupo guardado',
              text2: respuesta.data.message,
            });
      
            obtenerciclos();
            setModalAgregarVisible(false);
            setNombreCiclo('');
            setCicloSeleccionado('');
          }
        })
        .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'Error de conexión',
            text2: 'No se pudo guardar el grupo.',
          });
          console.log(error);
        });
      }
      const actualizarGrupo = () => {
        if (!nombreCiclo.trim() || !cicloSeleccionado) {
          Toast.show({
            type: 'error',
            text1: 'Campos incompletos',
            text2: 'Por favor, completa todos los campos requeridos.',
          });
          return;
        }
      
        axios.post(`${API_URL}/actualizar_grupo.php`, {
          id_grupo: grupoEditar.id_grupo,
          nombre_grupo: nombreCiclo,
          id_ciclo: cicloSeleccionado,
        })
        .then(function (respuesta) {
          if (respuesta.data.success === false) {
            Toast.show({
              type: 'error',
              text1: 'Error',
              text2: respuesta.data.message,
            });
          } else {
            Toast.show({
              type: 'success',
              text1: 'Grupo actualizado',
              text2: respuesta.data.message,
            });
      
            obtenerciclos();
            setModalAgregarVisible(false);
            setGrupoEditar(null); // Limpiar el estado de edición
            setNombreCiclo('');
            setCicloSeleccionado('');
          }
        })
        .catch(function (error) {
          Toast.show({
            type: 'error',
            text1: 'Error de conexión',
            text2: 'No se pudo actualizar el grupo.',
          });
          console.log(error);
        });
      };
      function eliminar(id) {
    axios.post(`${API_URL}/eliminaciones.php`, {
      id: id,
      id_name:'id_grupo',
      name:'grupo'
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
  return (
    <View style={style.container}>
        <TextInput
                style={style.input}
                placeholder="Ingresa el nombre del grupo"
                value={username}
                onChangeText={handleChange}
                placeholderTextColor="#888"
              />
      <ScrollView contentContainerStyle={style.listContainer}>
        {usuarios.map((usuario) => {

          return (
            <View key={usuario.id_grupo} style={style.cicloContainer}>
              <Text style={style.cicloText}>ID: {usuario.id_grupo}</Text>
              <Text style={style.cicloText}>Nombre: {usuario.nombre_grupo}</Text>
               <View style={style.buttonsContainer}>
                 <TouchableOpacity
                                  style={style.modifyButton2}
                                    onPress={() => eliminar(usuario.id_grupo)}
                                >
                                  <Icon name="trash-outline" size={20} color="#fff" />
                                  <Text style={style.buttonText}>Eliminar</Text>
                                </TouchableOpacity>
               <TouchableOpacity
                style={style.modifyButton}
                onPress={() => {
                  setGrupoEditar(usuario); 
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
  onRequestClose={() => {
    setModalAgregarVisible(false);
    setGrupoEditar(null); // Limpiar los datos
    setNombreCiclo('');
    setCicloSeleccionado('');
  }}
>
  <View style={style.modalContainer}>
    <View style={style.modalContent}>
      <Text style={style.title}>{grupoEditar ? 'Editar Grupo' : 'Agregar Grupo'}</Text>

      <TextInput
        placeholder="Nombre del Ciclo"
        value={nombreCiclo || (grupoEditar ? grupoEditar.nombre_grupo : '')}
        onChangeText={setNombreCiclo}
        style={style.input}
        placeholderTextColor="#888"
      />
      <Text>Selecciona ciclo escolar:</Text>
      <SelectList
        setSelected={(val) => setCicloSeleccionado(val)}
        data={listaCiclos}
        placeholder="Selecciona un ciclo"
        boxStyles={{ marginBottom: 10 }}
        defaultOption={grupoEditar ? { key: grupoEditar.id_ciclo.toString()} : null}
      />

      <View style={style.buttonContainer}>
        <TouchableOpacity
          style={style.buttonCancelar}
          onPress={() => {
            setModalAgregarVisible(false);
            setGrupoEditar(null); 
            setNombreCiclo(''); 
            setCicloSeleccionado(''); 
          }}
        >
          <Text style={style.buttonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={style.buttonGuardar}
          onPress={() => {
            if (grupoEditar) {
              actualizarGrupo();
            } else {
              Guardar_grupo();
            }
          }}
        >
          <Text style={style.buttonText}>{grupoEditar ? 'Actualizar' : 'Guardar'}</Text>
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
