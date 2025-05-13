import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";

export class NetworkService {
  private networkRepo: NetworkRepository;

  constructor() {
    this.networkRepo = new NetworkRepository();
  }

  async getAllNetworks(): Promise<NetworkDAO[]> {
    return await this.networkRepo.getAllNetworks();
  }

  async createNetwork(networkCode: string, name: string): Promise<NetworkDAO> {
    return await this.networkRepo.createNetwork(networkCode, name);
  }

    async deleteNetwork(networkCode: string): Promise<void> {
        await this.networkRepo.deleteNetwork(networkCode);
    }

    async updateNetwork(networkCode: string, name: string): Promise<NetworkDAO> {
        return await this.networkRepo.updateNetwork(networkCode, name);
    }
}