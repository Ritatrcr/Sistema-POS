import React from 'react';
import { Modal, View, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CameraModal({ isVisible, setIsVisible, setImage }: any) {
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
          console.log("RESULTADO",result); // Log the selected image URI
          setImage(result.assets[0].uri); // Set the selected image URI
        }
      }
    }
  };

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Selecciona una Imagen</Text>
          <TouchableOpacity onPress={handleImagePick} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 16, color: '#FBB03B' }}>Seleccionar de la galería</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsVisible(false)}>
            <Text style={{ fontSize: 16, color: '#FBB03B' }}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
