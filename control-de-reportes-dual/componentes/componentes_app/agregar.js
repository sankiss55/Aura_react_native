import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
export default function Agregar_btn({onPress}){
    return(
        <TouchableOpacity style={styles.agregar_btn}  onPress={onPress} >
            <Icon name='add-circle' size={100} color={'rgb(92, 120, 230)'} />
        </TouchableOpacity>
    )
}
const styles=StyleSheet.create({
    agregar_btn:{
        width:100,
        zIndex:999,
        position:'absolute',
        left:'80%',
        top:'90%'
          },
})