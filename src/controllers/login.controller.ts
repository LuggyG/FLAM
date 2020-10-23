import OAuth2Client, { OAuth2ClientConstructor } from "@fwl/oauth2";
import { NextFunction, Request, Response } from "express";
import * as dotenv from "dotenv";

dotenv.config();

let redirect_path = "http://localhost:8080";

if (process.env.NODE_ENV === "production") {
  redirect_path = "https://floating-refuge-62645.herokuapp.com";
}

const oauthClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
  clientID: "QY6jqlGe_T4EiXV_I5SRsw==",
  clientSecret: process.env.CLIENT_SECRET || "",
  redirectURI: redirect_path + "/oauth/callback",
  audience: "flam",
  scopes: ["openid", "email", "phone"],
};

export const oauthClient = new OAuth2Client(oauthClientConstructorProps);

export function logout() {
  return async (request: Request, response: Response): Promise<void> => {
    if (request.session) {
      request.session.destroy(() => response.redirect("/"));
    } else {
      response.redirect("/");
    }
  };
}

export async function userIsConnected(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const decoded = await oauthClient.verifyJWT(request.session?.accessToken, "RS256");
    if (decoded) {
      response.locals.isConnected = true;
    } else {
      response.locals.isConnected = false;
    }
  } catch (error) {
    response.locals.isConnected = false;
  } finally {
    next();
  }
}
