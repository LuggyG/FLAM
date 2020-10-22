import { Request, Response } from "express";
import PanierModel from "../models/panierModel";

const clientWantsJson = (request: Request): boolean => request.get("accept") === "application/json";

export function newPanier() {
  return async (request: Request, response: Response): Promise<void> => {
    response.render("paniers/new", { action: "/paniers", callToAction: "Create" });
  };
}

export function show(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findByMail(request.params.email);
    if (panier) {
      if (clientWantsJson(request)) {
        response.json(panier);
      } else {
        response.render("paniers/show", { panier });
      }
    } else {
      response.status(404);
      if (clientWantsJson(request)) {
        response.json({ error: "This panier does not exist." });
      } else {
        response.status(404).render("pages/not-found");
      }
    }
  };
}

export function edit(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findByMail(request.params.email);
    if (panier) {
      response.render("paniers/edit", { panier, action: `/paniers/${panier.email}`, callToAction: "Save" });
    } else {
      response.status(404);
      response.status(404).render("pages/not-found");
    }
  };
}

export function create(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    if (request.get("Content-Type") === "application/json") {
      const panierInput = { ...request.body };
      const panier = await panierModel.insertOne(panierInput);
      response.status(201).json(panier);
    } else {
      response.status(400).end();
    }
  };
}

export function update(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findByMail(request.params.email);
    if (panier) {
      if (request.get("Content-Type") === "application/json") {
        console.log("if get");
        const updatedPanier = await panierModel.updateOne(panier.email, {
          ...panier,
          ...request.body,
          _id: panier._id,
        });
        response.status(201).json(updatedPanier);
      } else {
        response.status(404).end();
      }
    } else {
      response.status(404).end();
    }
  };
}

export function destroy(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findByMail(request.params.email);
    if (panier) {
      panierModel.remove(panier._id);
      response.status(204).end();
    } else {
      response.status(404).end();
    }
  };
}
