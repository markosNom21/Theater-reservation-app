import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";

import { API_URL } from "../../config/api";

type Theatre = {
  theatre_id: number;
  name: string;
  location: string;
  description: string;
};

export default function Theatres() {
  const router = useRouter();

  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTheatres();
  }, []);

  const fetchTheatres = async () => {
    try {
      const response = await fetch(`${API_URL}/theatres`);
      const data = await response.json();
      setTheatres(data);
    } catch (error) {
      console.log("THEATRES ERROR:", error);
      alert("Could not load theatres");
    } finally {
      setLoading(false);
    }
  };

  const filteredTheatres = theatres.filter(
    (theatre) =>
      theatre.name.toLowerCase().includes(search.toLowerCase()) ||
      theatre.location.toLowerCase().includes(search.toLowerCase()) ||
      theatre.description.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading theatres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🏛️</Text>
      <Text style={styles.title}>Theatres</Text>
      <Text style={styles.subtitle}>Explore theatres by name or location</Text>

      <TextInput
        placeholder="Search by theatre or location..."
        placeholderTextColor="#999"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.count}>{filteredTheatres.length} theatres found</Text>

      <FlatList
        data={filteredTheatres}
        keyExtractor={(item) => item.theatre_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.theatreName}>{item.name}</Text>
            <Text style={styles.location}>📍 {item.location}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                router.push({
                  pathname: "/shows" as any,
                  params: {
                    theatreId: item.theatre_id,
                    theatreName: item.name,
                  },
                })
              }
            >
              <Text style={styles.buttonText}>View Shows</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No theatres found.</Text>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/home" as any)}
      >
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    backgroundColor: "#1e1b2e",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 12,
  },
  container: {
    flex: 1,
    backgroundColor: "#1e1b2e",
    padding: 20,
    paddingTop: 55,
  },
  logo: {
    fontSize: 46,
    textAlign: "center",
    marginBottom: 6,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    color: "#c9c5df",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  search: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 15,
    fontSize: 15,
    marginBottom: 12,
  },
  count: {
    color: "#c9c5df",
    marginBottom: 14,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
  },
  theatreName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1e1b2e",
  },
  location: {
    marginTop: 8,
    color: "#6c4bd8",
    fontWeight: "600",
  },
  description: {
    marginTop: 10,
    color: "#666",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#6c4bd8",
    padding: 13,
    borderRadius: 14,
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
  },
  backButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginTop: 10,
  },
  backText: {
    color: "#6c4bd8",
    textAlign: "center",
    fontWeight: "bold",
  },
});