import { Modal,Alert,Pressable,  KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Bolitas from "../../componentes/componentes_login/bolitas";
import estilos_importados from "../../estilos/estilos_login/estilos_login_contrasena";
import axios from 'axios';
import { useState } from "react";
import { useToast } from 'react-native-toast-notifications';
import { API_URL } from '../../otros/configuracion';  
export default function Recuperar_password(){
    const toast = useToast();
    const [gmai, setgmail]=useState('');
    
  const [codigo, setCodigo] = useState('');
  const [visible, setVisible] = useState(false);
  const [codigoGmail, setCodigoGmail] = useState(0);
    function comprobar_contrasena() {
       
        const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formato.test(gmai)) {
          toast.show("Por favor, ingrese un correo electrónico válido.", { type:'error'});
          return;
        }
        axios.post(`${API_URL}/correo_recuperacion_password.php`,{
          correo_usuario:gmai
        }).then(function (respuesta) { console.log(respuesta.data.codigo);
          if(respuesta.data.success==false){
            toast.show("El correo no corresponde a un usuario existente", { type:'error'});
            return;
          }
          setCodigoGmail(respuesta.data.codigo);
          
          setVisible(true);
          }).catch(function (error) { console.log(error)  });
        
      }
      function validar_codigo(){
        if(codigoGmail!=codigo){
          toast.show("El codigo no es el correcto, Verifiquelo y vuelva a intentar", { type:'error'});
        }else{
          axios.post(`${API_URL}/buscar_password_usuario.php`,{
            correo:gmai
          }).then(function (respuesta) { 
           
            toast.show("La contraseña es: " + respuesta.data.contraseña, { type: 'error', duration: 5000 });

              return;
            }).catch(function (error) { console.log(error)  
              toast.show('Hubo un error al buscar la contraseña');});
              setVisible(false);
              setgmail('');
              setCodigo('');
        }
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
        <TextInput style={estilos_importados.inputs} onChangeText={setgmail} value={gmai} placeholder="Ingrese su correo electronico estudiantil" keyboardType='email-address' />
        </View>
        <TouchableOpacity style={[estilos_importados.boton,{backgroundColor:'#99d4eb'}]} onPress={comprobar_contrasena} >
                        <Text style={estilos_importados.botonTexto}>Recuperar Contraseña</Text>
                        <Icon name="arrow-forward" size={30} color={'white'} />
                    </TouchableOpacity>
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