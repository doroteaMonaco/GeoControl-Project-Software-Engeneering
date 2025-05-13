import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { SensorDAO } from "@dao/SensorDAO";
import { GatewayDAO } from "@dao/GatewayDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class SensorRepository {
  private repo: Repository<SensorDAO>;
  private gatewayRepo: Repository<GatewayDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(SensorDAO);
    this.gatewayRepo = AppDataSource.getRepository(GatewayDAO);
  }

  async getSensorByMacAddress(macAddress: string): Promise<SensorDAO> {
    const sensors = await this.repo.find({ relations: ["gateway"] });
    return findOrThrowNotFound(
      sensors,
      (s) => s.macAddress === macAddress,
      `Sensor with MAC ${macAddress} not found`
    );
  }

  async getSensorsByGatewayMac(gatewayMac: string): Promise<SensorDAO[]> {
    return await this.repo
      .createQueryBuilder("sensor")
      .leftJoinAndSelect("sensor.gateway", "gateway")
      .where("gateway.gatewayMac = :gatewayMac", { gatewayMac })
      .getMany();
  }

  async createSensor(
    macAddress: string,
    name: string,
    description: string,
    variable: string,
    unit: string,
    gatewayMac: string
  ): Promise<SensorDAO> {
    const existingSensors = await this.repo.find();
    throwConflictIfFound(
      existingSensors,
      (s) => s.macAddress === macAddress,
      `Sensor with MAC ${macAddress} already exists`
    );

    const gateways = await this.gatewayRepo.find();
    const gateway = findOrThrowNotFound(
      gateways,
      (g) => g.gatewayMac === gatewayMac,
      `Gateway with MAC ${gatewayMac} not found`
    );

    const sensor = this.repo.create({
      macAddress,
      name,
      description,
      variable,
      unit,
      gateway,
    });

    return await this.repo.save(sensor);
  }

  async updateSensor(
    macAddress: string,
    name?: string,
    description?: string,
    variable?: string,
    unit?: string
  ): Promise<SensorDAO> {
    const sensors = await this.repo.find();
    const sensor = findOrThrowNotFound(
      sensors,
      (s) => s.macAddress === macAddress,
      `Sensor with MAC ${macAddress} not found`
    );

    if (name !== undefined) sensor.name = name;
    if (description !== undefined) sensor.description = description;
    if (variable !== undefined) sensor.variable = variable;
    if (unit !== undefined) sensor.unit = unit;

    return await this.repo.save(sensor);
  }

  async deleteSensor(macAddress: string): Promise<void> {
    const sensors = await this.repo.find();
    const sensor = findOrThrowNotFound(
      sensors,
      (s) => s.macAddress === macAddress,
      `Sensor with MAC ${macAddress} not found`
    );
    await this.repo.remove(sensor);
  }
}
