import { spawn } from "node:child_process";

const MAX_ATTEMPTS = 4;
function runBuild(attempt) {
  const env = {
    ...process.env,
    NEXT_DIST_DIR: `.next-build-${Date.now()}-${attempt}`,
  };

  const child = spawn("npx next build", {
    stdio: "inherit",
    shell: true,
    env,
  });

  child.on("exit", (code) => {
    if (code === 0) {
      process.exit(0);
      return;
    }

    if (attempt < MAX_ATTEMPTS) {
      setTimeout(() => runBuild(attempt + 1), 300);
      return;
    }

    process.exit(code ?? 1);
  });
}

runBuild(1);
