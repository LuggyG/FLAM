import OAuth2Client, { OAuth2ClientConstructor } from "@fwl/oauth2";

import * as dotenv from "dotenv";
dotenv.config();

const oauthClientConstructorProps: OAuth2ClientConstructor = {
  openIDConfigurationURL: "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
  clientID: "QY6jqlGe_T4EiXV_I5SRsw==",
  clientSecret: process.env.CLIENT_SECRET || "",
  redirectURI: "http://localhost:8080/oauth/callback",
  audience: "flam",
  scopes: ["openid", "email", "phone"],
};

export const oauthClient = new OAuth2Client(oauthClientConstructorProps);
