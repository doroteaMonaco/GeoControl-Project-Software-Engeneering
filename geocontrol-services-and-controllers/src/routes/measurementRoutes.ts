import { CONFIG } from "@config";
import { Router } from "express";
import * as measurementController from "@controllers/measurementController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { UserType } from "@models/UserType";

const router = Router();

// Store a measurement for a sensor (Admin & Operator)
router.post(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser([UserType.Admin, UserType.Operator]),
  async (req, res, next) => {
    try {
      const { value, createdAt } = req.body;
      await measurementController.recordMeasurement(
        req.params.sensorMac,
        value,
        createdAt ? new Date(createdAt) : new Date()
      );
      res.status(201).json({ message: "Measurement recorded" });
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve measurements for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/measurements",
  authenticateUser(),
  async (req, res, next) => {
    try {
      const measurements = await measurementController.getMeasurementsBySensor(req.params.sensorMac);
      res.status(200).json(measurements);
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve statistics (with outliers) for a specific sensor
router.get(
  CONFIG.ROUTES.V1_SENSORS + "/:sensorMac/stats",
  authenticateUser(),
  async (req, res, next) => {
    try {
      const measurements = await measurementController.getMeasurementsBySensor(req.params.sensorMac);
      const values = measurements.map((m: any) => m.value);
      const stats = await measurementController.getStatistics(values);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve measurements for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/measurements",
  authenticateUser(),
  async (req, res, next) => {
    try {
      const measurements = await measurementController.getMeasurementsByNetwork(req.params.networkCode);
      res.status(200).json(measurements);
    } catch (error) {
      next(error);
    }
  }
);

// Retrieve statistics (with outliers) for a set of sensors of a specific network
router.get(
  CONFIG.ROUTES.V1_NETWORKS + "/:networkCode/stats",
  authenticateUser(),
  async (req, res, next) => {
    try {
      const stats = await measurementController.getStatisticsByNetwork(req.params.networkCode);
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
