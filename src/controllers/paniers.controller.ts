import { Request, Response } from "express";
import PanierModel from "../models/panierModel";
import slugify from "slug";

const clientWantsJson = (request: Request): boolean => request.get("accept") === "application/json";

export function newPanier() {
  return async (request: Request, response: Response): Promise<void> => {
    response.render("panier/new", { action: "/panier", callToAction: "Create" });
  };
}

export function index(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findAll();
    if (clientWantsJson(request)) {
      response.json(panier);
    } else {
      response.render("pages/panier", { panier });
    }
  };
}

export function show(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panier = await panierModel.findByMail(request.params.email);
    if (panier) {
      if (clientWantsJson(request)) {
        response.json(panier);
      } else {
        response.render("panier/show", { panier });
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
      response.render("panier/edit", { panier, action: `/panier/${panier.email}`, callToAction: "Save" });
    } else {
      response.status(404);
      response.status(404).render("pages/not-found");
    }
  };
}

export function create(panierModel: PanierModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const panierInput = { ...request.body, email: "faabino6z@live.fr", slug: slugify(request.body.name) };
    const panier = await panierModel.insertOne(panierInput);
    if (request.get("Content-Type") === "application/json") {
      response.status(201).json(panier);
    } else if (request.get("Content-Type") === "application/x-www-form-urlencoded") {
      response.redirect("/panier");
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
      } else if (request.get("Content-Type") === "application/x-www-form-urlencoded") {
        // If we're in a Form
        const { ...rest } = request.body;

        const panierInput = {
          ...rest,
          email: "faabino6z@live.fr",
          slug: slugify(request.body.name),
          platforms: {
            slug: request.body.platforms.slug,
          },
        };
        const updatedPanier = await panierModel.updateOne(panier.email, {
          ...panier,
          ...panierInput,
          _id: panier._id,
        });
        response.redirect(`/panier/${updatedPanier.email}`);
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
