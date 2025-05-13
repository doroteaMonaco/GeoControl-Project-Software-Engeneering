import * as gatewayController from "@controllers/gatewayController";
import { GatewayRepository } from "@repositories/GatewayRepository";
import { GatewayDAO } from "@dao/GatewayDAO";
import "jest";

jest.mock("../../../src/repositories/GatewayRepository");

const fakeGateway: GatewayDAO = {
  gatewayMac: "11:22:33:44:55:66",
  name: "Test Gateway",
  sensors: [],
  network: { networkMac: "00:11:22:33:44:55", name: "Test Network", gateways: [] }
};

describe("gatewayController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getGatewayByMac returns gateway", async () => {
    const getGatewayByGatewayMacMock = jest.fn().mockResolvedValue(fakeGateway);
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByGatewayMac: getGatewayByGatewayMacMock
    }));

    const result = await gatewayController.getGatewayByMac(fakeGateway.gatewayMac);
    expect(result).toEqual(fakeGateway);
    expect(getGatewayByGatewayMacMock).toHaveBeenCalledWith(fakeGateway.gatewayMac);
  });

  it("getGatewaysByNetworkMac returns gateways", async () => {
    const getGatewayByNetworkMacMock = jest.fn().mockResolvedValue([fakeGateway]);
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByNetworkMac: getGatewayByNetworkMacMock
    }));

    const result = await gatewayController.getGatewaysByNetworkMac(fakeGateway.network.networkMac);
    expect(result).toEqual([fakeGateway]);
    expect(getGatewayByNetworkMacMock).toHaveBeenCalledWith(fakeGateway.network.networkMac);
  });

  it("createGateway calls repository with correct params", async () => {
    const createGatewayMock = jest.fn().mockResolvedValue(fakeGateway);
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      createGateway: createGatewayMock
    }));

    const result = await gatewayController.createGateway(
      fakeGateway.gatewayMac,
      fakeGateway.name,
      fakeGateway.network.networkMac
    );
    expect(result).toEqual(fakeGateway);
    expect(createGatewayMock).toHaveBeenCalledWith(
      fakeGateway.gatewayMac,
      fakeGateway.name,
      fakeGateway.network.networkMac
    );
  });

  it("deleteGateway calls repository with correct param", async () => {
    const deleteGatewayMock = jest.fn().mockResolvedValue(undefined);
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      deleteGateway: deleteGatewayMock
    }));

    await gatewayController.deleteGateway(fakeGateway.gatewayMac);
    expect(deleteGatewayMock).toHaveBeenCalledWith(fakeGateway.gatewayMac);
  });

  it("updateGateway calls repository and returns updated gateway", async () => {
    const updatedGateway = { ...fakeGateway, name: "Updated" };
    const updateGatewayMock = jest.fn().mockResolvedValue(updatedGateway);
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      updateGateway: updateGatewayMock
    }));

    const result = await gatewayController.updateGateway(fakeGateway.gatewayMac, { name: "Updated", networkCode: fakeGateway.network.networkMac });
    expect(result).toEqual(updatedGateway);
    expect(updateGatewayMock).toHaveBeenCalledWith(
      fakeGateway.gatewayMac,
      "Updated",
      fakeGateway.network.networkMac
    );
  });

  // Error propagation tests
  it("getGatewayByMac throws if repository fails", async () => {
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByGatewayMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(gatewayController.getGatewayByMac(fakeGateway.gatewayMac)).rejects.toThrow("fail");
  });

  it("getGatewaysByNetworkMac throws if repository fails", async () => {
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      getGatewayByNetworkMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(gatewayController.getGatewaysByNetworkMac(fakeGateway.network.networkMac)).rejects.toThrow("fail");
  });

  it("createGateway throws if repository fails", async () => {
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      createGateway: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(gatewayController.createGateway(
      fakeGateway.gatewayMac,
      fakeGateway.name,
      fakeGateway.network.networkMac
    )).rejects.toThrow("fail");
  });

  it("deleteGateway throws if repository fails", async () => {
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      deleteGateway: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(gatewayController.deleteGateway(fakeGateway.gatewayMac)).rejects.toThrow("fail");
  });

  it("updateGateway throws if repository fails", async () => {
    (GatewayRepository as jest.Mock).mockImplementation(() => ({
      updateGateway: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(gatewayController.updateGateway(fakeGateway.gatewayMac, { name: "Updated", networkCode: fakeGateway.network.networkMac })).rejects.toThrow("fail");
  });
});