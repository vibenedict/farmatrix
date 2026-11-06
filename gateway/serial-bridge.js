/**
 * FARMATRIX Edge Gateway Daemon (Node.js)
 * Connects Mac/PC to Arduino UNO R3 over USB SerialPort
 * Validates JSON frames and forwards telemetry to FARMATRIX API / Supabase
 */

const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const http = require('http');

const SERIAL_PORT_PATH = process.env.SERIAL_PORT || '/dev/tty.usbmodem1101';
const BAUD_RATE = 9600;
const API_ENDPOINT = process.env.FARMATRIX_API || 'http://localhost:3000/api/telemetry';

console.log('==============================================');
console.log('   FARMATRIX IoT Serial Gateway Bridge v1.0   ');
console.log('==============================================');
console.log(`[GATEWAY] Monitoring port: ${SERIAL_PORT_PATH} @ ${BAUD_RATE} baud`);
console.log(`[GATEWAY] Dispatch endpoint: ${API_ENDPOINT}`);

let port;
try {
  port = new SerialPort({ path: SERIAL_PORT_PATH, baudRate: BAUD_RATE }, (err) => {
    if (err) {
      console.warn(`[GATEWAY] Hardware notice: ${err.message}`);
      console.log('[GATEWAY] Web simulator or Web Serial can be used concurrently.');
    }
  });

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  parser.on('data', (line) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      try {
        const packet = JSON.parse(trimmed);
        console.log('[SERIAL RX]', packet);

        const payload = JSON.stringify({
          farmId: 'farm-kano-04',
          soilMoisture: packet.soil_pct,
          soilMoistureRaw: packet.raw_adc,
          temperature: packet.temp,
          humidity: packet.humidity,
          lightIntensity: packet.light,
          pumpStatus: packet.pump_status,
          source: 'HARDWARE_SERIAL'
        });

        const url = new URL(API_ENDPOINT);
        const req = http.request(
          {
            hostname: url.hostname,
            port: url.port || 3000,
            path: url.pathname,
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': Buffer.byteLength(payload)
            }
          },
          (res) => {
            if (res.statusCode === 200) {
              console.log('[GATEWAY-TX] Pushed to cloud API successfully.');
            }
          }
        );

        req.on('error', (e) => {
          console.error('[GATEWAY-TX] HTTP Error:', e.message);
        });

        req.write(payload);
        req.end();
      } catch (e) {
        console.warn('[GATEWAY] Invalid JSON packet:', trimmed);
      }
    }
  });
} catch (e) {
  console.log('[GATEWAY] Initialized in standby mode.');
}
