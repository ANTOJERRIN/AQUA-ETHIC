// ============================================================
// AQUA-ETHIC — ESP32 to Deployed Backend (Render, HTTPS)
// No home WiFi needed — connects via your phone's mobile hotspot,
// which gives it real internet access to reach your Render URL.
// ============================================================

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
#include <ArduinoJson.h>

// ===== WIFI (use your phone's mobile hotspot as the network) =====
const char* wifi_ssid = "iPhone";        // ← CHANGE THIS
const char* wifi_password = "12345678pk"; // ← CHANGE THIS

// ===== BACKEND CONFIGURATION =====
// Confirmed from backend/src/server.js: app.use('/api/sensor-data', sensorRoutes)
const char* backend_host = "aqua-ethic.onrender.com";
const char* backend_path = "/api/sensor-data/data";

// ===== DEVICE CONFIGURATION =====
const String deviceId = "AQUA-001";

// ===== SENSOR PINS =====
#define PH_PIN 34
#define TURBIDITY_PIN 35
#define ONE_WIRE_BUS 4

#ifndef LED_BUILTIN
#define LED_BUILTIN 2
#endif

// ===== pH CALIBRATION VALUES =====
#define PH4_VOLTAGE 1.78
#define PH7_VOLTAGE 2.50

// ===== TURBIDITY CALIBRATION =====
#define CLEAR_WATER_VOLTAGE 4.30
#define TURBIDITY_SCALE_FACTOR 1000.0

// ===== OBJECTS =====
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);

// ===== VARIABLES =====
float phValue = 0;
float turbidityNTU = 0;
float tempC = 0;
unsigned long lastSendTime = 0;
const unsigned long sendInterval = 30000;

// ===== FUNCTION: Voltage to pH =====
float voltageToPH(float voltage) {
    float slope = (7.0 - 4.0) / (PH7_VOLTAGE - PH4_VOLTAGE);
    float intercept = 7.0 - slope * PH7_VOLTAGE;
    return slope * voltage + intercept;
}

// ===== FUNCTION: Voltage to NTU =====
float voltageToNTU(float voltage) {
    float drop = CLEAR_WATER_VOLTAGE - voltage;
    float ntu = drop * TURBIDITY_SCALE_FACTOR;
    if (ntu < 0) ntu = 0;
    return ntu;
}

// ===== FUNCTION: Read Sensors =====
void readSensors() {
    int phRaw = analogRead(PH_PIN);
    float phVoltage = phRaw * (3.3 / 4095.0);
    phValue = voltageToPH(phVoltage);

    int turbRaw = analogRead(TURBIDITY_PIN);
    float turbVoltage = turbRaw * (3.3 / 4095.0);
    turbidityNTU = voltageToNTU(turbVoltage);

    tempSensor.requestTemperatures();
    tempC = tempSensor.getTempCByIndex(0);
    if (tempC == -127) tempC = 0;

    phValue = constrain(phValue, 0, 14);
    turbidityNTU = constrain(turbidityNTU, 0, 100);
    tempC = constrain(tempC, -10, 50);
}

// ===== FUNCTION: Send Data to Backend over HTTPS =====
void sendToBackend() {
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi not connected — skipping backend send.");
        return;
    }

    WiFiClientSecure client;
    client.setInsecure(); // skips certificate validation — fine for prototype/testing

    HTTPClient http;
    String url = String("https://") + backend_host + backend_path;
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");

    StaticJsonDocument<256> doc;
    doc["deviceId"] = deviceId;
    doc["pH"] = phValue;
    doc["temperature"] = tempC;
    doc["turbidity"] = turbidityNTU;
    doc["dissolvedOxygen"] = 6.8; // Placeholder

    String payload;
    serializeJson(doc, payload);

    Serial.println("Sending data:");
    Serial.println(payload);

    int httpCode = http.POST(payload);

    if (httpCode == 200 || httpCode == 201) {
        String response = http.getString();
        Serial.println("Data sent successfully!");
        Serial.println("Response: " + response);
    } else {
        Serial.print("Failed to send data! HTTP Code: ");
        Serial.println(httpCode);
    }

    http.end();
}

// ===== FUNCTION: Print Readings =====
void printReadings() {
    Serial.println("\nSensor Readings:");
    Serial.print("   pH: ");
    Serial.println(phValue, 2);
    Serial.print("   Temperature: ");
    Serial.print(tempC, 2);
    Serial.println(" C");
    Serial.print("   Turbidity: ");
    Serial.print(turbidityNTU, 1);
    Serial.println(" NTU");
}

// ===== SETUP =====
void setup() {
    Serial.begin(115200);
    Serial.println("\nAQUA-ETHIC Buoy Starting...");

    analogReadResolution(12);
    tempSensor.begin();
    pinMode(LED_BUILTIN, OUTPUT);

    Serial.print("Connecting to WiFi (hotspot)");
    WiFi.begin(wifi_ssid, wifi_password);

    int attempts = 0;
    while (WiFi.status() != WL_CONNECTED && attempts < 20) {
        delay(500);
        Serial.print(".");
        attempts++;
    }

    if (WiFi.status() == WL_CONNECTED) {
        Serial.println("\nWiFi Connected!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.localIP());
        Serial.print("Backend: https://");
        Serial.print(backend_host);
        Serial.println(backend_path);
    } else {
        Serial.println("\nWiFi Connection Failed! Check hotspot credentials.");
    }

    readSensors();
    printReadings();

    if (WiFi.status() == WL_CONNECTED) {
        sendToBackend();
    }
}

// ===== LOOP =====
void loop() {
    unsigned long currentTime = millis();

    if (currentTime - lastSendTime >= sendInterval) {
        lastSendTime = currentTime;

        readSensors();
        printReadings();

        if (WiFi.status() == WL_CONNECTED) {
            sendToBackend();
        } else {
            Serial.println("WiFi not connected. Attempting to reconnect...");
            WiFi.reconnect();
        }

        digitalWrite(LED_BUILTIN, HIGH);
        delay(100);
        digitalWrite(LED_BUILTIN, LOW);
    }
}
