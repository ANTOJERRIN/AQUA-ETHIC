// AQUA-ETHIC — ESP32 Access Point + calibrated pH and Turbidity display
// Install via Library Manager first: "OneWire" and "DallasTemperature"

#include <WiFi.h>
#include <WebServer.h>
#include <OneWire.h>
#include <DallasTemperature.h>

const char* ap_ssid = "AQUA-ETHIC";
const char* ap_password = "12345678";

#define PH_PIN 34
#define TURBIDITY_PIN 35
#define ONE_WIRE_BUS 4  
#define PH4_VOLTAGE 1.950  
#define PH7_VOLTAGE 2.50   

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature tempSensor(&oneWire);
WebServer server(80);

float phValue = 0;
float turbidityNTU = 0;
float tempC = 0;

float voltageToPH(float voltage) {
  float slope = (7.0 - 4.0) / (PH7_VOLTAGE - PH4_VOLTAGE);
  float intercept = 7.0 - slope * PH7_VOLTAGE;
  return slope * voltage + intercept;
}

float voltageToNTU(float voltage) {
  if (voltage < 2.5) return 3000;  
  float ntu = -1120.4 * voltage * voltage + 5742.3 * voltage - 4352.9;
  if (ntu < 0) ntu = 0;
  return ntu;
}

void readSensors() {
  int phRaw = analogRead(PH_PIN);
  float phVoltage = phRaw * (3.3 / 4095.0);
  phValue = voltageToPH(phVoltage);

  int turbRaw = analogRead(TURBIDITY_PIN);
  float turbVoltage = turbRaw * (3.3 / 4095.0);
  turbidityNTU = voltageToNTU(turbVoltage);

  tempSensor.requestTemperatures();
  tempC = tempSensor.getTempCByIndex(0);
}

void handleRoot() {
  readSensors();

  String html = "<html><head><meta http-equiv='refresh' content='3'>";
  html += "<style>body{font-family:sans-serif;padding:20px;}</style></head><body>";
  html += "<h2>AQUA-ETHIC Sensor Readings</h2>";
  html += "<p><b>pH:</b> " + String(phValue, 2) + "</p>";
  html += "<p><b>Turbidity:</b> " + String(turbidityNTU, 1) + " NTU</p>";
  html += "<p><b>Temperature:</b> " + String(tempC, 2) + " C</p>";
  html += "<p style='color:gray;font-size:12px;'>Page auto-refreshes every 3 seconds</p>";
  html += "</body></html>";

  server.send(200, "text/html", html);
}

void setup() {
  Serial.begin(115200);
  analogReadResolution(12);
  tempSensor.begin();

  WiFi.softAP(ap_ssid, ap_password);
  Serial.println("Access Point started.");
  Serial.print("Connect your phone to WiFi network: ");
  Serial.println(ap_ssid);
  Serial.print("Then open this address in your browser: http://");
  Serial.println(WiFi.softAPIP());

  server.on("/", handleRoot);
  server.begin();
}

void loop() {
  server.handleClient();
}
