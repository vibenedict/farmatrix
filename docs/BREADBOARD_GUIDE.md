# 🍞 FARMATRIX Breadboard Prototyping Guide
### Step-by-Step Physical Assembly on a Solderless Breadboard (400 Tie-Points)
*Companion to [`docs/CIRCUIT_DIAGRAM.md`](file:///Users/victorbenedict/Documents/farmatrix/docs/CIRCUIT_DIAGRAM.md)*

---

## 📐 1. Visual Breadboard Layout Map

A high-resolution visual diagram is available at [`docs/breadboard_diagram.svg`](file:///Users/victorbenedict/Documents/farmatrix/docs/breadboard_diagram.svg) and in your browser at [`/breadboard_diagram.svg`](http://localhost:3000/breadboard_diagram.svg).

```
   TOP POWER RAIL (+) [Red Line]   ===> 5V VCC
   TOP POWER RAIL (-) [Blue Line]  ===> GND
   --------------------------------------------------------------------------------------
   ROW    COL A    COL B    COL C    COL D    COL E  ||  COL F    COL G    COL H    COL I    COL J
   --------------------------------------------------------------------------------------
   R1     .        .        .        .        .      ||  .        .        .        .        .
   R2     .        .        .        .        .      ||  .        .        .        .        .
   R3     .        .        .        .        .      ||  .        .        .        .        .
   R4     .        .        .        .        .      ||  .        .        .        .        .
   R5     [DHT22 Pin 1: VCC] ---(Jumper to Top + Rail) & [10kΩ Resistor Leg 1]
   R6     [DHT22 Pin 2: DATA] --(Jumper to Arduino D2) & [10kΩ Resistor Leg 2]
   R7     [DHT22 Pin 3: NC] ----(Unused / Empty)
   R8     [DHT22 Pin 4: GND] ---(Jumper to Top - Rail)
   R9     .        .        .        .        .      ||  .        .        .        .        .
   R10    .        .        .        .        .      ||  .        .        .        .        .
   R11    .        .        .        .        .      ||  .        .        .        .        .
   R12    .        .        .        .        .      ||  .        .        .        .        .
   R13    .        .        .        .        .      ||  .        .        .        .        .
   R14    [Soil Sensor: VCC] ---(Jumper to Top + Rail)
   R15    [Soil Sensor: GND] ---(Jumper to Top - Rail)
   R16    [Soil Sensor: AOUT] --(Jumper to Arduino A0)
   --------------------------------------------------------------------------------------
   BOTTOM POWER RAIL (+) [Red Line]  <=== Jumper from Arduino 5V
   BOTTOM POWER RAIL (-) [Blue Line] <=== Jumper from Arduino GND
```

---

## 🛠️ 2. Step-by-Step Wiring Sequence

### Step 1: Power the Breadboard Rails
1. Take a **Red jumper wire**: connect Arduino **5V** to the **Bottom Red (+) Rail**.
2. Take a **Black (or Blue) jumper wire**: connect Arduino **GND** to the **Bottom Blue (-) Rail**.
3. *Bridge the Rails* (Recommended):
   * Insert a short red wire from the Bottom Red Rail to the Top Red Rail.
   * Insert a short black wire from the Bottom Blue Rail to the Top Blue Rail.
   * *Result*: Both top and bottom power rails are now live with 5V and GND.

---

### Step 2: Mount the DHT22 Temperature & Humidity Sensor
The DHT22 has 4 pins. Hold it with the **perforated plastic grille facing toward you**:
* **Pin 1 (Leftmost)**: VCC (Power)
* **Pin 2**: DATA (Signal)
* **Pin 3**: NC (Null / Not Connected)
* **Pin 4 (Rightmost)**: GND (Ground)

**Placement**:
1. Insert the 4 pins firmly into **Rows 5, 6, 7, and 8** (e.g., in Column E).
2. **Power Wire**: Run a short jumper wire from **Row 5 (Column D)** to the **Top Red (+) Rail**.
3. **Ground Wire**: Run a short jumper wire from **Row 8 (Column D)** to the **Top Blue (-) Rail**.
4. **Data Wire**: Run a jumper wire from **Row 6 (Column D)** to Arduino **Digital Pin D2**.
5. **10 kΩ Pull-up Resistor**:
   * Insert one leg into **Row 5** (VCC).
   * Insert the other leg into **Row 6** (DATA).
   * *Why this is essential*: The DHT22 single-bus protocol requires this pull-up resistor to hold the data line HIGH when idle.

---

### Step 3: Connect the Capacitive Soil Moisture Sensor v1.2
The capacitive sensor module has a 3-pin male header on top (`VCC`, `GND`, `AOUT`):
1. Plug a 3-wire female-to-male jumper harness onto the sensor:
   * **VCC (Red)** &rarr; Plug male end into Breadboard **Row 14**.
   * **GND (Black)** &rarr; Plug male end into Breadboard **Row 15**.
   * **AOUT (Green)** &rarr; Plug male end into Breadboard **Row 16**.
2. Add connecting jumpers:
   * From **Row 14** &rarr; Jumper to the **Top Red (+) Rail**.
   * From **Row 15** &rarr; Jumper to the **Top Blue (-) Rail**.
   * From **Row 16** &rarr; Jumper directly to Arduino **Analog Pin A0**.

---

### Step 4: Wire the 5V Single-Channel Relay (Low-Voltage Side)
The relay module has 3 input header pins on one side (`VCC`, `GND`, `IN`):
1. Connect a jumper from Relay **VCC** &rarr; Breadboard **Red (+) Rail**.
2. Connect a jumper from Relay **GND** &rarr; Breadboard **Blue (-) Rail**.
3. Connect a jumper from Relay **IN** &rarr; Arduino **Digital Pin D8**.

---

### Step 5: Wire the DC Mini Pump & External Power (High-Current Side)
The relay has 3 screw terminals on the opposite side: `NO` (Normally Open), `COM` (Common), and `NC` (Normally Closed).

> [!CAUTION]
> **Keep Motor Power Galvanically Isolated**:
> Do NOT connect the external battery pack to the breadboard power rails or the Arduino. Motors generate high electrical transients (inductive back-EMF) that will crash the Arduino.

1. **Positive Supply**:
   * Connect the **Positive (+ Red)** wire from your 4xAA battery pack (or 5V DC adapter) into the Relay **COM** screw terminal.
2. **Switched Pump Lead**:
   * Connect the **Red (+) wire** of the submersible mini-pump into the Relay **NO** screw terminal.
3. **Ground Return**:
   * Connect the **Black (-) wire** of the pump directly to the **Negative (- Black)** wire of the battery pack using a wire nut or wago clip.

---

## 🔍 3. Breadboard Inspection & Testing Checklist

Before plugging the Arduino USB cable into your computer:

- [ ] **No Cross-Rail Short Circuit**: Ensure the Red (+) and Blue (-) rails do not have wires bridging them.
- [ ] **10 kΩ Resistor Position**: Confirm the resistor spans strictly between **Row 5** and **Row 6** (DHT22 VCC and DATA).
- [ ] **DHT22 Pin 3 Empty**: Check that **Row 7** has no wires attached (Pin 3 is internally disconnected).
- [ ] **Sensor Analog Pin**: Verify the green signal wire from **Row 16** leads to Arduino **A0**.
- [ ] **Relay Signal Pin**: Verify the orange control wire leads from Relay **IN** to Arduino **D8**.
- [ ] **Isolated Motor Circuit**: Verify the mini-pump wires do not touch the Arduino 5V/GND rails.

---

## ⚡ 4. Power-Up Test

1. Connect the Arduino UNO R3 to your Mac/PC using a standard USB A-to-B cable.
2. The Arduino's green **ON** LED will light up.
3. The Relay module's red power LED will illuminate.
4. Open the Arduino Serial Monitor at **9600 baud**:
   * You should see:
     ```json
     {"status":"FARMATRIX_NODE_BOOT_OK","version":"1.0"}
     {"soil_pct":42.5,"raw_adc":545,"temp":24.6,"humidity":58.2,"light":0,"pump_status":"OFF","safeguard":false}
     ```
5. In your web browser, navigate to `http://localhost:3000` to see your live telemetry appear!
