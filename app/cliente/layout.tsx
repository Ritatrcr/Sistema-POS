
import { Stack } from "expo-router";

export default function clienteLayout() {
  return (
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="dashboardCliente" />
          <Stack.Screen name="verOrden" />
        </Stack>
  );
}
