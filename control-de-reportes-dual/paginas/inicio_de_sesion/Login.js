import { Nunito_400Regular, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-notifications";
import Icon from 'react-native-vector-icons/Ionicons';
import Bolitas from "../../componentes/componentes_login/bolitas";
import estilos_importados from "../../estilos/estilos_login/estilos_login_contrasena";
import { API_URL } from '../../otros/configuracion';
export default function Login({ navigation }) {  
    const [ver_password, setVer_password]=useState(false);
    const navegacion = useNavigation();
    const [usuario,setusuario]=useState('');
    const [password, setpassword]=useState('');
     function  validar_usuario() {
       
        axios.post(`${API_URL}/login.php`,{
            usuario:usuario,
            password:password,
        }).then(async function  (respuesta) {
            console.log(respuesta);
            if(respuesta.data.success==false){
                Toast.show(respuesta.data.respuesta, { type:'error', placement: 'top'});
                return;
            }
            const datos= respuesta.data.respuesta[0];
            await Guardar_usuarios_globales(datos);
            navigation.replace('drawer');
           Toast.show('🌟 ¡Bienvenido! '+ datos.username, { type:'success', placement: 'top'});
          }).catch(function(error){
            console.log(error);
          });
      }
      const Guardar_usuarios_globales = async (usuario) => {
        try {
          await AsyncStorage.setItem('id_usuario', usuario.id_usuario.toString());  
          await AsyncStorage.setItem('username', usuario.username);  
          await AsyncStorage.setItem('correo', usuario.correo);  
          await AsyncStorage.setItem('estado', usuario.estado.toString()); 
          await AsyncStorage.setItem('id_tipo', usuario.id_tipo.toString()); 
      
          console.log('Datos del usuario guardados en AsyncStorage');
        } catch (error) {
          console.error('Error al guardar datos en AsyncStorage:', error);
        }
      };
    let [fontsLoaded] = useFonts({
        Nunito_700Bold,
        Nunito_400Regular,
    });
    if (!fontsLoaded) {
        return null;
    } else {
        return (
            <View style={styles.container}>
                
<Bolitas color="#DAF7A6" />
                <View style={estilos_importados.contenedor_hijo}>
                    
                    <Text style={estilos_importados.textos}>
                        Bienvenido
                    </Text>
                    <View style={estilos_importados.contenedores_inputs}>
                        <Icon name="mail" size={30} />
                        <TextInput style={estilos_importados.inputs} placeholder="Ingrese su correo"  keyboardType='email-address' value={usuario} onChangeText={setusuario} placeholderTextColor="#888" />
                    </View>

                    <View style={[estilos_importados.contenedores_inputs,{paddingLeft:40, paddingRight:50}]}>
                        <Icon name="lock-closed" size={30}  />
                        <TextInput style={estilos_importados.inputs} secureTextEntry={!ver_password}  placeholder="Ingrese su contraseña" value={password} onChangeText={setpassword} placeholderTextColor="#888" />
                       <TouchableOpacity onPress={() => setVer_password(!ver_password)}>
                       <Icon name={ver_password ? "eye-off-outline" : "eye-outline"} size={30} />
                       </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[estilos_importados.boton, {backgroundColor:'#ba99eb'}]} onPress={validar_usuario}>
                        <Text style={[estilos_importados.botonTexto]}>Ingresar</Text>
                        <Icon name="arrow-forward" size={30} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.perdisteCont}>
  <Text style={styles.perdisteTexto} onPress={()=>{navegacion.navigate('Recuperar Contraseña')}} >¿Perdiste tu contraseña?</Text>
</TouchableOpacity>

                </View>
                </View>
        )
    }
}

const styles = StyleSheet.create({
    perdisteCont: {
        alignSelf: 'flex-end',
        marginTop: 5,
        marginRight: 30,
      },
      
      perdisteTexto: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 14,
        color: 'black',
        textDecorationLine: 'underline',
      },
   
    
    container: {
        flex: 1,
        width:'100%',
        height:'100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
});
