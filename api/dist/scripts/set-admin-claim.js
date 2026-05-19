"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const app_1 = require("firebase-admin/app");
const auth_1 = require("firebase-admin/auth");
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
];
function loadLocalEnv() {
    const envPath = (0, node_path_1.resolve)(process.cwd(), ".env");
    if (!(0, node_fs_1.existsSync)(envPath))
        return;
    for (const line of (0, node_fs_1.readFileSync)(envPath, "utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#"))
            continue;
        const equalsIndex = trimmed.indexOf("=");
        if (equalsIndex === -1)
            continue;
        const key = trimmed.slice(0, equalsIndex).trim();
        let value = trimmed.slice(equalsIndex + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        process.env[key] ??= value;
    }
}
function readArg(name) {
    const index = process.argv.indexOf(name);
    if (index === -1)
        return undefined;
    return process.argv[index + 1];
}
function readRoles() {
    const roleValue = readArg("--role") ?? readArg("--roles");
    if (!roleValue) {
        throw new Error("Missing --role. Example: --role superAdmin");
    }
    const roles = roleValue.split(",").map((role) => role.trim()).filter(Boolean);
    const invalidRole = roles.find((role) => !ADMIN_CLAIMS.includes(role));
    if (invalidRole) {
        throw new Error(`Invalid role "${invalidRole}". Allowed roles: ${ADMIN_CLAIMS.join(", ")}`);
    }
    return roles;
}
function requireEnv(name) {
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
    const app = (0, app_1.getApps)()[0] ??
        (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId: requireEnv("FIREBASE_PROJECT_ID"),
                clientEmail: requireEnv("FIREBASE_CLIENT_EMAIL"),
                privateKey: requireEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n")
            })
        });
    const auth = (0, auth_1.getAuth)(app);
    const user = await auth.getUserByEmail(email);
    const existingClaims = user.customClaims ?? {};
    const nextClaims = roles.reduce((claims, role) => {
        claims[role] = true;
        return claims;
    }, { ...existingClaims });
    await auth.setCustomUserClaims(user.uid, nextClaims);
    console.log(`Admin claims updated for ${email}`);
    console.log(`UID: ${user.uid}`);
    console.log(`Roles set: ${roles.join(", ")}`);
    console.log("Ask the user to sign out and sign in again so Firebase refreshes their ID token.");
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
//# sourceMappingURL=set-admin-claim.js.map