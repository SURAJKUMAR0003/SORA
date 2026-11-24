import React, { useState } from 'react';
import { hardwareBridge, HardwareTelemetryPacket } from '../utils/hardwareBridge';
import { 
  Cpu, 
  Wifi, 
  Terminal, 
  Code, 
  CheckCircle, 
  AlertCircle, 
  Server, 
  Radio, 
  Copy,
  Layers
} from 'lucide-react';

export const HardwareIntegration: React.FC = () => {
  const [telemetry] = useState<HardwareTelemetryPacket>(hardwareBridge.generateTelemetrySample());
  const [adapterMode, setAdapterMode] = useState<string>('SIMULATION');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  const copyToClipboard = (text: string, tabId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTab(tabId);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const esp32Snippet = `// ESP32 Motor Actuator & Sensor Driver Firmware
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>

const char* ssid = "Hospital_Robotics_IoT";
const char* password = "AutonomousHospital2026";
const char* mqtt_server = "192.168.1.100";

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(mqttCallback);
  pinMode(PIN_ESTOP_RELAY, INPUT_PULLUP);
}

void mqttCallback(char* topic, byte* payload, unsigned int length) {
  StaticJsonDocument<256> doc;
  deserializeJson(doc, payload, length);
  const char* cmd = doc["commandType"];
  if (strcmp(cmd, "HALT_EMERGENCY") == 0) {
    emergencyBrake();
  }
}`;

  const pythonFastAPISnippet = `# Raspberry Pi 4 B - High-Level Navigation & FastAPI WebSocket Bridge
from fastapi import FastAPI, WebSocket
import asyncio, json, serial

app = FastAPI(title="SORA Physical Hardware Bridge")
ser = serial.Serial('/dev/ttyUSB0', 115200, timeout=1)

@app.websocket("/ws/robot/sora")
async def robot_telemetry_ws(websocket: WebSocket):
    await websocket.accept()
    while True:
        # Read LiDAR & ESP32 motor telemetry over UART serial
        raw_line = ser.readline().decode('utf-8', errors='ignore')
        if raw_line:
            telemetry_packet = json.loads(raw_line)
            await websocket.send_json(telemetry_packet)
        await asyncio.sleep(0.05) # 20Hz update loop`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-cyan-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-tech text-white flex items-center gap-2">
              PHYSICAL ROBOT HARDWARE INTEGRATION READINESS
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RASPBERRY PI 4 + ESP32 ARCHITECTURE
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Hardware abstraction layer (HAL), communication protocols, and physical microcontroller bridge
            </p>
          </div>
        </div>

        {/* Status Mode Badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-navy-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono-num font-bold flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Active Adapter: {adapterMode}
          </span>
        </div>
      </div>

      {/* Architecture Disclaimer Card */}
      <div className="p-4 bg-navy-900/90 rounded-2xl border border-slate-700 text-xs text-slate-300 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-white block">Physical Hardware Connection Notice:</strong>
          <p>
            This application currently executes on a high-fidelity <strong>Simulation Adapter</strong> for demonstration purposes. 
            The system is designed with a strict clean-boundary communication contract so that simulated actuators can immediately be linked to a physical <strong>Raspberry Pi 4B (ROS2 / Python)</strong> and <strong>ESP32 Motor Controller (FreeRTOS)</strong> via WebSocket or MQTT without changing application logic.
          </p>
        </div>
      </div>

      {/* Hardware Telemetry Spec Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-[11px] uppercase font-mono-num block font-semibold">Microcontroller MCU</span>
          <div className="text-base font-bold text-white mt-1">ESP32-WROOM-32D</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Dual-core 240MHz, FreeRTOS PID motor loop</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-[11px] uppercase font-mono-num block font-semibold">Edge Compute Host</span>
          <div className="text-base font-bold text-cyan-300 mt-1">Raspberry Pi 4 (8GB)</div>
          <p className="text-[11px] text-slate-400 mt-0.5">High-level A* trajectory & WebSocket broker</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-[11px] uppercase font-mono-num block font-semibold">LiDAR Scanner</span>
          <div className="text-base font-bold text-emerald-400 mt-1">RPLiDAR A1M8 360°</div>
          <p className="text-[11px] text-slate-400 mt-0.5">12m radius, 8000 samples/sec SLAM scan</p>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-slate-400 text-[11px] uppercase font-mono-num block font-semibold">Power System</span>
          <div className="text-base font-bold text-purple-400 mt-1">24V 40Ah LiFePO4</div>
          <p className="text-[11px] text-slate-400 mt-0.5">8 hours continuous autonomous transit runtime</p>
        </div>
      </div>

      {/* Code Tabs: ESP32 & FastAPI / Python Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ESP32 C++ Firmware */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4 text-cyan-400" />
              ESP32 FreeRTOS Motor Driver C++ Code
            </h4>
            <button
              onClick={() => copyToClipboard(esp32Snippet, 'esp32')}
              className="p-1.5 bg-navy-900 hover:bg-navy-800 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedTab === 'esp32' ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="bg-navy-950 p-4 rounded-xl border border-slate-800 text-[11px] text-cyan-300 font-mono overflow-x-auto max-h-[300px]">
            {esp32Snippet}
          </pre>
        </div>

        {/* Python FastAPI Host */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              Raspberry Pi 4 FastAPI WebSocket Bridge
            </h4>
            <button
              onClick={() => copyToClipboard(pythonFastAPISnippet, 'fastapi')}
              className="p-1.5 bg-navy-900 hover:bg-navy-800 border border-slate-700 rounded-lg text-xs text-slate-300 flex items-center gap-1 transition"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedTab === 'fastapi' ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="bg-navy-950 p-4 rounded-xl border border-slate-800 text-[11px] text-emerald-300 font-mono overflow-x-auto max-h-[300px]">
            {pythonFastAPISnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
