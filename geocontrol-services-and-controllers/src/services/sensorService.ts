import { SensorRepository } from "@repositories/SensorRepository";
import { SensorDAO } from "@dao/SensorDAO";

export class SensorService {
  private sensorRepo: SensorRepository;

  constructor() {
    this.sensorRepo = new SensorRepository();
  }

  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string,
    gatewayMac: string
  ): Promise<SensorDAO> {
    return await this.sensorRepo.createSensor(macAddress, name, description, variable, unit, gatewayMac);
  }

  async updateSensor(macAddress: string, updates: Partial<SensorDAO>): Promise<SensorDAO> {
    return await this.sensorRepo.updateSensor(macAddress, updates.name, updates.description, updates.variable, updates.unit);
  }

  async deleteSensor(macAddress: string): Promise<void> {
    await this.sensorRepo.deleteSensor(macAddress);
  }
}