import { Router } from "express";
import * as gatewayController from "@controllers/gatewayController";
import { GatewayFromJSON } from "@models/dto/Gateway";
import { authenticateUser } from "@middlewares/authMiddleware";
import { UserType } from "@models/UserType";

const router = Router({ mergeParams: true });

// Get all gateways (Any authenticated user)
router.get("", authenticateUser(), async (req, res, next) => {
  try {
    const gateways = await gatewayController.getGatewaysByNetworkMac(req.params.networkCode);
    res.status(200).json(gateways);
  } catch (error) {
    next(error);
  }
});

// Create a new gateway (Admin & Operator)
router.post("", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    const gateway = await gatewayController.createGateway(
      req.body.gatewayMac,
      req.body.name,
      req.params.networkCode
    );
    res.status(201).json(gateway);
  } catch (error) {
    next(error);
  }
});

// Get a specific gateway (Any authenticated user)
router.get("/:gatewayMac", authenticateUser(), async (req, res, next) => {
  try {
    res.status(200).json(await gatewayController.getGatewayByMac(req.params.gatewayMac));
  } catch (error) {
    next(error);
  }
});

// Update a gateway (Admin & Operator)
router.patch("/:gatewayMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    const updated = await gatewayController.updateGateway(
      req.params.gatewayMac,
      { name: req.body.name, networkCode: req.params.networkCode }
    );
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// Delete a gateway (Admin & Operator)
router.delete("/:gatewayMac", authenticateUser([UserType.Admin, UserType.Operator]), async (req, res, next) => {
  try {
    await gatewayController.deleteGateway(req.params.gatewayMac);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;



