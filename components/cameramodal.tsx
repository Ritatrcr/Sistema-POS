import React, { useState, useRef } from 'react';
import { Modal, View, TouchableOpacity, Text, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function CameraModal({ isVisible, setIsVisible, setImage }: any) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);

  const handleImagePick = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        if (result.assets && result.assets.length > 0) {
          setImage(result.assets[0].uri); // Set the selected image
        }
      }
    } else {
      alert('Permiso de galería denegado');
    }
  };

  const handleTakePhoto = async (camera: any) => {
    const photo = await camera.takePictureAsync();
    if (photo.uri) {
      setImage(photo.uri); // Set the taken photo
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={styles.headerText}>Selecciona una opción</Text>
          {permission?.granted ? (
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}>
                  <Text style={styles.text}>Voltear Cámara</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleTakePhoto(cameraRef.current)}>
                  <Text style={styles.text}>Tomar Foto</Text>
                </TouchableOpacity>
              </View>
            </CameraView>
          ) : (
            <View style={styles.permissionContainer}>
              <Text style={styles.permissionMessage}>
                "PS Express" quiere acceder a tus fotos
              </Text>
              <Text style={styles.permissionDescription}>
                Al otorgar acceso, podrá editar fotografías de su biblioteca de fotografías.
              </Text>
              <View style={styles.permissionButtons}>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                  <Text style={styles.permissionButtonText}>Permitir</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.permissionButton} onPress={() => setIsVisible(false)}>
                  <Text style={styles.permissionButtonText}>No permitir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <TouchableOpacity onPress={handleImagePick} style={styles.optionButton}>
            <Text style={styles.optionText}>Seleccionar de la galería</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.optionButton}>
            <Text style={styles.optionText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    width: 300,
  },
  headerText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  camera: {
    width: '100%',

    minHeight: 300,
    borderRadius: 12,
    overflow: 'hidden',  
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    backgroundColor: '#FBB03B',
    borderRadius: 5,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  optionButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FBB03B',
    borderRadius: 5,
  },
  optionText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  permissionContainer: {
    backgroundColor: '#F1F1F1',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#FFB772',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    height: 300,
    flexDirection: 'column',  

    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  permissionMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginBottom: 20,
  },
  permissionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  permissionButton: {
    padding: 10,
    backgroundColor: '#FBB03B',
    borderRadius: 5,
    margin: 5,
  },
  permissionButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
