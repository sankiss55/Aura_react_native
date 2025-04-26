import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function Bolitas({color}) {
    return (
        <View style={{position: 'absolute', width:'100%',  height:'100%' }}>
            <Svg style={styles.bolita1} viewBox="0 0 200 200" width={400} height={400}>
                <Path
                    fill={color}
                    d="M54.3,-50.1C61.6,-34.2,52.5,-12.2,47.9,12.1C43.2,36.3,43,62.6,30.3,72.4C17.5,82.2,-7.8,75.5,-24.7,62.9C-41.5,50.3,-49.9,31.8,-57,10.3C-64.1,-11.3,-69.9,-35.8,-60.2,-52.2C-50.5,-68.6,-25.3,-76.8,-0.9,-76.1C23.5,-75.4,47.1,-65.9,54.3,-50.1Z"
                    transform="translate(100 100)"
                />
            </Svg>

            <Svg style={styles.bolita2} viewBox="0 0 200 200" width={400} height={400}>
                <Path
                    fill={color}
                    d="M50.3,-70.6C61.4,-61.1,64.1,-41.4,65.2,-24.4C66.3,-7.4,65.8,6.9,61.9,20.5C58,34.1,50.8,47,39.9,52.6C29,58.1,14.5,56.4,2.9,52.4C-8.7,48.4,-17.4,42.2,-33.3,38.2C-49.1,34.3,-72.1,32.6,-79.8,22.7C-87.5,12.7,-80,-5.4,-71.8,-21.1C-63.6,-36.7,-54.7,-49.8,-42.6,-59C-30.5,-68.1,-15.2,-73.4,2.2,-76.4C19.6,-79.3,39.2,-80.1,50.3,-70.6Z"
                    transform="translate(100 100)"
                />
            </Svg>
        </View>
    );
}

const styles = StyleSheet.create({
    bolita1: {
        position: 'absolute',
        top: -100,
        left: '40%',
    },
    bolita2: {
        position: 'absolute',
        top: '70%',
        right: '40%',
    },
});
