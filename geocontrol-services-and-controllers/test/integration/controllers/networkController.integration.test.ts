import * as networkController from "@controllers/networkController";
import { NetworkRepository } from "@repositories/NetworkRepository";
import { NetworkDAO } from "@dao/NetworkDAO";
import "jest";

jest.mock("../../../src/repositories/NetworkRepository");

const fakeNetwork: NetworkDAO = {
  networkMac: "00:11:22:33:44:55",
  name: "Test Network",
  gateways: []
};

describe("networkController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("createNetwork calls repository with correct params", async () => {
    const createNetworkMock = jest.fn().mockResolvedValue(undefined);
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      createNetwork: createNetworkMock
    }));

    await networkController.createNetwork(fakeNetwork.networkMac, fakeNetwork.name, "desc");
    expect(createNetworkMock).toHaveBeenCalledWith(fakeNetwork.networkMac, fakeNetwork.name);
  });

  it("getNetworkByMac returns network", async () => {
    const getNetworkByNetworkMacMock = jest.fn().mockResolvedValue(fakeNetwork);
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByNetworkMac: getNetworkByNetworkMacMock
    }));

    const result = await networkController.getNetworkByMac(fakeNetwork.networkMac);
    expect(result).toEqual(fakeNetwork);
    expect(getNetworkByNetworkMacMock).toHaveBeenCalledWith(fakeNetwork.networkMac);
  });

  it("getAllNetworks returns networks", async () => {
    const getAllNetworksMock = jest.fn().mockResolvedValue([fakeNetwork]);
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getAllNetworks: getAllNetworksMock
    }));

    const result = await networkController.getAllNetworks();
    expect(result).toEqual([fakeNetwork]);
    expect(getAllNetworksMock).toHaveBeenCalled();
  });

  it("deleteNetwork calls repository with correct param", async () => {
    const deleteNetworkMock = jest.fn().mockResolvedValue(undefined);
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      deleteNetwork: deleteNetworkMock
    }));

    await networkController.deleteNetwork(fakeNetwork.networkMac);
    expect(deleteNetworkMock).toHaveBeenCalledWith(fakeNetwork.networkMac);
  });

  it("updateNetwork calls repository and returns updated network", async () => {
    const updatedNetwork = { ...fakeNetwork, name: "Updated" };
    const updateNetworkMock = jest.fn().mockResolvedValue(updatedNetwork);
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      updateNetwork: updateNetworkMock
    }));

    const result = await networkController.updateNetwork(fakeNetwork.networkMac, "Updated");
    expect(result).toEqual(updatedNetwork);
    expect(updateNetworkMock).toHaveBeenCalledWith(fakeNetwork.networkMac, "Updated");
  });

  // Error propagation tests
  it("createNetwork throws if repository fails", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      createNetwork: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(networkController.createNetwork(fakeNetwork.networkMac, fakeNetwork.name, "desc")).rejects.toThrow("fail");
  });

  it("getNetworkByMac throws if repository fails", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getNetworkByNetworkMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(networkController.getNetworkByMac(fakeNetwork.networkMac)).rejects.toThrow("fail");
  });

  it("getAllNetworks throws if repository fails", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      getAllNetworks: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(networkController.getAllNetworks()).rejects.toThrow("fail");
  });

  it("deleteNetwork throws if repository fails", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      deleteNetwork: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(networkController.deleteNetwork(fakeNetwork.networkMac)).rejects.toThrow("fail");
  });

  it("updateNetwork throws if repository fails", async () => {
    (NetworkRepository as jest.Mock).mockImplementation(() => ({
      updateNetwork: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(networkController.updateNetwork(fakeNetwork.networkMac, "Updated")).rejects.toThrow("fail");
  });
});