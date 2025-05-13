
import { MeasurementDAO } from "@models/dao/MeasurementDAO";
import { MeasurementRepository } from "@repositories/MeasurementRepository";
import { calculateMean, calculateVariance, calculateThresholds, identifyOutliers } from "@services/statisticService";

export async function recordMeasurement(
  sensorMac: string,
  value: number,
  timestamp: Date
): Promise<void> {
  const measurementRepo = new MeasurementRepository();
  await measurementRepo.createMeasurement(value, timestamp, sensorMac);
}

export async function getMeasurementsBySensor(sensorMac: string): Promise<MeasurementDAO[]> {
  const measurementRepo = new MeasurementRepository();
  return await measurementRepo.getMeasurementsBySensorMac(sensorMac);
}

export async function getStatistics(values: number[]): Promise<any> {
  const mean = calculateMean(values);
  const variance = calculateVariance(values);
  const thresholds = calculateThresholds(mean, variance);
  const outliers = identifyOutliers(values, thresholds);
  return {
    mean,
    variance,
    thresholds,
    outliers,
  };
}

export async function getMeasurementsByNetwork(networkCode: string): Promise<MeasurementDAO[]> {
  const measurementRepo = new MeasurementRepository();
  return await measurementRepo.getMeasurementsByNetworkMac(networkCode);
}

export async function getStatisticsByNetwork(networkCode: string): Promise<any> {
  const measurements = await getMeasurementsByNetwork(networkCode);
  const values = measurements.map((m: MeasurementDAO) => m.value);
  return getStatistics(values);
}
