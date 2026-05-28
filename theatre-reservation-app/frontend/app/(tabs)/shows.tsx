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
import { useRouter, useLocalSearchParams } from "expo-router";

import { API_URL } from "../../config/api";

type Show = {
  show_id: number;
  theatre_id: number;
  title: string;
  description: string;
  duration: number;
  age_rating: string;
  theatre_name: string;
  image_name: string;
};

export default function Shows() {
  const router = useRouter();
  const { theatreId, theatreName } = useLocalSearchParams();

  const [shows, setShows] = useState<Show[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShows();
  }, [theatreId]);

  const fetchShows = async () => {
    try {
      setLoading(true);

      const url = theatreId
        ? `${API_URL}/shows?theatreId=${String(theatreId)}`
        : `${API_URL}/shows`;

      const response = await fetch(url);
      const data = await response.json();

      setShows(data);
    } catch (error) {
      console.log("SHOWS ERROR:", error);
      alert("Could not load shows");
    } finally {
      setLoading(false);
    }
  };

  const filteredShows = shows.filter(
    (show) =>
      show.title.toLowerCase().includes(search.toLowerCase()) ||
      show.theatre_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading shows...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🎭</Text>
      <Text style={styles.title}>Available Shows</Text>

      <Text style={styles.subtitle}>
        {theatreName
          ? `Shows at ${String(theatreName)}`
          : "Choose a performance and reserve your seat"}
      </Text>

      <TextInput
        placeholder="Search by show or theatre..."
        placeholderTextColor="#999"
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />

      <Text style={styles.count}>{filteredShows.length} shows found</Text>

      <FlatList
        data={filteredShows}
        keyExtractor={(item) => item.show_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/show-details" as any,
                params: {
                  showId: item.show_id,
                  title: item.title,
                  description: item.description,
                  duration: item.duration,
                  ageRating: item.age_rating,
                  theatreName: item.theatre_name,
                  imageName: item.image_name,
                },
              })
            }
          >
            <View style={styles.cardHeader}>
              <Text style={styles.showTitle}>{item.title}</Text>
              <Text style={styles.ageBadge}>{item.age_rating}</Text>
            </View>

            <Text style={styles.theatre}>📍 {item.theatre_name}</Text>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoBadge}>⏱ {item.duration} min</Text>
              <Text style={styles.infoBadge}>🎟️ Details</Text>
            </View>

            <View style={styles.detailsButton}>
              <Text style={styles.detailsText}>View Details</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No shows found.</Text>}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          theatreId
            ? router.replace("/theatres" as any)
            : router.replace("/home" as any)
        }
      >
        <Text style={styles.backText}>
          {theatreId ? "Back to Theatres" : "Back to Home"}
        </Text>
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
    fontSize: 44,
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
    fontSize: 15,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  showTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1e1b2e",
    flex: 1,
  },
  ageBadge: {
    backgroundColor: "#efeafb",
    color: "#6c4bd8",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    fontWeight: "bold",
    overflow: "hidden",
  },
  theatre: {
    marginTop: 8,
    fontSize: 14,
    color: "#6c4bd8",
    fontWeight: "600",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  infoBadge: {
    backgroundColor: "#f3f3f6",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    color: "#333",
    fontWeight: "600",
  },
  detailsButton: {
    backgroundColor: "#6c4bd8",
    padding: 13,
    borderRadius: 14,
    marginTop: 16,
  },
  detailsText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
  },
  emptyText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
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