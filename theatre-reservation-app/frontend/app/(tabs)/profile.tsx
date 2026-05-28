import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter, useFocusEffect } from "expo-router";

import { API_URL } from "../../config/api";

type User = {
  name: string;
  email: string;
};

type Reservation = {
  reservation_id: number;
  total_price: number;
  status: string;
  created_at: string;
  showtime_id: number;
  show_date: string;
  show_time: string;
  hall: string;
  show_title: string;
  theatre_name: string;
  theatre_location: string;
  seats: string;
};

type Stats = {
  totalReservations: number;
  totalSeats: number;
  favoriteShow: string;
  favoriteTheatre: string;
};

export default function Profile() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const getToken = async () => {
    if (Platform.OS === "web") {
      return localStorage.getItem("token");
    }

    return await SecureStore.getItemAsync("token");
  };

  const loadProfile = async () => {
    try {
      setLoading(true);

      let storedUser = null;

      if (Platform.OS === "web") {
        storedUser = localStorage.getItem("user");
      } else {
        storedUser = await SecureStore.getItemAsync("user");
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const token = await getToken();

      if (!token) {
        router.replace("/login" as any);
        return;
      }

      const reservationsResponse = await fetch(`${API_URL}/reservations/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reservationsData = await reservationsResponse.json();

      if (reservationsResponse.ok) {
        setReservations(reservationsData);
      } else {
        alert(reservationsData.error || "Could not load reservations");
      }

      const statsResponse = await fetch(`${API_URL}/reservations/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const statsData = await statsResponse.json();

      if (statsResponse.ok) {
        setStats(statsData);
      }
    } catch (error) {
      console.log("PROFILE ERROR:", error);
      alert("Something went wrong loading profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    try {
      const token = await getToken();

      if (!token) {
        alert("You must login again");
        router.replace("/login" as any);
        return;
      }

      const response = await fetch(
        `${API_URL}/reservations/${reservationId}/cancel`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Could not cancel reservation");
        return;
      }

      alert("Reservation cancelled successfully");
      loadProfile();
    } catch (error) {
      console.log("CANCEL ERROR:", error);
      alert("Something went wrong cancelling reservation");
    }
  };

  const confirmCancelReservation = (reservationId: number) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to cancel this reservation?"
      );

      if (confirmed) {
        handleCancelReservation(reservationId);
      }
    } else {
      Alert.alert(
        "Cancel Reservation",
        "Are you sure you want to cancel this reservation?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => handleCancelReservation(reservationId),
          },
        ]
      );
    }
  };

  const getReservationStatus = (reservation: Reservation) => {
    if (reservation.status === "CANCELLED") {
      return "CANCELLED";
    }

    const datePart = String(reservation.show_date).split("T")[0];
    const timePart = String(reservation.show_time).slice(0, 8);

    const reservationDateTime = new Date(`${datePart}T${timePart}`);
    const now = new Date();

    if (reservationDateTime < now) {
      return "COMPLETED";
    }

    return "ACTIVE";
  };

  const formatDate = (value: string) => {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB");
  };

  const formatTime = (value: string) => {
    if (!value) return "";
    return String(value).slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>👤</Text>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.userCard}>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Stats</Text>

        <Text style={styles.statText}>
          🎟️ Reservations: {stats?.totalReservations ?? 0}
        </Text>

        <Text style={styles.statText}>
          💺 Seats booked: {stats?.totalSeats ?? 0}
        </Text>

        <Text style={styles.statText}>
          ⭐ Favorite show: {stats?.favoriteShow ?? "No favorite yet"}
        </Text>

        <Text style={styles.statText}>
          🏛️ Favorite theatre: {stats?.favoriteTheatre ?? "No favorite yet"}
        </Text>
      </View>

      <Text style={styles.sectionTitleWhite}>My Reservations</Text>

      {reservations.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No reservations yet.</Text>
        </View>
      ) : (
        reservations.map((reservation) => {
          const displayStatus = getReservationStatus(reservation);

          return (
            <View
              key={reservation.reservation_id}
              style={styles.reservationCard}
            >
              <Text style={styles.showTitle}>
                {reservation.show_title}
              </Text>

              <Text style={styles.theatre}>
                📍 {reservation.theatre_name},{" "}
                {reservation.theatre_location}
              </Text>

              <Text style={styles.info}>
                📅 {formatDate(reservation.show_date)} -{" "}
                {formatTime(reservation.show_time)}
              </Text>

              <Text style={styles.info}>
                🏛️ {reservation.hall}
              </Text>

              <Text style={styles.info}>
                💺 Seats: {reservation.seats}
              </Text>

              <Text style={styles.info}>
                💰 Total: €
                {Number(reservation.total_price).toFixed(2)}
              </Text>

              <View
                style={[
                  styles.statusBadge,
                  displayStatus === "ACTIVE" &&
                    styles.activeBadge,
                  displayStatus === "CANCELLED" &&
                    styles.cancelledBadge,
                  displayStatus === "COMPLETED" &&
                    styles.completedBadge,
                ]}
              >
                <Text style={styles.statusText}>
                  {displayStatus}
                </Text>
              </View>

              {displayStatus === "ACTIVE" && (
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() =>
                    confirmCancelReservation(
                      reservation.reservation_id
                    )
                  }
                >
                  <Text style={styles.cancelButtonText}>
                    Cancel Reservation
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/home" as any)}
      >
        <Text style={styles.backText}>Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
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
    flexGrow: 1,
    backgroundColor: "#1e1b2e",
    padding: 20,
    paddingTop: 55,
  },

  logo: {
    fontSize: 48,
    textAlign: "center",
  },

  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },

  userCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    alignItems: "center",
  },

  userName: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e1b2e",
  },

  userEmail: {
    color: "#777",
    marginTop: 6,
    textAlign: "center",
  },

  statsCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1e1b2e",
    textAlign: "center",
  },

  sectionTitleWhite: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },

  statText: {
    marginTop: 6,
    textAlign: "center",
    color: "#555",
    fontWeight: "600",
  },

  reservationCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    alignItems: "center",
  },

  showTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1e1b2e",
  },

  theatre: {
    marginTop: 6,
    color: "#6c4bd8",
    fontWeight: "600",
    textAlign: "center",
  },

  info: {
    marginTop: 7,
    textAlign: "center",
    color: "#555",
  },

  statusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 14,
  },

  activeBadge: {
    backgroundColor: "#27ae60",
  },

  cancelledBadge: {
    backgroundColor: "#e74c3c",
  },

  completedBadge: {
    backgroundColor: "#3498db",
  },

  statusText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 13,
  },

  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    width: "100%",
  },

  cancelButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },

  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 20,
    marginBottom: 14,
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
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