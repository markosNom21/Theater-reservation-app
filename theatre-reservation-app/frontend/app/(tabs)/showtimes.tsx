import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";

import { API_URL } from "../../config/api";

type Showtime = {
  showtime_id: number;
  show_id: number;
  show_date: string;
  show_time: string;
  hall: string;
  price: number;
  show_title: string;
};

export default function Showtimes() {
  const router = useRouter();
  const { showId, title } = useLocalSearchParams();

  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  if (showId) {
    fetchShowtimes();
  }
}, [showId]);

const fetchShowtimes = async () => {
  try {
    setLoading(true);

    const response = await fetch(`${API_URL}/showtimes/${String(showId)}`);
    const data = await response.json();

    setShowtimes(data);
  } catch (error) {
    console.log("SHOWTIMES ERROR:", error);
    alert("Could not load showtimes");
  } finally {
    setLoading(false);
  }
};

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading showtimes...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🕒</Text>
      <Text style={styles.title}>Showtimes</Text>
      <Text style={styles.subtitle}>{title}</Text>

      <FlatList
        data={showtimes}
        keyExtractor={(item) => item.showtime_id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/seats" as any,
                params: {
                  showtimeId: item.showtime_id,
                  title,
                  date: item.show_date,
                  time: item.show_time,
                  hall: item.hall,
                  price: item.price,
                },
              })
            }
          >
            <Text style={styles.date}>📅 {formatDate(item.show_date)}</Text>
            <Text style={styles.time}>⏰ {formatTime(item.show_time)}</Text>

            <View style={styles.infoRow}>
              <Text style={styles.badge}>🏛️ {item.hall}</Text>
              <Text style={styles.badge}>€{item.price}</Text>
            </View>

            <View style={styles.button}>
              <Text style={styles.buttonText}>Select Showtime</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No available showtimes.</Text>
        }
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/shows" as any)}
      >
        <Text style={styles.backText}>Back to Shows</Text>
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
    fontSize: 16,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 22,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
  },
  date: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e1b2e",
  },
  time: {
    fontSize: 17,
    color: "#6c4bd8",
    fontWeight: "bold",
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  badge: {
    backgroundColor: "#f3f3f6",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    color: "#333",
    fontWeight: "600",
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