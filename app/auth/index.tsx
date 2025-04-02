import React, { useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Image 
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/authContext/AuthContext";

const AuthScreen = () => {
  const router = useRouter();
  const { login, register, userRole } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [focusedInput, setFocusedInput] = useState(null);
  const [errorMessage, setErrorMessage] = useState<{ email?: string, password?: string, name?: string }>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAuth = async () => {
    let errors: { email?: string; password?: string; name?: string } = {};

    if (!email) {
      errors.email = "El correo es obligatorio.";
    } else if (!validateEmail(email)) {
      errors.email = "Formato de email inválido.";
    }

    if (!password) {
      errors.password = "La contraseña es obligatoria.";
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    if (!isLogin && !name) {
      errors.name = "El nombre es obligatorio.";
    }

    setErrorMessage(errors);
    
    if (Object.keys(errors).length > 0) return;

    try {
      if (isLogin) {
        await login(email, password);
        Alert.alert("Éxito", "Usuario ingresado correctamente.");
      } else {
        await register(email, password, name);
        Alert.alert("Éxito", "Usuario creado exitosamente.");
      }

      // Redirigir según el rol del usuario
      if (userRole === "admin") {
        router.push("/caja/platos");
      } else if (userRole === "user") {
        router.push("./cliente/dashboardCliente");
      } else {
        // Si no tiene un rol válido, redirigir a una página por defecto o mostrar un error
        Alert.alert("Error", "Rol de usuario no reconocido.");
      }
    } catch (error: any) {
      Alert.alert("Error", getErrorMessage(error.code));
    }
  };

  const getErrorMessage = (errorCode: string) => {
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
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />
      <Text style={styles.greeting}>¡Bienvenido al ManGusteau!</Text>
      <Text style={styles.title}>{isLogin ? "Inicia Sesión" : "Crea tu cuenta"}</Text>

      {!isLogin && (
        <>
          <TextInput
            style={[
              styles.input,
              focusedInput === "name" && styles.inputFocused,
              errorMessage.name && styles.inputError
            ]}
            placeholder="Nombre"
            placeholderTextColor="#A1A1A1"
            value={name}
            onChangeText={setName}
            onBlur={() => setFocusedInput(null)}
          />
          {errorMessage.name && <Text style={styles.errorText}>{errorMessage.name}</Text>}
        </>
      )}

      <TextInput
        style={[
          styles.input,
          focusedInput === "email" && styles.inputFocused,
          errorMessage.email && styles.inputError
        ]}
        placeholder="Correo electrónico"
        placeholderTextColor="#A1A1A1"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setFocusedInput(null)}
      />
      {errorMessage.email && <Text style={styles.errorText}>{errorMessage.email}</Text>}

      <TextInput
        style={[
          styles.input,
          focusedInput === "password" && styles.inputFocused,
          errorMessage.password && styles.inputError
        ]}
        placeholder="Contraseña"
        placeholderTextColor="#A1A1A1"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        onBlur={() => setFocusedInput(null)}
      />
      {errorMessage.password && <Text style={styles.errorText}>{errorMessage.password}</Text>}

      <TouchableOpacity style={styles.mainButton} onPress={handleAuth}>
        <Text style={styles.mainButtonText}>{isLogin ? "Entrar" : "Registrarme"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.toggleContainer} onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Text style={styles.toggleTextHighlight}>{isLogin ? "Regístrate" : "Inicia sesión"}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 40,
    marginTop: -80,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 20,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "400",
    color: "#666666",
    marginBottom: 40,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  inputFocused: {
    borderColor: "#FBB03B",
    borderWidth: 2,
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  mainButton: {
    backgroundColor: "#FBB03B",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    width: "100%",
  },
  mainButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  toggleContainer: {
    marginTop: 24,
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
