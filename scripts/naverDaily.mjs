import { setTimeout as sleep } from "timers/promises";
import { spawn } from "child_process";

const DAY_MS = 24 * 60 * 60 * 1000;

function msUntilNextMidnight() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

function runSync() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["scripts/naverSync.mjs"], {
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`naverSync.mjs exited with code ${code}`));
    });
  });
}

async function loop() {
  while (true) {
    const waitTime = msUntilNextMidnight();
    await sleep(waitTime);

    try {
      await runSync();
    } catch (error) {
      console.error("Daily Naver sync failed:", error);
    }

    await sleep(DAY_MS);
  }
}

loop().catch((error) => {
  console.error("Daily scheduler crashed:", error);
  process.exitCode = 1;
});
