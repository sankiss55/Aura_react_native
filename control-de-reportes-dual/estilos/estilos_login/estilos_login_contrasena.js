import { StyleSheet } from "react-native";
const estilos_inputs=StyleSheet.create({
    boton: {
        backgroundColor: '#FF0066',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 10
    },
    botonTexto: {
        fontFamily: 'Nunito_700Bold',
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
    textos: {
        fontFamily: "Nunito_700Bold",
        fontSize: 50,
    },
    contenedor_hijo: {
        zIndex: 99,
        width: '90%',
        gap: 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        flexGrow: 1,
    },
    contenedores_inputs: {
        display: 'flex',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: 'row',
        width: '100%',
        borderWidth: 2,
        borderRadius: 10,
        borderColor: 'black',
    },
    inputs: {
        fontFamily: 'Nunito_400Regular',
        fontSize: 16,
        width: '100%',
        padding: 10,
    },
})
export default estilos_inputs;