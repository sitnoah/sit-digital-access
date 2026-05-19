import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const ADMIN_CLAIMS = [
  "superAdmin",
  "admin",
  "operationsManager",
  "deviceManager",
  "donationsManager",
  "supportAgent",
  "deploymentCoordinator",
  "countryManager",
  "inventoryManager",
  "analyticsManager"
] as const;

type AdminClaim = (typeof ADMIN_CLAIMS)[number];

function loadLocalEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    process.env[key] ??= value;
  }
}

function readArg(name: string): string | undefined {
  const index = process.argv.indexOf(name);
  if (index === -1) return undefined;
  return process.argv[index + 1];
}

function readRoles(): AdminClaim[] {
  const roleValue = readArg("--role") ?? readArg("--roles");

  if (!roleValue) {
    throw new Error("Missing --role. Example: --role superAdmin");
  }

  const roles = roleValue.split(",").map((role) => role.trim()).filter(Boolean);
  const invalidRole = roles.find((role) => !ADMIN_CLAIMS.includes(role as AdminClaim));

  if (invalidRole) {
    throw new Error(`Invalid role "${invalidRole}". Allowed roles: ${ADMIN_CLAIMS.join(", ")}`);
  }

  return roles as AdminClaim[];
}

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }

  return value;
}

async function main() {
  loadLocalEnv();

  const email = readArg("--email");
  const roles = readRoles();

  if (!email) {
    throw new Error("Missing --email. Example: --email admin@example.com");
  }

  const app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: requireEnv("FIREBASE_PROJECT_ID"),
        clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
        privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")
      })
    });

  const auth = getAuth(app);
  const user = await auth.getUserByEmail(email);
  const existingClaims = user.customClaims ?? {};
  const nextClaims = roles.reduce<Record<string, unknown>>(
    (claims, role) => {
      claims[role] = true;
      return claims;
    },
    { ...existingClaims }
  );

  await auth.setCustomUserClaims(user.uid, nextClaims);

  console.log(`Admin claims updated for ${email}`);
  console.log(`UID: ${user.uid}`);
  console.log(`Roles set: ${roles.join(", ")}`);
  console.log("Ask the user to sign out and sign in again so Firebase refreshes their ID token.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
