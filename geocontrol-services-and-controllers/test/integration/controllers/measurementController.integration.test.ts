import * as measurementController from "@controllers/measurementController";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { MeasurementDAO } from "@dao/MeasurementDAO";
import "jest";

jest.mock("../../../src/repositories/MeasurementRepository");
jest.mock("@services/statisticService", () => ({
  calculateMean: jest.fn(),
  calculateVariance: jest.fn(),
  calculateThresholds: jest.fn(),
  identifyOutliers: jest.fn(),
}));

const fakeMeasurement: MeasurementDAO = {
  id: 1,
  value: 42,
  createdAt: new Date(),
  sensor: { macAddress: "AA:BB:CC:DD:EE:FF" } as any,
};

describe("measurementController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("recordMeasurement calls repository with correct params", async () => {
    const createMeasurementMock = jest.fn().mockResolvedValue(undefined);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      createMeasurement: createMeasurementMock
    }));

    await measurementController.recordMeasurement(
      fakeMeasurement.sensor.macAddress,
      fakeMeasurement.value,
      fakeMeasurement.createdAt
    );
    expect(createMeasurementMock).toHaveBeenCalledWith(
      fakeMeasurement.value,
      fakeMeasurement.createdAt,
      fakeMeasurement.sensor.macAddress
    );
  });

  it("getMeasurementsBySensor returns measurements", async () => {
    const getMeasurementsBySensorMacMock = jest.fn().mockResolvedValue([fakeMeasurement]);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorMac: getMeasurementsBySensorMacMock
    }));

    const result = await measurementController.getMeasurementsBySensor(fakeMeasurement.sensor.macAddress);
    expect(result).toEqual([fakeMeasurement]);
    expect(getMeasurementsBySensorMacMock).toHaveBeenCalledWith(fakeMeasurement.sensor.macAddress);
  });

  it("getMeasurementsByNetwork returns measurements", async () => {
    const getMeasurementsByNetworkMacMock = jest.fn().mockResolvedValue([fakeMeasurement]);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsByNetworkMac: getMeasurementsByNetworkMacMock
    }));

    const result = await measurementController.getMeasurementsByNetwork("networkCode");
    expect(result).toEqual([fakeMeasurement]);
    expect(getMeasurementsByNetworkMacMock).toHaveBeenCalledWith("networkCode");
  });

  it("recordMeasurement throws if repository fails", async () => {
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      createMeasurement: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(measurementController.recordMeasurement(
      fakeMeasurement.sensor.macAddress,
      fakeMeasurement.value,
      fakeMeasurement.createdAt
    )).rejects.toThrow("fail");
  });

  it("getMeasurementsBySensor throws if repository fails", async () => {
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsBySensorMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(measurementController.getMeasurementsBySensor(fakeMeasurement.sensor.macAddress)).rejects.toThrow("fail");
  });

  it("getMeasurementsByNetwork throws if repository fails", async () => {
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsByNetworkMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(measurementController.getMeasurementsByNetwork("networkCode")).rejects.toThrow("fail");
  });

  it("getStatistics returns correct structure and calls services", async () => {
    const { calculateMean, calculateVariance, calculateThresholds, identifyOutliers } = require("@services/statisticService");
    calculateMean.mockReturnValue(10);
    calculateVariance.mockReturnValue(4);
    calculateThresholds.mockReturnValue({ min: 5, max: 15 });
    identifyOutliers.mockReturnValue([12]);

    const result = await measurementController.getStatistics([1, 2, 3]);
    expect(result).toEqual({
      mean: 10,
      variance: 4,
      thresholds: { min: 5, max: 15 },
      outliers: [12],
    });
    expect(calculateMean).toHaveBeenCalledWith([1, 2, 3]);
    expect(calculateVariance).toHaveBeenCalledWith([1, 2, 3]);
    expect(calculateThresholds).toHaveBeenCalledWith(10, 4);
    expect(identifyOutliers).toHaveBeenCalledWith([1, 2, 3], { min: 5, max: 15 });
  });

  it("getStatisticsByNetwork returns statistics for network", async () => {
    const getMeasurementsByNetworkMacMock = jest.fn().mockResolvedValue([
      { ...fakeMeasurement, value: 1 },
      { ...fakeMeasurement, value: 2 },
      { ...fakeMeasurement, value: 3 }
    ]);
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsByNetworkMac: getMeasurementsByNetworkMacMock
    }));

    const { calculateMean, calculateVariance, calculateThresholds, identifyOutliers } = require("@services/statisticService");
    calculateMean.mockReturnValue(2);
    calculateVariance.mockReturnValue(1);
    calculateThresholds.mockReturnValue({ min: 0, max: 4 });
    identifyOutliers.mockReturnValue([3]);

    const result = await measurementController.getStatisticsByNetwork("networkCode");
    expect(result).toEqual({
      mean: 2,
      variance: 1,
      thresholds: { min: 0, max: 4 },
      outliers: [3],
    });
    expect(getMeasurementsByNetworkMacMock).toHaveBeenCalledWith("networkCode");
    expect(calculateMean).toHaveBeenCalledWith([1, 2, 3]);
    expect(calculateVariance).toHaveBeenCalledWith([1, 2, 3]);
    expect(calculateThresholds).toHaveBeenCalledWith(2, 1);
    expect(identifyOutliers).toHaveBeenCalledWith([1, 2, 3], { min: 0, max: 4 });
  });

  it("getStatisticsByNetwork throws if repository fails", async () => {
    (MeasurementRepository as jest.Mock).mockImplementation(() => ({
      getMeasurementsByNetworkMac: jest.fn().mockRejectedValue(new Error("fail"))
    }));
    await expect(measurementController.getStatisticsByNetwork("networkCode")).rejects.toThrow("fail");
  });
});