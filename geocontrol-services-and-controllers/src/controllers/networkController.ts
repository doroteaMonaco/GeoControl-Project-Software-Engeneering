import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";

export async function createNetwork(
  networkCode: string,
  name: string,
  description: string
): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.createNetwork(networkCode, name);
}

export async function getNetworkByMac(networkCode: string): Promise<NetworkDAO | null> {
  const networkRepo = new NetworkRepository();
  return await networkRepo.getNetworkByNetworkMac(networkCode);
}

export async function getAllNetworks(): Promise<NetworkDAO[]> {
  const networkRepo = new NetworkRepository();
  return await networkRepo.getAllNetworks();
}

export async function deleteNetwork(networkCode: string): Promise<void> {
  const networkRepo = new NetworkRepository();
  await networkRepo.deleteNetwork(networkCode);
}


export async function updateNetwork(
  networkCode: string,
  name: string,
): Promise<NetworkDAO> {
  const networkRepo = new NetworkRepository();
  return await networkRepo.updateNetwork(networkCode, name);
}

