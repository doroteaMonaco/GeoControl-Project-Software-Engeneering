
import { SensorDAO } from "@models/dao/SensorDAO";
import { SensorRepository } from "@repositories/SensorRepository";

export async function createSensor(
  macAddress: string,
  name: string,
  description: string,
  variable: string,
  unit: string,
  gatewayMac: string
): Promise<void> {
  const sensorRepo = new SensorRepository();
  await sensorRepo.createSensor(macAddress, name, description, variable, unit, gatewayMac);
}

export async function getSensorByMac(macAddress: string): Promise<SensorDAO | null> {
  const sensorRepo = new SensorRepository();
  return await sensorRepo.getSensorByMacAddress(macAddress);
}

export async function getSensorsByGatewayMac(gatewayMac: string): Promise<SensorDAO[]> {
  const sensorRepo = new SensorRepository();
  return await sensorRepo.getSensorsByGatewayMac(gatewayMac);
}

export async function deleteSensor(macAddress: string): Promise<void> {
  const sensorRepo = new SensorRepository();
  await sensorRepo.deleteSensor(macAddress);
}

export async function updateSensor(macAddress: string, updates: Partial<SensorDAO>): Promise<SensorDAO> {
  const sensorRepo = new SensorRepository();
  return await sensorRepo.updateSensor(macAddress, updates.name, updates.description, updates.variable, updates.unit);
}

