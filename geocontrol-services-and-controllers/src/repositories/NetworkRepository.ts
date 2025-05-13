import { AppDataSource } from "@database";
import { Repository } from "typeorm";
import { NetworkDAO } from "@dao/NetworkDAO";
import { findOrThrowNotFound, throwConflictIfFound } from "@utils";

export class NetworkRepository {
  private repo: Repository<NetworkDAO>;

  constructor() {
    this.repo = AppDataSource.getRepository(NetworkDAO);
  }

  async getAllNetworks(): Promise<NetworkDAO[]> {
    return await this.repo.find();
  }

  async getNetworkByNetworkMac(networkMac: string): Promise<NetworkDAO> {
    return findOrThrowNotFound(
      await this.repo.find({
        where: {
          networkMac,
        }
      }),
      () => true,
      `Network with MAC address '${networkMac}' not found`
    );
  }

  async createNetwork(networkMac: string, name: string): Promise<NetworkDAO> {
    throwConflictIfFound(
      await this.repo.find({ where: { networkMac: networkMac } }),
      () => true,
      `Network with MAC address '${networkMac}' already exists`
    );
    return this.repo.save({networkMac, name});
  }

  async deleteNetwork(networkMac: string): Promise<void> {
    const network = await this.getNetworkByNetworkMac(networkMac);
    this.repo.remove(network);
  }

  async updateNetwork(networkMac: string, name: string): Promise<NetworkDAO> {
    const network = await this.getNetworkByNetworkMac(networkMac);
    network.name = name;
    return this.repo.save(network);
  }
}
