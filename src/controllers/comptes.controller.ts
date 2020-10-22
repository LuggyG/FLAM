import { Request, Response } from "express";
import CompteModel from "../models/compteModel";
//import slugify from "slug";

const clientWantsJson = (request: Request): boolean => request.get("accept") === "application/json";
// export function index(compteModel: CompteModel) {
//   return async (request: Request, response: Response): Promise<void> => {
//     const comptes = await compteModel.findAll();
//     if (clientWantsJson(request)) {
//       response.json(comptes);
//     } else {
//       response.render("comptes/index", { comptes });
//     }
//   };
// }

export function newCompte() {
  return async (request: Request, response: Response): Promise<void> => {
    response.render("comptes/new", { action: "/comptes", callToAction: "Create" });
  };
}

export function show(compteModel: CompteModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const compte = await compteModel.findByMail(request.params.email);
    if (compte) {
      if (clientWantsJson(request)) {
        response.json(compte);
      } else {
        response.render("comptes/show", { compte });
      }
    } else {
      response.status(404);
      if (clientWantsJson(request)) {
        response.json({ error: "This compte does not exist." });
      } else {
        response.status(404).render("pages/not-found");
      }
    }
  };
}

export function edit(compteModel: CompteModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const compte = await compteModel.findByMail(request.params.email);
    if (compte) {
      response.render("comptes/edit", { compte, action: `/comptes/${compte.email}`, callToAction: "Save" });
    } else {
      response.status(404);
      response.status(404).render("pages/not-found");
    }
  };
}

export function create(compteModel: CompteModel) {
  return async (request: Request, response: Response): Promise<void> => {
    if (request.get("Content-Type") === "application/json") {
      // If we're getting JSON

      const compteInput = { ...request.body };
      //      const errors = compteModel.validate(compteInput);

      //      if (errors.length > 0) {
      //        response.status(400).json({ errors });
      //      } else {
      const compte = await compteModel.insertOne(compteInput);
      response.status(201).json(compte);
      //      }
    } else if (request.get("Content-Type") === "application/x-www-form-urlencoded") {
      // If we're in a Form

      const compteInput = { ...request.body };
      //      const errors = compteModel.validate(compteInput);

      //     if (errors.length > 0) {
      //       response.status(400).json({ errors });
      //     } else {
      const compte = await compteModel.insertOne(compteInput);
      response.redirect(`/comptes/${compte.email}`);
      //     }
    } else {
      response.status(400).end();
    }
  };
}

export function update(compteModel: CompteModel) {
  return async (request: Request, response: Response): Promise<void> => {
    const compte = await compteModel.findByMail(request.params.email);
    if (compte) {
      if (request.get("Content-Type") === "application/json") {
        // If we're getting JSON
        //        const errors = compteModel.validate({ ...request.body, slug: request.params.slug });
        //        if (errors.length > 0) {
        //          response.status(400).json({ errors });
        //        } else {
        const updatedCompte = await compteModel.updateOne(compte.email, {
          ...compte,
          ...request.body,
        });
        response.status(201).json(updatedCompte);
        //        }
      } else if (request.get("Content-Type") === "application/x-www-form-urlencoded") {
        // If we're in a Form
        //        const { compte_logo_url, compte_logo_width, compte_logo_height, ...rest } = request.body;

        const compteInput = { ...request.body };
        //        const errors = compteModel.validate(compteInput);
        //        if (errors.length > 0) {
        //          response.status(400).json({ errors });
        //        } else {
        const updatedCompte = await compteModel.updateOne(compte.email, {
          ...compte,
          ...compteInput,
        });
        response.redirect(`/comptes/${updatedCompte.email}`);
        //        }
      }
    } else {
      response.status(404).end();
    }
  };
}
