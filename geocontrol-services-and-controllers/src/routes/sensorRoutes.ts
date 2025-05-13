import { Router } from "express";
import * as sensorController from "@controllers/sensorController";
import { authenticateUser } from "@middlewares/authMiddleware";
import { UserType } from "@models/UserType";

const router = Router({ mergeParams: true });

// Get all sensors for a gateway (Any authenticated user)
router.get("", authenticateUser(), async (req, res, next) => {
  try {
    const sensors = await sensorController.getSensorsByGatewayMac(req.params.gatewayMac);
    res.status(200).json(sensors);
  } catch (error) {
    next(error);
  }
});

// Create a new sensor (Admin & Operator)
router.post("", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    const { macAddress, name, description, variable, unit } = req.body;
    await sensorController.createSensor(
      macAddress,
      name,
      description,
      variable,
      unit,
      req.params.gatewayMac
    );
    res.status(201).json({ message: "Sensor created" });
  } catch (error) {
    next(error);
  }
});

// Get a specific sensor (Any authenticated user)
router.get("/:sensorMac", authenticateUser(), async (req, res, next) => {
  try {
    res.status(200).json(await sensorController.getSensorByMac(req.params.sensorMac));
  } catch (error) {
    next(error);
  }
});

// Update a sensor (Admin & Operator)
router.patch("/:sensorMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    const updated = await sensorController.updateSensor(req.params.sensorMac, req.body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a sensor (Admin & Operator)
router.delete("/:sensorMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await sensorController.deleteSensor(req.params.sensorMac);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
