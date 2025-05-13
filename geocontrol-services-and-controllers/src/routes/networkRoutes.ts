import { Router } from "express";
import * as networkController from "@controllers/networkController";
import { NetworkFromJSON } from "@dto/Network";
import { authenticateUser } from "@middlewares/authMiddleware";
import { UserType } from "@models/UserType";


const router = Router();

// Get all networks (Any authenticated user)
router.get("", async (req, res, next) => {
  try {
    const networks = await networkController.getAllNetworks();
    res.status(200).json(networks);
  } catch (error) {
    next(error);
  }
});

// Create a new network (Admin & Operator)
router.post("", async (req, res, next) => {
  try {
    const { networkCode, name, description } = req.body;
    await networkController.createNetwork(networkCode, name, description);
    res.status(201).json({ message: "Network created" });
  } catch (error) {
    next(error);
  }
});

// Get a specific network (Any authenticated user)
router.get("/:networkCode", authenticateUser(), async (req, res, next) => {
  try {
    res.status(200).json(await networkController.getNetworkByMac(req.params.networkCode));
  } catch (error) {
    next(error);
  }
});

// Update a network (Admin & Operator)
router.patch("/:networkCode", async (req, res, next) => {
  try {
    const { name } = req.body;
    const updated = await networkController.updateNetwork(req.params.networkCode, name);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a network (Admin & Operator)
router.delete("/:networkCode", async (req, res, next) => {
  try {
    await networkController.deleteNetwork(req.params.networkCode);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
