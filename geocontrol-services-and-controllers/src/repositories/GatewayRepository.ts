import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NetworkDAO } from "@dao/NetworkDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";
import { NotFoundError } from "@models/errors/NotFoundError";

export class GatewayRepository {
  private repo: Repository<GatewayDAO>;
  private networkRepo: Repository<NetworkDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(GatewayDAO);
    this.networkRepo = AppDataSource.getRepository(NetworkDAO);
  }

  async getAllGateways(): Promise<GatewayDAO[]> {
    return await this.repo.find({
      relations: ["network", "sensors"],
    });
  }

  async getGatewayByGatewayMac(gatewayMac: string): Promise<GatewayDAO> {
    const gateways = await this.repo.find({
      relations: ["network", "sensors"],
    });

    return findOrThrowNotFound(
      gateways,
      (g) => g.gatewayMac === gatewayMac,
      `Gateway with MAC ${gatewayMac} not found`
    );
  }

  async getGatewayByNetworkMac(networkCode: string): Promise<GatewayDAO[]> {
    return await this.repo
      .createQueryBuilder("gateway")
      .leftJoinAndSelect("gateway.network", "network")
      .leftJoinAndSelect("gateway.sensors", "sensor")
      .where("network.networkMac = :networkCode", { networkCode })
      .getMany();
  }

  async createGateway(
    gatewayMac: string,
    name: string,
    networkCode: string
  ): Promise<GatewayDAO> {
    const existing = await this.repo.find();
    throwConflictIfFound(
      existing,
      (g) => g.gatewayMac === gatewayMac,
      `Gateway with MAC ${gatewayMac} already exists`
    );
  
    const network = await this.networkRepo.findOneBy({ networkMac: networkCode });
    if (!network) {
      throw new NotFoundError(`Network with MAC ${networkCode} not found`);
    }
  
    const gateway = this.repo.create({
      gatewayMac,
      name,
      network, 
    });
  
    return await this.repo.save(gateway);
  }

  async deleteGateway(gatewayMac: string): Promise<void> {
    const gateways = await this.repo.find();
    const gateway = findOrThrowNotFound(
      gateways,
      (g) => g.gatewayMac === gatewayMac,
      `Gateway with MAC ${gatewayMac} not found`
    );
    await this.repo.remove(gateway);
  }

  async updateGateway(
    gatewayMac: string,
    name?: string,
    networkCode?: string
  ): Promise<GatewayDAO> {
    const gateways = await this.repo.find();
    const gateway = findOrThrowNotFound(
      gateways,
      (g) => g.gatewayMac === gatewayMac,
      `Gateway with MAC ${gatewayMac} not found`
    );

    if (networkCode) {
      const network = await this.networkRepo.findOneBy({ networkMac: networkCode });
      if (!network) {
        throw new NotFoundError(`Network with MAC ${networkCode} not found`);
      }
      gateway.network = network;
    }

    if (name) {
      gateway.name = name;
    }

    return await this.repo.save(gateway);
  }
}
