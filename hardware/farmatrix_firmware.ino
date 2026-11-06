/*
 * FARMATRIX - Smart Agriculture IoT Firmware
 * Target: Arduino UNO R3 (ATmega328P)
 * Pins:
 *   - A0: Capacitive Soil Moisture Sensor v1.2
 *   - D2: DHT22 (AM2302) Temperature & Relative Humidity
 *   - D8: 5V Active-Low Relay Module (Submersible Pump)
 *   - A1: Light Dependent Resistor (LDR) Photocell
 */

#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT22
#define SOIL_PIN A0
#define RELAY_PIN 8
#define LDR_PIN A1

// Calibrated Thresholds
const int SOIL_DRY_ADC = 720;   // Raw ADC in dry air
const int SOIL_WET_ADC = 310;   // Raw ADC submerged in water
const float PUMP_TRIGGER_PCT = 32.0; // Moisture threshold to trigger pump (<32%)
const float PUMP_CUTOFF_PCT  = 68.0; // Moisture threshold to cutoff pump (>68%)

// Safeguard Watchdogs
const unsigned long MAX_PUMP_RUNTIME_MS = 180000; // 3 min max continuous runtime
const unsigned long COOLDOWN_PERIOD_MS  = 300000; // 5 min cooldown between cycles
const unsigned long TELEMETRY_INTERVAL  = 5000;   // Transmit telemetry every 5s

DHT dht(DHTPIN, DHTTYPE);
bool pumpActive = false;
bool safeguardLockout = false;
unsigned long pumpStartTime = 0;
unsigned long pumpStopTime  = 0;
unsigned long lastTelemetry = 0;

void setup() {
  Serial.begin(9600);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // Active-low relay: HIGH is OFF
  dht.begin();
  
  Serial.println("{\"status\":\"FARMATRIX_NODE_BOOT_OK\",\"version\":\"1.0\"}");
}

void loop() {
  unsigned long currentMillis = millis();

  // Read analog moisture and calibrate
  int rawSoil = analogRead(SOIL_PIN);
  float soilPct = map(rawSoil, SOIL_DRY_ADC, SOIL_WET_ADC, 0, 100);
  soilPct = constrain(soilPct, 0.0, 100.0);

  // Read DHT22
  float temp = dht.readTemperature();
  float hum  = dht.readHumidity();
  int light  = analogRead(LDR_PIN);

  // Cooldown safeguard clearance
  if (safeguardLockout && (currentMillis - pumpStopTime >= COOLDOWN_PERIOD_MS)) {
    safeguardLockout = false;
  }

  // Automatic Irrigation Engine
  if (!safeguardLockout) {
    if (!pumpActive && soilPct < PUMP_TRIGGER_PCT) {
      pumpActive = true;
      pumpStartTime = currentMillis;
      digitalWrite(RELAY_PIN, LOW); // Turn pump ON
    } else if (pumpActive) {
      // Check cutoff or max runtime safeguard
      if (soilPct >= PUMP_CUTOFF_PCT) {
        pumpActive = false;
        pumpStopTime = currentMillis;
        digitalWrite(RELAY_PIN, HIGH); // Turn pump OFF
      } else if (currentMillis - pumpStartTime >= MAX_PUMP_RUNTIME_MS) {
        // Trigger Safety Watchdog Lockout
        pumpActive = false;
        safeguardLockout = true;
        pumpStopTime = currentMillis;
        digitalWrite(RELAY_PIN, HIGH);
      }
    }
  }

  // Transmit canonical JSON packet over USB Serial
  if (currentMillis - lastTelemetry >= TELEMETRY_INTERVAL) {
    lastTelemetry = currentMillis;
    Serial.print("{\"soil_pct\":");
    Serial.print(soilPct, 1);
    Serial.print(",\"raw_adc\":");
    Serial.print(rawSoil);
    Serial.print(",\"temp\":");
    Serial.print(isnan(temp) ? 25.0 : temp, 1);
    Serial.print(",\"humidity\":");
    Serial.print(isnan(hum) ? 60.0 : hum, 1);
    Serial.print(",\"light\":");
    Serial.print(light);
    Serial.print(",\"pump_status\":\"");
    Serial.print(pumpActive ? "ON" : "OFF");
    Serial.print("\",\"safeguard\":");
    Serial.print(safeguardLockout ? "true" : "false");
    Serial.println("}");
  }
}
