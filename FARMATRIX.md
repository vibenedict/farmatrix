**FARMATRIX**

Smart Agriculture Monitoring & Blockchain Traceability

**PROJECT BRIEF  \|  NEAR HACKATHON PROTOTYPE**

 

| FarmChain connects a physical farm to verifiable digital records. An Arduino UNO monitors growing conditions and controls a small irrigation pump, while a web application helps farmers register harvest batches and track product movement using NEAR blockchain. |
| :---- |

 

*Prepared for prototype planning and hackathon development*

 

# **1\. Executive Summary**

FarmChain is an IoT-enabled agriculture and product traceability prototype designed to demonstrate how affordable hardware and blockchain can support better farm monitoring and supply-chain transparency. An Arduino UNO collects soil-moisture and environmental readings, then controls a small pump through a relay when soil moisture falls below a configured threshold. A computer connected to the Arduino acts as an internet gateway: a Node.js service reads serial data and forwards validated readings to a web backend and database. Farmers can register harvest batches and record events such as harvesting, storage and transfer. NEAR smart contracts provide a tamper-evident public record of these key events, while a QR code lets consumers view a batch's recorded history.

# **2\. Problem Statement**

Farmers and buyers can face limited access to timely field-condition information and incomplete visibility into how agricultural products are handled after harvest. Manual monitoring can make it difficult to respond consistently to dry soil or changing environmental conditions. In fragmented supply chains, buyers may also find it difficult to verify a product's recorded origin and movement history.

FarmChain addresses these challenges with a small, demonstrable system that combines physical sensing, basic automation, a digital record-keeping application and blockchain-backed traceability.

# **3\. Proposed Solution**

The prototype has four connected capabilities:

·       Smart farm monitoring: collect soil moisture, temperature and relative humidity readings.  
·       Automated irrigation: switch a low-voltage demonstration pump through a relay when calibrated soil-moisture readings fall below a threshold.  
·       Batch traceability: let an authorized user register a crop batch and append harvest, storage and transfer events.  
·       Consumer verification: generate a QR code that opens a public page showing the batch's recorded history and relevant NEAR transaction references.

# **4\. Project Goals and Success Measures**

| Goal | Prototype success measure |
| :---- | :---- |
| Reliable sensing | Arduino outputs valid, timestamped sensor readings over USB serial. |
| Basic automation | Relay switches the pump according to a calibrated threshold, with a maximum runtime safeguard. |
| Data visibility | The web dashboard displays current readings and a history stored in the database. |
| On-chain registration | A testnet smart contract accepts and returns a registered batch record. |
| Traceability | At least one harvest or transfer event is recorded and shown in the batch timeline. |
| Public verification | A QR code opens a page that checks the displayed record against its stored data hash and on-chain reference. |

 

# **5\. Target Users**

·       Smallholder farmers or farm operators who need a simple view of field conditions.  
·       Distributors and retailers who need to record receipt and transfer of a batch.  
·       Consumers or buyers who want to inspect a product's recorded batch history.  
·       Hackathon judges and technical reviewers evaluating the hardware, software and NEAR integration.

# **6\. System Architecture**

| Layer | Technology | Responsibility |
| :---- | :---- | :---- |
| Hardware | Arduino UNO; capacitive soil-moisture sensor; DHT22; relay; low-voltage pump | Read sensors and control irrigation. |
| Gateway | Mac/PC; Node.js; SerialPort | Read USB serial messages, validate them and forward data. |
| Application | Next.js; API routes; Tailwind CSS | Farmer dashboard, batch workflows and public verification page. |
| Database | Supabase PostgreSQL | Store users, farms, detailed sensor readings, batch metadata and event payloads. |
| Blockchain | NEAR testnet; Rust; near-sdk | Register batches and record important supply-chain events. |
| QR verification | QR code library | Encode a public batch-verification URL. |

 

Data flow: sensors → Arduino UNO → USB serial → Node.js gateway → application backend → Supabase. When a significant event occurs, the backend prepares a canonical event record and its SHA-256 hash, then submits the hash and event metadata to the NEAR contract. The public verification page retrieves the event payload and checks that its hash matches the on-chain commitment.

# **7\. Hardware Components**

| Component | Purpose | Priority |
| :---- | :---- | :---- |
| Arduino UNO R3 | Main microcontroller for sensor input and relay output. | Required |
| Capacitive soil-moisture sensor | Measures soil moisture through an analog input. | Required |
| DHT22 / AM2302 module | Measures temperature and relative humidity. | Required |
| 5V relay module | Switches the pump's external power circuit. | Required |
| Low-voltage DC mini pump | Demonstrates automatic irrigation. | Required |
| External pump power supply | Powers the pump independently of the Arduino. | Required |
| Breadboard and jumper wires | Prototyping connections. | Required |
| LDR light sensor and resistor | Optional light-intensity measurement. | Optional |
| USB cable and computer | Powers/programs the UNO and acts as the gateway. | Required |

 

# **8\. Initial Arduino Pin Map**

| Component pin | Arduino UNO pin |
| :---- | :---- |
| Soil sensor VCC / GND / signal | 5V / GND / A0 |
| DHT22 VCC / GND / DATA | 5V / GND / D2 |
| Relay IN / VCC / GND | D8 / 5V / GND |
| Optional LDR divider output | A1 |

 

For a bare DHT22, use the manufacturer's recommended pull-up arrangement (commonly a 10 kΩ resistor between DATA and VCC); some sensor modules already include this resistor. Calibrate the moisture sensor using the actual soil and growing medium. Example thresholds such as below 30% for pump ON and above 65% for pump OFF are starting points only, not universal crop recommendations.

# **9\. Software and Data Design**

Recommended software stack:

·       Arduino firmware: C++ using the Arduino IDE.  
·       Hardware bridge: Node.js with the SerialPort package.  
·       Web application: Next.js and Tailwind CSS.  
·       Database: Supabase PostgreSQL.  
·       Smart contract: Rust with near-sdk, deployed to NEAR testnet.  
·       QR generation: a maintained QR-code library.  
·       AI: optional rule-based recommendations first; an AI API can later explain trends in natural language.

# **10\. Core Database Entities**

| Entity | Representative fields |
| :---- | :---- |
| farms | id, farmer\_id, farm\_name, location, crop\_type, created\_at |
| sensor\_readings | id, farm\_id, soil\_moisture, temperature, humidity, light\_intensity, pump\_status, recorded\_at |
| product\_batches | id, farm\_id, batch\_id, product\_name, quantity, harvest\_date, farmer\_account, blockchain\_tx |
| supply\_chain\_events | id, batch\_id, event\_type, actor\_account, location, event\_timestamp, data\_hash, transaction\_hash |

 

Store detailed sensor readings and application metadata off-chain. Store only the minimum information needed for public verification on NEAR, such as a batch identifier, event type, data hash and contract-generated timestamp. Avoid placing personal information or commercially sensitive details on a public blockchain.

# **11\. NEAR Integration Plan**

The NEAR smart contract is the project's traceability layer. It should expose a small, auditable interface and enforce authorization for write operations.

| Contract method | Purpose |
| :---- | :---- |
| new() | Initialize contract state and administrator. |
| register\_batch(batch data) | Register a unique product batch; reject duplicate IDs. |
| record\_event(batch ID, event type, data hash) | Append a harvest, storage, transfer or delivery commitment. |
| get\_batch(batch ID) | Return public batch information. |
| get\_batch\_events(batch ID) | Return the recorded event history. |
| verify\_batch(batch ID) | Return existence and verification metadata. |

 

Suggested NEAR implementation sequence:

1\.          Create a NEAR testnet account and set up the Rust toolchain and near-sdk project.  
2\.          Implement batch registration, event recording, read methods and authorization checks.  
3\.          Build the contract to WebAssembly and deploy it to NEAR testnet.  
4\.          Connect the Next.js server-side code to the deployed contract.  
5\.          Use wallet signatures for farmer and distributor actions where appropriate.  
6\.          Store transaction hashes and event identifiers in Supabase for convenient display.  
7\.          Build the public verification page to retrieve event data and recompute its SHA-256 hash.

Security note: never put a NEAR private key in browser code or a public repository. For a controlled demo, a server-side testnet signer may submit device-generated events, but it must be protected and restricted. A blockchain transaction proves that an account submitted a record; it does not prove that the physical sensor was accurate or untampered with.

# **12\. Main Application Screens**

| Screen | Key functions |
| :---- | :---- |
| Farmer dashboard | Current sensor readings, pump status, alerts and recent activity. |
| Farm management | Create farms, select crop type and inspect sensor history. |
| Harvest registration | Enter crop, quantity and harvest details; create a unique batch ID. |
| Supply-chain tracking | Record storage, transfer and delivery events; show event timeline. |
| Consumer verification | Public batch details, recorded history, data-hash status and NEAR transaction references. |

 

# **13\. Seven-Day Prototype Roadmap**

| Day | Work | Expected deliverable |
| :---- | :---- | :---- |
| 1 | Assemble UNO, soil sensor and DHT22; read values. | Working sensor readings. |
| 2 | Add relay, pump, calibrated thresholds and runtime safeguards. | Automated irrigation demo. |
| 3 | Build Node.js serial bridge and save readings to Supabase. | Hardware data in database. |
| 4 | Build Next.js dashboard and sensor history view. | Usable monitoring interface. |
| 5 | Implement and deploy NEAR Rust contract; register a batch. | Batch visible on NEAR testnet. |
| 6 | Record supply-chain events; generate QR and build verification page. | End-to-end traceability. |
| 7 | Test, fix issues, prepare demo script and backup video. | Hackathon-ready MVP. |

 

# **14\. Hackathon Demonstration Flow**

8\.          Show the Arduino connected to a real soil sensor and DHT22, with live readings on the dashboard.  
9\.          Lower the soil-moisture reading or use a controlled test condition to trigger the irrigation threshold; show the relay and pump response.  
10\.    Register a sample tomato or maize batch in the application and show the NEAR testnet transaction reference.  
11\.    Append a harvest or distributor-transfer event and show the updated batch timeline.  
12\.    Scan the generated QR code and open the public verification page.  
13\.    Explain how the page checks the event data against the hash committed on NEAR.

# **15\. Scope Boundaries and Future Enhancements**

Included in the prototype:

·       One Arduino UNO connected to a computer by USB.  
·       Soil-moisture and temperature/humidity sensing.  
·       One low-voltage demonstration pump controlled through a relay.  
·       A web dashboard and off-chain sensor history.  
·       NEAR testnet batch registration and supply-chain event records.  
·       QR-based public verification.

Future enhancements (not required for the first demo):

·       ESP32 or another gateway for independent Wi-Fi connectivity.  
·       Cold-storage temperature monitoring and alerts.  
·       Device identity, signed sensor payloads and tamper detection.  
·       More farms, multiple sensor nodes and offline data buffering.  
·       Crop-specific agronomic models and AI-assisted recommendations.  
·       Payments, buyer-seller settlement and incentive mechanisms.

# **16\. Risks and Mitigations**

| Risk | Mitigation |
| :---- | :---- |
| Sensor readings vary by soil type. | Calibrate using dry and wet samples; display raw and calibrated values. |
| Pump runs continuously or runs dry. | Use a maximum runtime, cooldown and manual override; add a water-level sensor if available. |
| UNO has no built-in Wi-Fi. | Use USB serial and a computer gateway for the prototype. |
| Blockchain transactions fail or take time. | Show pending/failed states, retain retry controls and prepare a testnet backup demo. |
| False or manipulated sensor data. | Validate payloads, authenticate the gateway and clearly label sensor data as reported measurements. |
| Private key exposure. | Keep signing credentials server-side, use testnet-only credentials and never commit secrets. |

 

# **17\. Project Impact and PwC Research Alignment**

FarmChain is aligned with themes discussed in PwC's Nigeria agribusiness value-chain research, including agricultural productivity, improved farming practices, technology adoption, storage and trade. The prototype translates these themes into a practical demonstration: low-cost sensing and irrigation at farm level, plus traceability records across product movement.

Reference for project rationale: PwC Nigeria, “Unlocking productivity and investment opportunities across Nigeria's agribusiness value-chain” (2020). The report should be consulted directly when preparing the final hackathon submission and any claims about market size, losses or economic impact.

# **18\. One-Sentence Pitch**

**FarmChain connects physical agricultural infrastructure with NEAR blockchain, helping farmers monitor growing conditions, automate basic irrigation and create verifiable records of agricultural products from harvest to consumer.**

# **19\. Useful Developer Resources**

·       **PwC Nigeria agribusiness report:** https\://www\.pwc.com/ng/en/assets/pdf/unlocking-investment-opportunities-in-agribusiness.pdf  
·       **NEAR developer documentation:** https\://docs.near.org/  
·       **NEAR Rust SDK:** https\://github.com/near/near-sdk-rs  
·       **NEAR SDK API reference:** https\://docs.rs/near-sdk/latest/near\_sdk/  
·       **Arduino UNO R3 documentation:** https\://docs.arduino.cc/hardware/uno-rev3/  
·       **Supabase documentation:** https\://supabase.com/docs

