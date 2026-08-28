import { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import { scanQrCode } from "../lib/api";
import { scheduleStatusNotification } from "../lib/notifications";

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionIcon}>📷</Text>
        <Text style={styles.permissionTitle}>Camera Permission Needed</Text>
        <Text style={styles.permissionText}>
          Allow PackagePro Guide to access your camera to scan QR codes for
          check-in.
        </Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.resultContainer}>
        <Text style={styles.resultIcon}>
          {result.success ? "✅" : "❌"}
        </Text>
        <Text style={styles.resultTitle}>
          {result.success ? "Check-In Successful!" : "Check-In Failed"}
        </Text>
        <Text style={styles.resultMessage}>{result.message}</Text>

        {result.success && result.booking && (
          <View style={styles.bookingInfo}>
            <Text style={styles.bookingLabel}>Traveler</Text>
            <Text style={styles.bookingValue}>
              {result.booking.traveler_name}
            </Text>
            <Text style={styles.bookingLabel}>Package</Text>
            <Text style={styles.bookingValue}>
              {result.booking.package_name || result.booking.package_id}
            </Text>
            <Text style={styles.bookingLabel}>Dates</Text>
            <Text style={styles.bookingValue}>
              {result.booking.start_date} → {result.booking.end_date}
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.scanAgainBtn}
          onPress={() => {
            setScanned(false);
            setResult(null);
          }}
        >
          <Text style={styles.scanAgainText}>Scan Another</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = async (scanningResult: any) => {
    if (scanned) return;
    setScanned(true);

    const qrCode = scanningResult.data;
    try {
      const data = await scanQrCode(qrCode);
      scheduleStatusNotification(
        `Checked in: ${data.booking.traveler_name}`
      );
      setResult({ success: true, message: data.message, booking: data.booking });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || "Failed to verify booking",
        booking: null,
      });
    }
  };

  return (
    <View style={styles.scannerContainer}>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <Text style={styles.scanText}>Point camera at QR code</Text>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A" },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  permissionIcon: { fontSize: 64, marginBottom: 16 },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  permissionBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 32,
  },
  permissionBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  backBtn: { marginTop: 16 },
  backBtnText: { color: "#60A5FA", fontSize: 14 },
  scannerContainer: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  scanFrame: {
    width: 260,
    height: 260,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderColor: "#F59E0B",
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  scanText: {
    color: "#F8FAFC",
    fontSize: 16,
    marginTop: 20,
    fontWeight: "600",
  },
  resultContainer: {
    flex: 1,
    backgroundColor: "#0F172A",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  resultIcon: { fontSize: 64, marginBottom: 12 },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F8FAFC",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    marginBottom: 24,
  },
  bookingInfo: {
    backgroundColor: "#1E293B",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 24,
  },
  bookingLabel: { fontSize: 12, color: "#64748B", marginTop: 8 },
  bookingValue: { fontSize: 15, fontWeight: "600", color: "#F8FAFC" },
  scanAgainBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 32,
    marginBottom: 12,
  },
  scanAgainText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  doneBtn: { padding: 10 },
  doneText: { color: "#60A5FA", fontSize: 14 },
});
