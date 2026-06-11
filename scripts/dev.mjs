import { spawn } from "node:child_process";

const commands = [
  { name: "backend", command: "npm", args: ["run", "dev", "--prefix", "backend"] },
  { name: "frontend", command: "npm", args: ["run", "dev", "--prefix", "frontend"] }
];

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: "inherit",
    shell: process.platform === "win32"
  });

  child.on("exit", (code, signal) => {
    if (signal) return;
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

const shutdown = (code = 0) => {
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  process.exit(code);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
