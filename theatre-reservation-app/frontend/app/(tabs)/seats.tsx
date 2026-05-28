import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import { API_URL } from "../../config/api";

type Seat = {
  seat_id: number;
  showtime_id: number;
  seat_row: string;
  seat_number: number;
  category: string;
  is_reserved: boolean | number;
};

export default function Seats() {
  const router = useRouter();

  const { showtimeId, title, date, time, hall, price } =
    useLocalSearchParams();

  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    if (showtimeId) {
      setSelectedSeats([]);
      fetchSeats();
    }
  }, [showtimeId]);

  const fetchSeats = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/seats/${String(showtimeId)}`);
      const data = await response.json();

      if (Array.isArray(data)) {
        setSeats(data);
      } else {
        console.log("SEATS DATA ERROR:", data);
        setSeats([]);
        alert(data.error || "Could not load seats");
      }
    } catch (error) {
      console.log("SEATS ERROR:", error);
      alert("Could not load seats");
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat: Seat) => {
    const isReserved = Boolean(seat.is_reserved);

    if (isReserved) return;

    if (selectedSeats.includes(seat.seat_id)) {
      setSelectedSeats(selectedSeats.filter((id) => id !== seat.seat_id));
    } else {
      setSelectedSeats([...selectedSeats, seat.seat_id]);
    }
  };

  const handleReservation = async () => {
    try {
      if (selectedSeats.length === 0) {
        alert("Please select at least one seat");
        return;
      }

      let token = null;

      if (Platform.OS === "web") {
        token = localStorage.getItem("token");
      } else {
        token = await SecureStore.getItemAsync("token");
      }

      if (!token) {
        alert("You must login again");
        router.replace("/login" as any);
        return;
      }

      const response = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          showtimeId: Number(showtimeId),
          seatIds: selectedSeats,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Reservation failed");
        return;
      }

      setConfirmationVisible(true);
      fetchSeats();
    } catch (error) {
      console.log("RESERVATION ERROR:", error);
      alert("Something went wrong while creating reservation");
    }
  };

  const groupedSeats = seats.reduce((groups: Record<string, Seat[]>, seat) => {
    if (!groups[seat.seat_row]) {
      groups[seat.seat_row] = [];
    }

    groups[seat.seat_row].push(seat);
    return groups;
  }, {});

  const ticketPrice = Number(price) || 0;
  const totalPrice = selectedSeats.length * ticketPrice;

  const formatDate = (value: string) => {
    if (!value) return "";
    return new Date(String(value)).toLocaleDateString("en-GB");
  };

  const formatTime = (value: string) => {
    if (!value) return "";
    return String(value).slice(0, 5);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading seats...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>💺</Text>
      <Text style={styles.title}>Select Seats</Text>
      <Text style={styles.subtitle}>{title}</Text>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>📅 {formatDate(String(date))}</Text>
        <Text style={styles.infoText}>⏰ {formatTime(String(time))}</Text>
        <Text style={styles.infoText}>🏛️ {hall}</Text>
        <Text style={styles.infoText}>🎟️ €{ticketPrice.toFixed(2)} / seat</Text>
      </View>

      <View style={styles.screen}>
        <Text style={styles.screenText}>STAGE</Text>
      </View>

      <View style={styles.seatsContainer}>
        {Object.keys(groupedSeats).map((row) => (
          <View key={row} style={styles.row}>
            <Text style={styles.rowLabel}>{row}</Text>

            <View style={styles.rowSeats}>
              {groupedSeats[row].map((seat) => {
                const selected = selectedSeats.includes(seat.seat_id);
                const isReserved = Boolean(seat.is_reserved);

                return (
                  <TouchableOpacity
                    key={seat.seat_id}
                    style={[
                      styles.seat,
                      isReserved && styles.reservedSeat,
                      selected && styles.selectedSeat,
                    ]}
                    disabled={isReserved}
                    onPress={() => toggleSeat(seat)}
                  >
                    <Text
                      style={[
                        styles.seatText,
                        (isReserved || selected) && styles.seatTextLight,
                      ]}
                    >
                      {seat.seat_number}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Text style={styles.summaryText}>
          Selected seats: {selectedSeats.length}
        </Text>
        <Text style={styles.summaryText}>Total: €{totalPrice.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[
          styles.reserveButton,
          selectedSeats.length === 0 && styles.disabledButton,
        ]}
        disabled={selectedSeats.length === 0}
        onPress={handleReservation}
      >
        <Text style={styles.reserveText}>Confirm Reservation</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/shows" as any)}
      >
        <Text style={styles.backText}>Back to Shows</Text>
      </TouchableOpacity>

      <Modal visible={confirmationVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalIcon}>✅</Text>

            <Text style={styles.modalTitle}>Reservation Confirmed!</Text>

            <Text style={styles.modalText}>{title}</Text>

            <Text style={styles.modalText}>
              Seats: {selectedSeats.length}
            </Text>

            <Text style={styles.modalText}>
              Total: €{totalPrice.toFixed(2)}
            </Text>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setConfirmationVisible(false);
                setSelectedSeats([]);
                router.replace("/profile" as any);
              }}
            >
              <Text style={styles.modalButtonText}>Go to Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryButton}
              onPress={() => {
                setConfirmationVisible(false);
                setSelectedSeats([]);
                router.replace("/shows" as any);
              }}
            >
              <Text style={styles.modalSecondaryText}>Continue Browsing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 20,
  },
  infoText: {
    fontWeight: "600",
    marginBottom: 6,
  },
  screen: {
    backgroundColor: "#6c4bd8",
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
  },
  screenText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  seatsContainer: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  rowLabel: {
    width: 24,
    fontWeight: "bold",
  },
  rowSeats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  seat: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#f3f3f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 10,
  },
  selectedSeat: {
    backgroundColor: "#6c4bd8",
  },
  reservedSeat: {
    backgroundColor: "#999",
  },
  seatText: {
    fontWeight: "bold",
  },
  seatTextLight: {
    color: "#fff",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
  },
  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  summaryText: {
    marginTop: 4,
  },
  reserveButton: {
    backgroundColor: "#6c4bd8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: "#777",
  },
  reserveText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
  },
  backText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#6c4bd8",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    width: "100%",
    alignItems: "center",
  },
  modalIcon: {
    fontSize: 58,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e1b2e",
    marginBottom: 14,
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    color: "#555",
    marginTop: 6,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#6c4bd8",
    padding: 15,
    borderRadius: 16,
    width: "100%",
    marginTop: 24,
  },
  modalButtonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalSecondaryButton: {
    marginTop: 14,
  },
  modalSecondaryText: {
    color: "#6c4bd8",
    fontWeight: "bold",
  },
});