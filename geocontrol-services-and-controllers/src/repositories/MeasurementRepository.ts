import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { MeasurementDAO } from "@dao/MeasurementDAO";
import { SensorDAO } from "@dao/SensorDAO";
import { findOrThrowNotFound } from "@utils";

export class MeasurementRepository {
  private repo: Repository<MeasurementDAO>;
  private sensorRepo: Repository<SensorDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(MeasurementDAO);
    this.sensorRepo = AppDataSource.getRepository(SensorDAO);
  }

  async getMeasurementsBySensorMac(sensorMac: string): Promise<MeasurementDAO[]> {
    return this.repo
      .createQueryBuilder("measurement")
      .leftJoinAndSelect("measurement.sensor", "sensor")
      .where("sensor.macAddress = :sensorMac", { sensorMac })
      .getMany();
  }

  async getMeasurementsByNetworkMac(networkMac: string): Promise<MeasurementDAO[]> {
    return this.repo
      .createQueryBuilder("measurement")
      .leftJoinAndSelect("measurement.sensor", "sensor")
      .leftJoinAndSelect("sensor.gateway", "gateway")
      .leftJoinAndSelect("gateway.network", "network")
      .where("network.networkMac = :networkMac", { networkMac })
      .getMany();
  }

  async createMeasurement(
    value: number,
    createdAt: Date,
    sensorMac: string
  ): Promise<MeasurementDAO> {
    const sensors = await this.sensorRepo.find();
    const sensor = findOrThrowNotFound(
      sensors,
      (s) => s.macAddress === sensorMac,
      `Sensor with MAC ${sensorMac} not found`
    );
  
    const measurement = this.repo.create({
      value,
      createdAt,
      sensor,
    });
  
    return await this.repo.save(measurement);
  }
}
