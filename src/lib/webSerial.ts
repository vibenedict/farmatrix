/**
 * Web Serial API bridge for direct browser-to-Arduino UNO R3 communication
 * Supports 9600 / 115200 baud serial JSON streams from the FARMATRIX Arduino firmware.
 */

export interface SerialTelemetryPacket {
  soil_raw?: number;
  soil_pct: number;
  temp: number;
  humidity: number;
  light?: number;
  pump_status: "ON" | "OFF" | "AUTO";
  safeguard: boolean;
}

export class WebSerialManager {
  private port: any = null;
  private reader: any = null;
  private keepReading = false;
  private buffer = "";

  public isSupported(): boolean {
    return typeof window !== "undefined" && "serial" in navigator;
  }

  public async connect(
    onData: (packet: SerialTelemetryPacket) => void,
    onError: (err: Error) => void
  ): Promise<boolean> {
    if (!this.isSupported()) {
      onError(new Error("Web Serial API is not supported in this browser. Please use Chrome/Edge or the Simulator."));
      return false;
    }

    try {
      // Request serial port from user
      this.port = await (navigator as any).serial.requestPort();
      await this.port.open({ baudRate: 9600 });
      this.keepReading = true;

      const textDecoder = new TextDecoderStream();
      this.port.readable.pipeTo(textDecoder.writable);
      this.reader = textDecoder.readable.getReader();

      this.readLoop(onData, onError);
      return true;
    } catch (err: any) {
      onError(err);
      return false;
    }
  }

  private async readLoop(
    onData: (packet: SerialTelemetryPacket) => void,
    onError: (err: Error) => void
  ) {
    while (this.keepReading && this.reader) {
      try {
        const { value, done } = await this.reader.read();
        if (done) break;
        if (value) {
          this.buffer += value;
          const lines = this.buffer.split("\n");
          this.buffer = lines.pop() || "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
              try {
                const parsed = JSON.parse(trimmed);
                onData(parsed);
              } catch {
                // Ignore malformed JSON frames
              }
            }
          }
        }
      } catch (err: any) {
        if (this.keepReading) onError(err);
        break;
      }
    }
  }

  public async disconnect(): Promise<void> {
    this.keepReading = false;
    try {
      if (this.reader) {
        await this.reader.cancel();
        this.reader = null;
      }
      if (this.port) {
        await this.port.close();
        this.port = null;
      }
    } catch {
      // ignore close errors
    }
  }
}
