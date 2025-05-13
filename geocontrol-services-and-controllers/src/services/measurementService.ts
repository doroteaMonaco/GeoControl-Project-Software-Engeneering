import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { MeasurementDAO } from "@dao/MeasurementDAO";

export class MeasurementService {
  private measurementRepo: MeasurementRepository;

  constructor() {
    this.measurementRepo = new MeasurementRepository();
  }

  async recordMeasurement(sensorMac: string, value: number, timestamp: Date): Promise<MeasurementDAO> {
    return await this.measurementRepo.createMeasurement(value, timestamp, sensorMac);
  }

  async getMeasurementsBySensor(sensorMac: string): Promise<MeasurementDAO[]> {
    return await this.measurementRepo.getMeasurementsBySensorMac(sensorMac);
  }
}