import { AuthProvider } from "@/context/authContext/AuthContext";
import { OrderProvider } from "@/context/orderContext/OrderContext";
import { ProductProvider } from "@/context/productsContext/ProductsContext"; 
import { Stack } from "expo-router";


export default function RootLayout() {
  return (
    <AuthProvider>
      <ProductProvider>
        <OrderProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth" />
          <Stack.Screen name="(app)" />
        </Stack>
      </OrderProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
