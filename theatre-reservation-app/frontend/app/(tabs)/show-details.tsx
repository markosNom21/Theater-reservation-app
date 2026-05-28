import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

const showImages: any = {
  "Hamlet.jpg": require("../../assets/images/Hamlet.jpg"),
  "RomeoAndJuliet.jpg": require("../../assets/images/RomeoAndJuliet.jpg"),
  "Antigone.jpg": require("../../assets/images/Antigone.jpg"),
  "Phantom.jpg": require("../../assets/images/Phantom.jpg"),
  "Macbeth.avif": require("../../assets/images/Macbeth.avif"),
  "Medea.jpg": require("../../assets/images/Medea.jpg"),
  "OedipusRex.jpg": require("../../assets/images/OedipusRex.jpg"),
  "TheGlassMenagerie.jpg": require("../../assets/images/TheGlassMenagerie.jpg"),
  "WaitingForGodot.jpg": require("../../assets/images/WaitingForGodot.jpg"),
  "Lyistrata.jpg": require("../../assets/images/Lyistrata.jpg"),
  "Les-Miserables.jpg": require("../../assets/images/Les-Miserables.jpg"),
  "Cats.jpg": require("../../assets/images/Cats.jpg"),
};

export default function ShowDetails() {
  const router = useRouter();

  const {
    showId,
    title,
    description,
    duration,
    ageRating,
    theatreName,
    imageName,
  } = useLocalSearchParams();

  const imageSource = showImages[String(imageName)];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Image source={imageSource} style={styles.image} />

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.theatre}>📍 {theatreName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About the Show</Text>
        <Text style={styles.description}>{description}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Duration</Text>
            <Text style={styles.infoValue}>{duration} min</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Age Rating</Text>
            <Text style={styles.infoValue}>{ageRating}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.push({
            pathname: "/showtimes" as any,
            params: {
              showId,
              title,
            },
          })
        }
      >
        <Text style={styles.buttonText}>View Available Showtimes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.replace("/shows" as any)}
      >
        <Text style={styles.backText}>Back to Shows</Text>
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
  hero: {
    backgroundColor: "#6c4bd8",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
    marginBottom: 22,
  },
  image: {
    width: "100%",
    height: 230,
    borderRadius: 20,
    marginBottom: 18,
  },
  title: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  theatre: {
    color: "#ded7ff",
    fontSize: 15,
    marginTop: 8,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 22,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#1e1b2e",
    marginBottom: 12,
  },
  description: {
    color: "#666",
    fontSize: 15,
    lineHeight: 22,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 22,
  },
  infoBox: {
    flex: 1,
    backgroundColor: "#f3f3f6",
    padding: 16,
    borderRadius: 16,
  },
  infoLabel: {
    color: "#777",
    fontSize: 13,
  },
  infoValue: {
    color: "#1e1b2e",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#6c4bd8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17,
  },
  backButton: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
  },
  backText: {
    color: "#6c4bd8",
    textAlign: "center",
    fontWeight: "bold",
  },
});