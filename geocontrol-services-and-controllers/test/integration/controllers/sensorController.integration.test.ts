import { SensorDAO } from "@dao/SensorDAO";
import { GatewayDAO } from "@dao/GatewayDAO";
import * as sensorController from "@controllers/sensorController";
import { SensorRepository } from "@repositories/SensorRepository";
import 'jest';

jest.mock("../../../src/repositories/SensorRepository");

const fakeNetwork = {
  networkMac: "networkId",
  name: "Test Network",
  gateways: [],
};

const fakeGateway: GatewayDAO = {
  gatewayMac: "11:22:33:44:55:66",
  name: "Test Gateway",
  sensors: [],
  network: fakeNetwork,
};

const fakeSensor: SensorDAO = {
  macAddress: "AA:BB:CC:DD:EE:FF",
  name: "Test Sensor",
  description: "A test sensor",
  variable: "temperature",
  unit: "C",
  gateway: fakeGateway,
  measurements: [],
};

describe("sensorController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("createSensor calls repository with correct params", async () => {
    const createSensorMock = jest.fn().mockResolvedValue(undefined);
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      createSensor: createSensorMock
    }));

    await sensorController.createSensor(
      fakeSensor.macAddress,
      fakeSensor.name,
      fakeSensor.description,
      fakeSensor.variable,
      fakeSensor.unit,
      fakeGateway.gatewayMac
    );
    expect(createSensorMock).toHaveBeenCalledWith(
      fakeSensor.macAddress,
      fakeSensor.name,
      fakeSensor.description,
      fakeSensor.variable,
      fakeSensor.unit,
      fakeGateway.gatewayMac
    );
  });

  it("getSensorByMac returns sensor", async () => {
    const getSensorByMacAddressMock = jest.fn().mockResolvedValue(fakeSensor);
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMacAddress: getSensorByMacAddressMock
    }));

    const result = await sensorController.getSensorByMac(fakeSensor.macAddress);
    expect(result).toEqual(fakeSensor);
    expect(getSensorByMacAddressMock).toHaveBeenCalledWith(fakeSensor.macAddress);
  });

  it("getSensorsByGatewayMac returns sensors", async () => {
    const getSensorsByGatewayMacMock = jest.fn().mockResolvedValue([fakeSensor]);
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorsByGatewayMac: getSensorsByGatewayMacMock
    }));

    const result = await sensorController.getSensorsByGatewayMac(fakeGateway.gatewayMac);
    expect(result).toEqual([fakeSensor]);
    expect(getSensorsByGatewayMacMock).toHaveBeenCalledWith(fakeGateway.gatewayMac);
  });

  it("deleteSensor calls repository with correct param", async () => {
    const deleteSensorMock = jest.fn().mockResolvedValue(undefined);
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      deleteSensor: deleteSensorMock
    }));

    await sensorController.deleteSensor(fakeSensor.macAddress);
    expect(deleteSensorMock).toHaveBeenCalledWith(fakeSensor.macAddress);
  });

  it("updateSensor calls repository and returns updated sensor", async () => {
    const updatedSensor = { ...fakeSensor, name: "Updated" };
    const updateSensorMock = jest.fn().mockResolvedValue(updatedSensor);
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      updateSensor: updateSensorMock
    }));

    const result = await sensorController.updateSensor(fakeSensor.macAddress, { name: "Updated" });
    expect(result).toEqual(updatedSensor);
    expect(updateSensorMock).toHaveBeenCalledWith(
      fakeSensor.macAddress,
      "Updated",
      undefined,
      undefined,
      undefined
    );
  });

  // Error propagation tests
  it("createSensor throws if repository fails", async () => {
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      createSensor: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(sensorController.createSensor(
      fakeSensor.macAddress,
      fakeSensor.name,
      fakeSensor.description,
      fakeSensor.variable,
      fakeSensor.unit,
      fakeGateway.gatewayMac
    )).rejects.toThrow("fail");
  });

  it("getSensorByMac throws if repository fails", async () => {
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorByMacAddress: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(sensorController.getSensorByMac(fakeSensor.macAddress)).rejects.toThrow("fail");
  });

  it("getSensorsByGatewayMac throws if repository fails", async () => {
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      getSensorsByGatewayMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(sensorController.getSensorsByGatewayMac(fakeGateway.gatewayMac)).rejects.toThrow("fail");
  });

  it("deleteSensor throws if repository fails", async () => {
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      deleteSensor: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(sensorController.deleteSensor(fakeSensor.macAddress)).rejects.toThrow("fail");
  });

  it("updateSensor throws if repository fails", async () => {
    (SensorRepository as jest.Mock).mockImplementation(() => ({
      updateSensor: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(sensorController.updateSensor(fakeSensor.macAddress, { name: "Updated" })).rejects.toThrow("fail");
  });
});