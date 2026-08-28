import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { login, register } from "../lib/api";

export default function LoginScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password || (isRegister && !name)) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register({ email, password, display_name: name });
      } else {
        await login(email, password);
      }
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login("priya@example.com", "demo123");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Demo login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>PackagePro</Text>
        <Text style={styles.subtitle}>Guide Portal</Text>

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={setName}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#94A3B8"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegister ? "Create Account" : "Sign In"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={handleDemoLogin}
          disabled={loading}
        >
          <Text style={styles.demoButtonText}>Demo Login (Priya)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.link}>
            {isRegister
              ? "Already have an account? Sign In"
              : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#F59E0B",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#F8FAFC",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  demoButton: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#F59E0B",
  },
  demoButtonText: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "600",
  },
  link: {
    color: "#60A5FA",
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
  },
});
