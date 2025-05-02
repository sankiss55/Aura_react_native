import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert, ScrollView,Modal } from 'react-native';
import axios from 'axios';
import { SelectList } from 'react-native-dropdown-select-list';
import Agregar_btn from '../../componentes/componentes_app/agregar';

import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { API_URL } from '../../otros/configuracion'; 
export default function Usuarios() {
  const [username, setUsername] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    correo: '',
    username: '',
    contraseña: '',
    estado: true,
    id_tipo: '1',
  });
  const [modalAgregarVisible, setModalAgregarVisible] = useState(false);
  
  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setModalVisible(true);
  };
  
  function eliminar_usuario(id) {
    axios.post(`${API_URL}/borrar_usuario.php`, {
      id_usuario: id
    }).then(function (respuesta) {
      console.log(respuesta.data);
      Toast.show({
        type: 'success',
        text1: 'Listo',
        text2: 'El usuario se ha borrado exitosamente ',
      });
      obtenerUsuarios();
    }).catch(function (error) {
      console.log(error);
    });
  }

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.post(`${API_URL}/All_usuarios.php`);
      if (response.data.success) {
        setUsuarios(response.data.usuarios);
      } else {
        Alert.alert("Error", "No se pudieron obtener los usuarios.");
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al obtener los usuarios.");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const buscarUsuario = async (searchText) => {
    if (!searchText) {
      obtenerUsuarios();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/buscar_usuarios.php`, { username: searchText });
      if (response.data.success) {
        setUsuarios(response.data.usuario ? [response.data.usuario] : []);
      } else {
        setUsuarios([]);
      }
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al buscar el usuario.");
    }
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresa el nombre de usuario"
        value={username}
        onChangeText={handleChange}
      />
      <Modal
  transparent={true}
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Modificar Usuario</Text>
      <Text style={{ marginBottom: 5 }}>ID del Usuario</Text>
<TextInput
  style={[styles.input, { backgroundColor: '#eee' }]}
  value={usuarioSeleccionado?.id_usuario?.toString()}
  editable={false}
/>
      <TextInput
        style={styles.input}
        value={usuarioSeleccionado?.username}
        onChangeText={(text) =>
          setUsuarioSeleccionado({ ...usuarioSeleccionado, username: text })
        }
        placeholder="Nombre de usuario"
      />
      <TextInput
        style={styles.input}
        value={usuarioSeleccionado?.correo}
        onChangeText={(text) =>
          setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: text })
        }
        placeholder="Correo"
      />

      <Text style={{ marginBottom: 5 }}>Estado</Text>
      <SelectList
  data={[
    { key: 'activo', value: 'Activo' },
    { key: 'desactivar', value: 'Desactivar' },
  ]}
  setSelected={(val) =>
    setUsuarioSeleccionado({
      ...usuarioSeleccionado,
      estado: val === 'activo' ? 1 : 0
  })}
  save="key"
  defaultOption={{
    key: usuarioSeleccionado?.estado === 1 ? 'activo' : 'desactivar',
    value: usuarioSeleccionado?.estado === 1 ? 'Activo' : 'Desactivar',
  }}
  boxStyles={{ marginBottom: 15 }}
/>


      {/* ID Tipo */}
      <Text style={{ marginBottom: 5 }}>Tipo de Usuario</Text>
<SelectList
  data={[
    { key: '1', value: 'Administrador' },
    { key: '2', value: 'Operador' },
    { key: '3', value: 'Visitante' },
  ]}
  setSelected={(val) =>
    setUsuarioSeleccionado({ ...usuarioSeleccionado, id_tipo: val })
  }
  save="key"
  defaultOption={{
    key: usuarioSeleccionado?.id_tipo?.toString(),
    value:
      usuarioSeleccionado?.id_tipo === 1
        ? 'Administrador'
        : usuarioSeleccionado?.id_tipo === 2
        ? 'Operador'
        : 'Visitante',
  }}
  boxStyles={{ marginBottom: 15 }}
/>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity
  style={[styles.modifyButton, { flex: 1, marginRight: 5 }]}
  onPress={() => {
    // Primero validamos que los campos no estén vacíos
    if (usuarioSeleccionado?.username.trim()=='' || usuarioSeleccionado?.correo.trim()=='' ) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por favor, complete todos los campos.',
      });
      return; // Salimos si algún campo está vacío
    }
    console.log(
      usuarioSeleccionado.id_tipo);
    // Enviar los datos al servidor para guardar la información
    axios.post(`${API_URL}/cambiar_info_usuario.php`, {
      id_usuario: usuarioSeleccionado.id_usuario,
      username: usuarioSeleccionado.username,
      correo: usuarioSeleccionado.correo,
      estado: usuarioSeleccionado.estado,
      id_tipo: usuarioSeleccionado.id_tipo,
    })
    .then((respuesta) => {
      console.log(respuesta);
      if (respuesta.data.success) {
        Toast.show({
          type: 'success',
          text1: 'Listo',
          text2: 'El usuario se modificó correctamente',
        });
        setModalVisible(false); // Cerrar el modal
        obtenerUsuarios(); // Obtener la lista actualizada de usuarios
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Hubo un problema al guardar la información del usuario.',
        });
      }
    })
    .catch((error) => {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema con la conexión. Intenta de nuevo más tarde.',
      });
    });
  }}
>
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]}
          onPress={() => setModalVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

      <ScrollView contentContainerStyle={styles.listContainer}>
        {usuarios.map((item) => (
          <View key={item.id_usuario.toString()} style={styles.usuarioItem}>
            <Text style={styles.usuarioText}>Username: {item.username}</Text>
            <Text style={styles.usuarioText}>Correo: {item.correo}</Text><Text style={styles.usuarioText}>
  Estado: {item.estado === 1 ? 'Activo' : 'Desactivado'}
</Text>
<Text style={styles.usuarioText}>
  Tipo: {
    item.id_tipo === '1' || item.id_tipo === 1
      ? 'Administrador'
      : item.id_tipo === '2' || item.id_tipo === 2
      ? 'Operador'
      : 'Visitante'
  }
</Text>

            <View style={styles.buttonsContainer}>
            <TouchableOpacity
  style={styles.modifyButton}
  onPress={() => {
    setUsuarioSeleccionado(item);
    setModalVisible(true);
  }}
>
  <Icon name="pencil" size={20} color="#fff" />
  <Text style={styles.buttonText}>Modificar</Text>
</TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => eliminar_usuario(item.id_usuario)}>
                <Icon name="trash" size={20} color="#fff" />
                <Text style={styles.buttonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Agregar_btn onPress={() => setModalAgregarVisible(true)} />
      <Modal
  transparent={true}
  visible={modalAgregarVisible}
  animationType="slide"
  onRequestClose={() => setModalAgregarVisible(false)}
>
  <View style={styles.modalOverlay}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalTitle}>Agregar Nuevo Usuario</Text>

      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={nuevoUsuario.correo}
        onChangeText={(text) => setNuevoUsuario({ ...nuevoUsuario, correo: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={nuevoUsuario.username}
        onChangeText={(text) => setNuevoUsuario({ ...nuevoUsuario, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={nuevoUsuario.contraseña}
        onChangeText={(text) => setNuevoUsuario({ ...nuevoUsuario, contraseña: text })}
      />

      <Text style={{ marginBottom: 5 }}>Estado</Text>
      <SelectList
        data={[
          { key: 'activo', value: 'Activo' },
          { key: 'desactivar', value: 'Desactivar' },
        ]}
        setSelected={(val) =>
          setNuevoUsuario({ ...nuevoUsuario, estado: val === 'activo' ? true : false })
        }
        save="key"
        defaultOption={{ key: 'activo', value: 'Activo' }}
        boxStyles={{ marginBottom: 15 }}
      />

      <Text style={{ marginBottom: 5 }}>Tipo de Usuario</Text>
      <SelectList
        data={[
          { key: '1', value: 'Administrador' },
          { key: '2', value: 'Operador' },
          { key: '3', value: 'Visitante' },
        ]}
        setSelected={(val) =>
          setNuevoUsuario({ ...nuevoUsuario, id_tipo: val })
        }
        save="key"
        defaultOption={{ key: '1', value: 'Administrador' }}
        boxStyles={{ marginBottom: 15 }}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.modifyButton, { flex: 1, marginRight: 5 }]}
          onPress={() => {
            // Validar campos vacíos
            if (!nuevoUsuario.correo || !nuevoUsuario.username || !nuevoUsuario.contraseña || !nuevoUsuario.id_tipo) {
              Toast.show({
                type: 'error',
                text1: 'Campos incompletos',
                text2: 'Llena todos los campos.',
              });
              return;
            }

            // Enviar datos al servidor
            axios.post(`${API_URL}/agregar_usuario.php`, nuevoUsuario)
              .then((response) => {
                if (response.data.success) {
                  Toast.show({
                    type: 'success',
                    text1: 'Usuario agregado',
                  });
                  setModalAgregarVisible(false);
                  obtenerUsuarios(); // Refrescar lista
                  setNuevoUsuario({ correo: '', username: '', contraseña: '', estado: true, id_tipo: '1' }); // Resetear
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: response.data.message || 'No se pudo agregar',
                  });
                }
              })
              .catch((error) => {
                console.log(error);
                Toast.show({
                  type: 'error',
                  text1: 'Error de conexión',
                });
              });
          }}
        >
          <Text style={styles.buttonText}>Guardar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.deleteButton, { flex: 1, marginLeft: 5 }]}
          onPress={() => setModalAgregarVisible(false)}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
</Modal>

    </View>
  );
}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Fondo más suave
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2C3E50', // Color más profesional
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
  listContainer: {
    marginTop: 20,
  },
  usuarioItem: {
    padding: 20,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  usuarioText: {
    fontSize: 16,
    color: '#34495E', // Color más oscuro para el texto
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.5)',
  justifyContent: 'center',
  alignItems: 'center',
},
modalContainer: {
  width: '90%',
  backgroundColor: '#fff',
  padding: 20,
  borderRadius: 10,
},
modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
},

});