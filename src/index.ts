import { makeApp } from "./server";
import * as dotenv from "dotenv";
import initDb from "../utils/initDatabase";

dotenv.config();

initDb()
  .then(async (client) => {
    const app = makeApp(client);

    let redirect_path = `http://localhost:${process.env.PORT}`;

    if (process.env.NODE_ENV === "production") {
      redirect_path = `https://floating-refuge-62645.herokuapp:${process.env.PORT}`;
    }

    const finalURL = redirect_path;

    app.listen(process.env.PORT, () => {
      console.log(`listen on ${finalURL}`);
    });
  })
  .catch(console.error);
