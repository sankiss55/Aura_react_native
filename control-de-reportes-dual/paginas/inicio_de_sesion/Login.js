import { Nunito_400Regular, Nunito_700Bold, useFonts } from "@expo-google-fonts/nunito";
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import Bolitas from "../../componentes/componentes_login/bolitas";
import estilos_importados from "../../estilos/estilos_login/estilos_login_contrasena";
import { useState } from "react";
export default function Login() {
    const [ver_password, setVer_password]=useState(false);
    const navigation = useNavigation();
    
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
                        <Icon name="person-sharp" size={30} />
                        <TextInput style={estilos_importados.inputs} placeholder="Ingrese su usuario" />
                    </View>

                    <View style={[estilos_importados.contenedores_inputs,{paddingLeft:40, paddingRight:50}]}>
                        <Icon name="lock-closed" size={30}  />
                        <TextInput style={estilos_importados.inputs} secureTextEntry={!ver_password}  placeholder="Ingrese su contraseña" />
                       <TouchableOpacity onPress={() => setVer_password(!ver_password)}>
                       <Icon name={ver_password ? "eye-off-outline" : "eye-outline"} size={30} />
                       </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[estilos_importados.boton, {backgroundColor:'#ba99eb'}]}>
                        <Text style={[estilos_importados.botonTexto]}>Ingresar</Text>
                        <Icon name="arrow-forward" size={30} color={'white'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.perdisteCont}>
  <Text style={styles.perdisteTexto} onPress={()=>{navigation.navigate('Recuperar Contraseña')}} >¿Perdiste tu contraseña?</Text>
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
