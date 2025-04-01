import { AuthProvider } from "@/context/authContext/AuthContext";
import { ProductProvider } from "@/context/productsContext/productsContext"; 
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(app)" />
        </Stack>
      </ProductProvider>
    </AuthProvider>
  );
}
