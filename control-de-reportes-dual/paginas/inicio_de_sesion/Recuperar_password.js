import axios from 'axios';
import { useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useToast } from 'react-native-toast-notifications';
import Icon from 'react-native-vector-icons/Ionicons';
import Bolitas from "../../componentes/componentes_login/bolitas";
import estilos_importados from "../../estilos/estilos_login/estilos_login_contrasena";
import { API_URL } from '../../otros/configuracion';
export default function Recuperar_password(){
  
    const toast = useToast();
    const [modalNuevaContrasenaVisible, setModalNuevaContrasenaVisible] = useState(false);
const [nuevaContrasena, setNuevaContrasena] = useState('');
const [confirmarContrasena, setConfirmarContrasena] = useState('');

    const [gmai, setgmail]=useState('');
    const [cargando, setCargando] = useState(false);
  const [codigo, setCodigo] = useState('');
  const [visible, setVisible] = useState(false);
  const [codigoGmail, setCodigoGmail] = useState(0);
    function comprobar_contrasena() {
       
        const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formato.test(gmai)) {
          toast.show("Por favor, ingrese un correo electrónico válido.", { type:'error', placement: 'top'});
          return;
        }
        setCargando(true);
        
        axios.post(`${API_URL}/correo_recuperacion_password.php`,{
          correo_usuario:gmai
        }).then(function (respuesta) { console.log(respuesta.data.codigo);
          if(respuesta.data.success==false){
            toast.show("El correo no corresponde a un usuario existente", { type:'error', placement: 'top'});
            setCargando(false);
            return;
          }
          setCodigoGmail(respuesta.data.codigo);
          
          setVisible(true);
          }).catch(function (error) { console.log(error)  }).finally(() => {
            setCargando(false); 
          });
        
      }
      function validar_codigo() {
        if (codigoGmail != codigo) {
          toast.show("El código no es el correcto, verifíquelo y vuelva a intentar", { type: 'error' , placement: 'top'});
        } else {
          setVisible(false);
          setModalNuevaContrasenaVisible(true);
        }
      }
      function guardar_nueva_contrasena() {
        if (nuevaContrasena.length < 6) {
          toast.show("La contraseña debe tener al menos 6 caracteres", { type: 'error' , placement: 'top'});
          return;
        }
      
        if (nuevaContrasena !== confirmarContrasena) {
          toast.show("Las contraseñas no coinciden", { type: 'error', placement: 'top' });
          return;
        }
      
        axios.post(`${API_URL}/actualizar_password_usuario.php`, {
          correo: gmai,
          nueva_contrasena: nuevaContrasena
        }).then(response => {
          if (response.data.success) {
            toast.show("Contraseña actualizada correctamente", { type: 'success', placement: 'top' });
            setModalNuevaContrasenaVisible(false);
            setgmail('');
            setCodigo('');
            setNuevaContrasena('');
            setConfirmarContrasena('');
          } else {
            toast.show("Error al actualizar la contraseña", { type: 'error', placement: 'top' });
          }
        }).catch(error => {
          console.log(error);
          toast.show("Hubo un error en la solicitud", { type: 'error', placement: 'top' });
        });
      }
      
    return (
         <View
                        style={estilos.contenedor}
                    >
                        
            <Bolitas color={"#26BF69"} />
        <View style={estilos_importados.contenedor_hijo}>
            
 <Text style={[estilos_importados.textos ,{fontSize:25}]} >
           Recuperacion de contraseña
        </Text>
        <View style={estilos_importados.contenedores_inputs}>
        <Icon name="mail" size={30} />
        <TextInput style={estilos_importados.inputs} onChangeText={setgmail} value={gmai} placeholder="Ingrese su correo electronico" keyboardType='email-address' placeholderTextColor="#888" />
        </View>
        <TouchableOpacity style={[estilos_importados.boton,{backgroundColor:'#99d4eb'}]} onPress={comprobar_contrasena} >
                        <Text style={estilos_importados.botonTexto}>Recuperar Contraseña</Text>
                        <Icon name="arrow-forward" size={30} color={'white'} />
                    </TouchableOpacity>
                    {cargando && (
  <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
)}
                    <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View style={estilos.modalFondo}>
          <View style={estilos.modalContenido}>
            <Text style={estilos.titulo}>Ingrese el código de validación:</Text>

            <TextInput
              style={estilos.input}
              placeholder="Código"
              value={codigo}
              onChangeText={setCodigo}
              keyboardType="numeric"
              placeholderTextColor="#888"
            />

            <View style={estilos.botones}>
              <Pressable style={estilos.boton} onPress={validar_codigo} >
                <Text style={estilos.textoBoton}>Validar</Text>
              </Pressable>
              <Pressable style={[estilos.boton, estilos.botonCerrar]} onPress={() => setVisible(false)}>
                <Text style={estilos.textoBoton}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal><Modal
  animationType="slide"
  transparent={true}
  visible={modalNuevaContrasenaVisible}
  onRequestClose={() => setModalNuevaContrasenaVisible(false)}
>
  <View style={estilos.modalFondo}>
    <View style={estilos.modalContenido}>
      <Text style={estilos.titulo}>Ingrese su nueva contraseña:</Text>

      <TextInput
        style={estilos.input}
        placeholder="Nueva contraseña"
        value={nuevaContrasena}
        onChangeText={setNuevaContrasena}
        secureTextEntry={true}
        placeholderTextColor="#888"
      />

      <TextInput
        style={estilos.input}
        placeholder="Repita la nueva contraseña"
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        secureTextEntry={true}
        placeholderTextColor="#888"
      />

      <View style={estilos.botones}>
        <Pressable style={estilos.boton} onPress={guardar_nueva_contrasena}>
          <Text style={estilos.textoBoton}>Guardar</Text>
        </Pressable>
        <Pressable
          style={[estilos.boton, estilos.botonCerrar]}
          onPress={() => setModalNuevaContrasenaVisible(false)}
        >
          <Text style={estilos.textoBoton}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  </View>
</Modal>


        </View>
        
        </View>
    )
}
const estilos=StyleSheet.create({
contenedor:{
    flex:1,
    display:'flex',
    justifyContent:'center',
    alignContent:'center',
    alignItems:'center'
},   modalFondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContenido: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
    elevation: 8
  },
  titulo: {
    fontSize: 18,
    marginBottom: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  boton: {
    flex: 1,
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center'
  },
  botonCerrar: {
    backgroundColor: '#f44336'
  },
  textoBoton: {
    color: 'white',
    fontWeight: 'bold'
  },
  botonAbrir: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 10
  }
});