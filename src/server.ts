import { Db } from "mongodb";
import * as core from "express-serve-static-core";
import express from "express";
import * as gamesController from "./controllers/games.controller";
import * as nunjucks from "nunjucks";
import * as platformsController from "./controllers/platforms.controller";
import GameModel, { Game } from "./models/gameModel";
import PlatformModel, { Platform } from "./models/platformModel";
import bodyParser from "body-parser";
import * as comptesController from "./controllers/comptes.controller";
import CompteModel, { Compte } from "./models/compteModel";
import * as paniersController from "./controllers/paniers.controller";
import PanierModel, { Panier } from "./models/panierModel";

const clientWantsJson = (request: express.Request): boolean => request.get("accept") === "application/json";

const jsonParser = bodyParser.json();
const formParser = bodyParser.urlencoded({ extended: true });

export function makeApp(db: Db): core.Express {
  const app = express();

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.use("/assets", express.static("public"));
  app.set("view engine", "njk");

  const platformModel = new PlatformModel(db.collection<Platform>("platforms"));
  const gameModel = new GameModel(db.collection<Game>("games"));
  const compteModel = new CompteModel(db.collection<Compte>("comptes"));
  const panierModel = new PanierModel(db.collection<Panier>("paniers"));

  app.get("/", (_request, response) => response.render("pages/home"));
  app.get("/api", (_request, response) => response.render("pages/api"));

  app.get("/panier", (_request, response) => response.render("pages/panier"));

  app.get("/platforms", platformsController.index(platformModel));
  app.get("/platforms/new", platformsController.newPlatform());
  app.get("/platforms/:slug", platformsController.show(platformModel));
  app.get("/platforms/:slug/edit", platformsController.edit(platformModel));
  app.post("/platforms", jsonParser, formParser, platformsController.create(platformModel));
  app.put("/platforms/:slug", jsonParser, platformsController.update(platformModel));
  app.post("/platforms/:slug", formParser, platformsController.update(platformModel));
  app.delete("/platforms/:slug", jsonParser, platformsController.destroy(platformModel));

  app.get("/platforms/:slug/games", gamesController.list(gameModel));
  app.get("/games", gamesController.index(gameModel));
  app.get("/games/new", gamesController.newGame());
  app.get("/games/:slug", gamesController.show(gameModel));
  app.get("/games/:slug/edit", gamesController.edit(gameModel));
  app.post("/games", jsonParser, formParser, gamesController.create(gameModel, platformModel));
  app.put("/games/:slug", jsonParser, gamesController.update(gameModel, platformModel));
  app.post("/games/:slug", formParser, gamesController.update(gameModel, platformModel));
  app.delete("/games/:slug", jsonParser, gamesController.destroy(gameModel));

  app.get("/comptes/new", comptesController.newCompte());
  app.get("/comptes/:email", comptesController.show(compteModel));
  app.get("/comptes/:email/edit", comptesController.edit(compteModel));
  app.post("/comptes", jsonParser, formParser, comptesController.create(compteModel));
  app.put("/comptes/:email", jsonParser, comptesController.update(compteModel));
  app.post("/comptes/:email", formParser, comptesController.update(compteModel));

  app.get("/paniers/new", paniersController.newPanier());
  app.get("/paniers/:email", paniersController.show(panierModel));
  app.get("/paniers/:email/edit", paniersController.edit(panierModel));
  app.post("/paniers", jsonParser, paniersController.create(panierModel));
  app.put("/paniers/:email", jsonParser, paniersController.update(panierModel));
  //  app.post("/paniers/:email", jsonParser, paniersController.update(panierModel));
  app.delete("/paniers/:email", jsonParser, paniersController.destroy(panierModel));

  app.get("/*", (request, response) => {
    console.log(request.path);
    if (clientWantsJson(request)) {
      response.status(404).json({ error: "Not Found" });
    } else {
      response.status(404).render("pages/not-found");
    }
  });

  return app;
}
