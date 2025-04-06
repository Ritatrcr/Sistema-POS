// app/codigoQr.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';


const CodigoQr = () => {
  return (
   
    <View style={styles.container}>
      <Text style={styles.title}>Pizza Casera</Text>
      <Text style={styles.subtitle}>Scan your QR Code</Text>
      
      <Image 
        source={{ uri: 'https://via.placeholder.com/150' }} 
        style={styles.qrCode} 
      />
      
      <TouchableOpacity style={styles.scanButton}>
        <MaterialIcons name="qr-code-scanner" size={40} color="#fff" />
        <Text style={styles.scanText}>Scan QR Code</Text>
      </TouchableOpacity>

    </View>
    
  );
};

export default CodigoQr;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FBB03B",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 18,
    color: "#fff",
    marginVertical: 10,
  },
  qrCode: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  scanButton: {
    backgroundColor: "#333",
    padding: 10,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  scanText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
