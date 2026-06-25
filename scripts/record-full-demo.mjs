import { chromium } from "@playwright/test";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "artifacts", "videos");
const baseUrl = process.env.DEMO_BASE_URL ?? "http://127.0.0.1:5173";
const lang = process.env.DEMO_LANG ?? "en";

if (!["en", "zh"].includes(lang)) {
  throw new Error(`Unsupported DEMO_LANG="${lang}". Use "en" or "zh".`);
}

const segmentDir = path.join(outputDir, "segments", lang);
mkdirSync(segmentDir, { recursive: true });

const finalName =
  lang === "en"
    ? "hermes-commerce-ops-full-demo.mp4"
    : `hermes-commerce-ops-full-demo.${lang}.mp4`;
const finalPath = path.join(outputDir, finalName);

const englishCaptions = {
  introBrief: "Hermes Commerce Ops starts where most checkout demos stop: after real money arrives.",
  introFlow:
    "A live nopCommerce order paid through Alipay becomes payment proof, margin logic, fulfillment work, and an audit trail.",
  introPrecheck:
    "The agent can operate the business, but only after signed paid evidence and a profitable margin gate.",
  liveOrder: "Live demo: order 17 from ec.xingyipoxiao.cloud is paid through Alipay.",
  liveVerify:
    "Hermes reconciles notify and return callbacks, then checks that nopCommerce marked the order Paid and Complete.",
  liveMargin:
    "The business gate is simple: one yuan revenue, seventeen fen estimated cost, eighty-three percent margin.",
  liveFulfill:
    "Only after the margin gate passes does Hermes create a fulfillment packet with customer data redacted.",
  liveProof:
    "Proof is repeatable: npm run proof rebuilds payment reconciliation, margin gate, agent trace, fulfillment report, ledger, and manifest.",
  liveLedger:
    "The final output is not just a payment screenshot. It is a commerce operating trail.",
  compareScatter:
    "A payment integration alone proves that money moved, but it does not prove what the business did next.",
  compareFunnel:
    "Hermes gathers checkout, callback, store status, margin, worker, and ledger signals into one operating loop.",
  compareMesh:
    "The same paid order becomes a decision: accept if profitable, dispatch if safe, redact sensitive data, and record proof.",
  compareBrakes:
    "That is the prize story: controlled autonomous commerce, backed by a real paid order and verifier artifacts.",
};

const captions = {
  en: englishCaptions,
  zh: englishCaptions,
};

function caption(key) {
  return captions[lang][key];
}

const browser = await chromium.launch({ channel: "chrome", headless: true });

async function recordSegment({ name, url, holdAfterActionMs, action }) {
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: segmentDir,
      size: { width: 1920, height: 1080 },
    },
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await injectCaption(page);
  if (action) {
    await action(page);
  }
  await page.waitForTimeout(holdAfterActionMs);
  const video = page.video();
  await context.close();
  const rawPath = await video.path();
  const webmPath = path.join(segmentDir, `${name}.webm`);
  const mp4Path = path.join(segmentDir, `${name}.mp4`);
  if (existsSync(webmPath)) rmSync(webmPath);
  if (existsSync(mp4Path)) rmSync(mp4Path);
  await import("node:fs/promises").then(({ rename }) => rename(rawPath, webmPath));
  convertToMp4(webmPath, mp4Path);
  return mp4Path;
}

async function injectCaption(page) {
  await page.evaluate(() => {
    const caption = document.createElement("div");
    caption.id = "demo-caption";
    caption.textContent = "";
    caption.style.position = "fixed";
    caption.style.right = "34px";
    caption.style.bottom = "30px";
    caption.style.zIndex = "9999";
    caption.style.maxWidth = "780px";
    caption.style.width = "min(780px, calc(100vw - 68px))";
    caption.style.minHeight = "56px";
    caption.style.display = "flex";
    caption.style.alignItems = "center";
    caption.style.justifyContent = "center";
    caption.style.padding = "15px 24px";
    caption.style.border = "1px solid rgba(98, 198, 155, 0.36)";
    caption.style.borderRadius = "12px";
    caption.style.background = "rgba(5, 9, 8, 0.84)";
    caption.style.boxShadow = "0 24px 90px rgba(0, 0, 0, 0.48), 0 0 34px rgba(98, 198, 155, 0.18)";
    caption.style.backdropFilter = "blur(16px)";
    caption.style.color = "#fff8e9";
    caption.style.fontFamily =
      "'Microsoft YaHei', 'Noto Sans SC', Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
    caption.style.fontSize = "29px";
    caption.style.fontWeight = "780";
    caption.style.lineHeight = "1.28";
    caption.style.textAlign = "center";
    document.body.appendChild(caption);
  });
}

async function setCaption(page, text) {
  await page.evaluate((value) => {
    const caption = document.getElementById("demo-caption");
    if (caption) caption.textContent = value;
  }, text);
}

async function setPhase(page, phase) {
  await page.evaluate((value) => {
    document.body.dataset.cinemaPhase = value;
  }, phase);
}

async function pause(page, ms) {
  await page.waitForTimeout(ms);
}

async function openTab(page, label) {
  await page.getByRole("tab", { name: new RegExp(label, "i") }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
}

function convertToMp4(input, output) {
  execFileSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      input,
      "-vf",
      "fps=30,format=yuv420p",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      output,
    ],
    { stdio: "inherit" },
  );
}

const intro = await recordSegment({
  name: "01-cinematic-intro",
  url: `${baseUrl}/?scene=intro`,
  holdAfterActionMs: 2500,
  action: async (page) => {
    await setPhase(page, "brief");
    await setCaption(page, caption("introBrief"));
    await pause(page, 4200);
    await setPhase(page, "flow");
    await setCaption(page, caption("introFlow"));
    await pause(page, 5200);
    await setPhase(page, "precheck");
    await setCaption(page, caption("introPrecheck"));
  },
});

const demo = await recordSegment({
  name: "02-live-demo",
  url: `${baseUrl}/?pace=slow`,
  holdAfterActionMs: 4200,
  action: async (page) => {
    await openTab(page, "Live Order");
    await setCaption(page, caption("liveOrder"));
    await pause(page, 4200);
    await page.getByRole("button", { name: "Run agent" }).click();
    await pause(page, 1600);
    await openTab(page, "Payment Verify");
    await setCaption(page, caption("liveVerify"));
    await pause(page, 8200);
    await openTab(page, "Margin Gate");
    await setCaption(page, caption("liveMargin"));
    await pause(page, 8200);
    await openTab(page, "Fulfillment");
    await setCaption(page, caption("liveFulfill"));
    await pause(page, 7600);
    await openTab(page, "Proof Pack");
    await setCaption(page, caption("liveProof"));
    await pause(page, 7200);
    await openTab(page, "Audit Trail");
    await setCaption(page, caption("liveLedger"));
    await pause(page, 6800);
  },
});

const compare = await recordSegment({
  name: "03-workflow-compare",
  url: `${baseUrl}/?scene=compare`,
  holdAfterActionMs: 4500,
  action: async (page) => {
    await setPhase(page, "compare-scatter");
    await setCaption(page, caption("compareScatter"));
    await pause(page, 8200);
    await setPhase(page, "compare-funnel");
    await setCaption(page, caption("compareFunnel"));
    await pause(page, 9000);
    await setPhase(page, "compare-mesh");
    await setCaption(page, caption("compareMesh"));
    await pause(page, 9000);
    await setPhase(page, "compare-brakes");
    await setCaption(page, caption("compareBrakes"));
  },
});

await browser.close();

const concatList = path.join(segmentDir, "concat.txt");
await writeFile(concatList, [intro, demo, compare].map((file) => `file '${file.replaceAll("\\", "/")}'`).join("\n"));

execFileSync(
  "ffmpeg",
  ["-y", "-f", "concat", "-safe", "0", "-i", concatList, "-c", "copy", finalPath],
  { stdio: "inherit" },
);

console.log(`FULL_DEMO: ${finalPath}`);
