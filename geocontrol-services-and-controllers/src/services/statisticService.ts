export function calculateMean(values: number[]): number {
  if (values.length === 0) throw new Error("Values array cannot be empty");
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateVariance(values: number[], mean?: number): number {
  const μ = mean ?? calculateMean(values);
  return values.reduce((sum, value) => sum + Math.pow(value - μ, 2), 0) / values.length;
}

export function calculateThresholds(mean: number, variance: number): { upperThreshold: number; lowerThreshold: number } {
  const stdDev = Math.sqrt(variance);
  return {
    upperThreshold: mean + 2 * stdDev,
    lowerThreshold: mean - 2 * stdDev,
  };
}

export function identifyOutliers(values: number[], thresholds: { upperThreshold: number; lowerThreshold: number }): boolean[] {
  return values.map(value => value > thresholds.upperThreshold || value < thresholds.lowerThreshold);
}