import { openBrowser, closeBrowser, goto, text, click, waitFor, link, scrollDown } from "taiko";
describe("test application FLAM", () => {
  jest.setTimeout(50000);

  beforeAll(async () => {
    await openBrowser({
      args: [
        "windows-size=1280,800",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-sandbox",
        "--no-zygote",
      ],
      headless: false,
    });
  });

  afterAll(async () => {
    await closeBrowser();
  });

  test("Lancer l application", async () => {
    expect.assertions(1);

    //    const texteToFind="FLAM";
    const website = process.env.URL || "";
    console.log({ website });
    const texteToFind = "Video Game";
    await goto(website);
    await waitFor(texteToFind);
    expect(await text(texteToFind).exists()).toBeTruthy();
    await waitFor(2000);
  });

  test("Tester les Games", async () => {
    expect.assertions(4);

    await click("Games");
    await waitFor("Final Fantasy VII Remake");
    expect(await text("Final Fantasy VII Remake").exists()).toBeTruthy();
    await waitFor(2000);

    await click("Games");
    await click("Create a Game");
    await waitFor("Summary");
    expect(await text("Summary").exists()).toBe(true);
    await waitFor(2000);

    await click("Games");
    await click("Final Fantasy VII Remake");
    await waitFor("Edit");
    expect(await text("Edit").exists()).toBe(true);
    await waitFor(2000);

    await click("Games");
    await click("Final Fantasy VII Remake");
    await click("Edit");
    expect(await text("Price").exists()).toBe(true);
    await waitFor(2000);
  });

  test("Tester les Platforms", async () => {
    expect.assertions(2);

    await click("Platforms");
    await waitFor("SWITCH");
    expect(await text("SWITCH").exists()).toBeTruthy();
    //    await waitFor(2000);

    await click("Platforms");
    await click("Create a Platform");
    await waitFor("Logo");
    expect(await text("Logo").exists()).toBe(true);
    //    await waitFor(2000);

    // await click(link("Platforms"));
    // await waitFor("Xbox 360");
    // await scrollDown("View Games");
    // await waitFor("Halo 3: Limited Edition");
    // await click(link("View Games"));
    // expect(await text("Halo 3: Limited Edition").exists()).toBe(true);
    // await waitFor(2000);
  });
});
