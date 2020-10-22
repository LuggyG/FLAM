import initDb from "../utils/initDatabase";
import transformData from "../utils/transformData";

import comptes from "../data/comptes";
import promos from "../data/promos";

initDb().then(async (client) => {
  const db = client.db();

  const [gamesWithPtfs, platformsWithGames] = transformData();

  await db.collection("games").insertMany(gamesWithPtfs);
  await db.collection("platforms").insertMany(platformsWithGames);
  await db.collection("comptes").insertMany(comptes);
  await db.collection("promos").insertMany(promos);
});
