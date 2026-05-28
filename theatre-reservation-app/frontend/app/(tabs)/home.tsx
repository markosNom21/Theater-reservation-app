import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email?: string } | null>(
    null
  );

  useEffect(() => {
    const loadUser = async () => {
      let storedUser = null;

      if (Platform.OS === "web") {
        storedUser = localStorage.getItem("user");
      } else {
        storedUser = await SecureStore.getItemAsync("user");
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    try {
      if (Platform.OS === "web") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
      }

      router.replace("/login" as any);
    } catch (error) {
      console.log("LOGOUT ERROR:", error);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>🎭</Text>
      <Text style={styles.title}>Theatre Reservation</Text>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeText}>
          Welcome{user ? `, ${user.name}` : ""}!
        </Text>
        <Text style={styles.welcomeSubtext}>
          Book seats for your favorite theatre performances.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => router.push("/shows" as any)}
        >
          <Text style={styles.cardIcon}>🎟️</Text>
          <View>
            <Text style={styles.cardTitle}>Browse Shows</Text>
            <Text style={styles.cardText}>Find available performances</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
         style={styles.actionCard}
         onPress={() => router.push("/profile" as any)}
        >
          <Text style={styles.cardIcon}>👤</Text>
          <View>
            <Text style={styles.cardTitle}>My Profile</Text>
            <Text style={styles.cardText}>View or cancel your bookings</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => router.push("/theatres" as any)}
        >
          <Text style={styles.cardIcon}>🏛️</Text>
          <View>
            <Text style={styles.cardTitle}>Theatres</Text>
            <Text style={styles.cardText}>Explore theatres by location</Text>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1e1b2e",
    padding: 24,
    paddingTop: 60,
  },
  logo: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  welcomeCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 28,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e1b2e",
  },
  welcomeSubtext: {
    color: "#777",
    marginTop: 8,
    fontSize: 15,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  actionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    fontSize: 34,
    marginRight: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e1b2e",
  },
  cardText: {
    fontSize: 14,
    color: "#777",
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 16,
    borderRadius: 16,
    marginTop: "auto",
  },
  logoutText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
});