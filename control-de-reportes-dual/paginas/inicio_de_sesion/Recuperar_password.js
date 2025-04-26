import { Modal,Alert,Pressable,  KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Bolitas from "../../componentes/componentes_login/bolitas";
import estilos_importados from "../../estilos/estilos_login/estilos_login_contrasena";
import { useState } from "react";
import { useToast } from 'react-native-toast-notifications';
export default function Recuperar_password(){
    const toast = useToast();
    const [password, setpassword]=useState('');
    
  const [codigo, setCodigo] = useState('');
  const [visible, setVisible] = useState(false);
    function comprobar_contrasena() {
       
        const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formato.test(password)) {
          toast.show("Por favor, ingrese un correo electrónico válido.", { type:'error'});
          return;
        }
        setVisible(true);
        // aqui mandaras la peticon a la api que hagas para mandar el correo electronico y como respuestas le mandaras el codigo de validacion para despues validar si es el bueno o no usa un  toast.show si esta mal el numero o pon el la contraseña de bd 
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
        <TextInput style={estilos_importados.inputs} onChangeText={setpassword} value={password} placeholder="Ingrese su correo electronico estudiantil" keyboardType='email-address' />
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
              <Pressable style={estilos.boton} >
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