import { GatewayRepository } from "@repositories/GatewayRepository";
import { GatewayDAO } from "@dao/GatewayDAO";
import { NotFoundError } from "@models/errors/NotFoundError";

export class GatewayService {
  private gatewayRepo: GatewayRepository;

  constructor() {
    this.gatewayRepo = new GatewayRepository();
  }

  async getAllGateways(): Promise<GatewayDAO[]> {
    return await this.gatewayRepo.getAllGateways();
  }

  async createGateway(gatewayMac: string, name: string, networkCode: string): Promise<GatewayDAO> {
    return await this.gatewayRepo.createGateway(gatewayMac, name, networkCode);
  }

  async deleteGateway(gatewayMac: string): Promise<void> {
    const gateway = await this.gatewayRepo.getGatewayByGatewayMac(gatewayMac);
    if (!gateway) {
      throw new NotFoundError(`Gateway with MAC ${gatewayMac} not found`);
    }
    await this.gatewayRepo.deleteGateway(gatewayMac);
  }

  async updateGateway(gatewayMac: string, updates: Partial<GatewayDAO> & { networkCode?: string }): Promise<GatewayDAO> {
    const gateway = await this.gatewayRepo.getGatewayByGatewayMac(gatewayMac);
    if (!gateway) {
        throw new NotFoundError(`Gateway with MAC ${gatewayMac} not found`);
    }

    // Extract networkCode separately
    const { networkCode, ...gatewayUpdates } = updates;

    // Update the gateway
    return await this.gatewayRepo.updateGateway(gatewayMac, gatewayUpdates.name, networkCode);
  }
}