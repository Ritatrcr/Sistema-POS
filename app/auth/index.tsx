// app/auth.tsx
import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/authContext/AuthContext";

const AuthScreen = () => {
  const router = useRouter();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa un email y una contraseña.");
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push("/dashboard");
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error.code));
    }
  };


  const getErrorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Formato de email inválido.";
      case "auth/user-not-found":
        return "Usuario no encontrado.";
      case "auth/wrong-password":
        return "Contraseña incorrecta.";
      case "auth/email-already-in-use":
        return "Este email ya está registrado.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      default:
        return "Ocurrió un error. Inténtalo de nuevo.";
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>¡Hola!</Text>
      <Text style={styles.title}>
        {isLogin ? "Inicia Sesión" : "Crea tu cuenta"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#A1A1A1"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#A1A1A1"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
        <Text style={styles.mainButtonText}>
          {isLogin ? "Entrar" : "Registrarme"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleContainer}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.toggleText}>
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Text style={styles.toggleTextHighlight}>
            {isLogin ? "Regístrate" : "Inicia sesión"}
          </Text>
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",   // Fondo blanco para parecerse al estilo limpio
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 4,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 24,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  mainButton: {
    backgroundColor: "#FBB03B",  // Color de acento (naranja/dorado)
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    alignSelf: "center",
    marginTop: 16,
  },
  toggleText: {
    color: "#666666",
    fontSize: 14,
  },
  toggleTextHighlight: {
    color: "#FBB03B",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  
});
