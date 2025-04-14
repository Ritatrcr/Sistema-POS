import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useState } from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { useOrder } from '../../../context/orderContext/OrderContext'; // Importamos el hook del contexto

export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [qr, setQr] = useState('');
  const [scanned, setScanned] = useState(false);

  // Accedemos a las funciones de la base de datos a través del contexto
  const { createOrder } = useOrder(); 

  const handleQrScanned = ({ data }: { data: string }) => {
    if (!scanned) {
      setQr(data);
      setScanned(true);
      console.log('QR Scanned:', data);
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const handleSaveTable = async () => {
    if (qr) {
      // Suponemos que el ID de la mesa es el valor del QR
      const orderData = {
        producto: [],
        precioTotal: 0,
        estado: "ordenado", // Estado inicial de la mesa
        userId: "123", // ID de usuario de ejemplo, reemplazar por el real
        fechaRealizacion: new Date().toLocaleDateString(),
        horaRealizacion: new Date().toLocaleTimeString(),
      };

      await createOrder(orderData); // Guardamos la mesa
      console.log("Mesa guardada en la base de datos.");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={handleQrScanned}
      />

      {qr ? (
        <View style={styles.qrInfo}>
          <Text style={styles.qrText}>Estas sentado en la mesa: {qr}</Text>
          <Button
            title="Scan Again"
            onPress={() => {
              setQr('');
              setScanned(false);
            }}
          />
          <Button
            title="Save Table"
            onPress={handleSaveTable} // Llamamos a la función para guardar la mesa
          />
          <Button
            title="Go to Menu"
            onPress={() => {
              router.push({
                pathname: '/cliente',
                params: { qr },
              });
            }}
          />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBB03B',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  camera: {
    width: '50%',
    height: '50%',
    borderRadius: 20, 
    position: 'absolute',
  },
  qrInfo: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  qrText: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
});
