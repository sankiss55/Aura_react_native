import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectList } from 'react-native-dropdown-select-list';
import Toast from "react-native-toast-message";
import Icon from 'react-native-vector-icons/Ionicons';
import Agregar_btn from "../../componentes/componentes_app/agregar";

import { API_URL } from '../../otros/configuracion'; 
export default function Semanas() {
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
  function eliminar_ciclo_escolar(id) {

    axios.post(`${API_URL}/borrarciclo_escolar.php`, {
      id_usuario: id
    }).then(function (respuesta) {
      console.log(respuesta.data);
      Toast.show({
        type: 'success',
        text1: 'Listo',
        text2: 'El usuario se ha borrado exitosamente ',
      });
    }).catch(function (error) {
      console.log(error);
    });
    obtenerciclos();
  }
  const obtenerciclos = async () => {
    try {
      const response = await axios.post(`${API_URL}/all_semanas.php`);
      if (response.data.success) {
console.log(response.data.semanas);
        setUsuarios(response.data.semanas);  // Suponiendo que la respuesta tiene un campo 'usuarios' con la lista de ciclos
        const opciones = response.data.semanas.map((item) => ({
            key: item.id_ciclo.toString(),  // Asegúrate de que sea string
            value: item.nombre_ciclo + '( Fecha de inicio: ' +item.fecha_inicio+' Fecha final: '+item.fecha_fin+ ')'
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
    useEffect(() => {
        const fetchCiclos = async () => {
          const opciones = await obtenerciclos(); // Espera el resultado
          setListaCiclos(opciones || []); // Lo asigna correctamente
        };
      
        fetchCiclos();
      }, []);
      

 
  function guardar_ciclo_escolar() {
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
  
  alert(cicloSeleccionado);
    axios.post(`${API_URL}/guardar_semana.php`, {
      nombreCiclo,
      fechaInicio: fechaInicioSQL,
      fechaFin: fechaFinSQL,
      idCiclo: cicloSeleccionado
    })
    .then(function (respuesta) {
        console.log(respuesta.data.message);
      if (respuesta.data.success === false) {
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
        // Limpiar campos
        setNombreCiclo('');
        setDiaInicio('');
        setMesInicio('');
        setAñoInicio('');
        setDiaFin('');
        setMesFin('');
        setAñoFin('');
        setCicloSeleccionado('');
        setModalAgregarVisible(false);
      }
    })
    .catch(function () {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Por ahora no se puede hacer esa acción.',
      });
    });
  }
  
  return (
    <View style={style.container}>
        <TextInput
                style={style.input}
                placeholder="Ingresa el nombre de la semana"
                value={username}
                onChangeText={handleChange}
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
                style={style.modifyButton}
               
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
            <Text>Selecciona ciclo escolar:</Text>
<SelectList
  setSelected={(val) => setCicloSeleccionado(val)}
  data={listaCiclos}
  placeholder="Selecciona un ciclo"
  boxStyles={{ marginBottom: 10 }}
/>
            <View style={style.buttonContainer}>
              <TouchableOpacity
                style={style.buttonCancelar}
                onPress={() => setModalAgregarVisible(false)}
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
