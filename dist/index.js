// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  policies;
  claims;
  smartContractTransactions;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.policies = /* @__PURE__ */ new Map();
    this.claims = /* @__PURE__ */ new Map();
    this.smartContractTransactions = /* @__PURE__ */ new Map();
    this.initializeSampleData();
  }
  initializeSampleData() {
    const userId = "user-1";
    const user = {
      id: userId,
      username: "sarah.johnson",
      password: "hashedpassword",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phoneNumber: "+1234567890",
      pregnancyWeek: "24",
      dueDate: /* @__PURE__ */ new Date("2025-04-15"),
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(userId, user);
    const policyId = randomUUID();
    const policy = {
      id: policyId,
      userId,
      policyNumber: "MG-2024-001234",
      policyType: "Maternity Plus",
      totalCoverage: "15000.00",
      deductible: "500.00",
      usedAmount: "2450.00",
      isActive: true,
      startDate: /* @__PURE__ */ new Date("2024-01-01"),
      endDate: /* @__PURE__ */ new Date("2025-12-31")
    };
    this.policies.set(policyId, policy);
    const claim1Id = randomUUID();
    const claim1 = {
      id: claim1Id,
      userId,
      policyId,
      claimType: "prenatal_checkup",
      title: "First Prenatal Visit",
      description: "Initial checkup and insurance verification completed",
      amount: "450.00",
      status: "approved",
      visitDate: /* @__PURE__ */ new Date("2024-09-15"),
      providerName: "Dr. Smith, General Hospital",
      documents: [],
      smartContractTx: "0xabcd1234567890",
      createdAt: /* @__PURE__ */ new Date("2024-09-15"),
      updatedAt: /* @__PURE__ */ new Date("2024-09-16")
    };
    this.claims.set(claim1Id, claim1);
    const claim2Id = randomUUID();
    const claim2 = {
      id: claim2Id,
      userId,
      policyId,
      claimType: "lab_tests",
      title: "Glucose Screening Test",
      description: "Test completed, awaiting results and claim processing",
      amount: "125.00",
      status: "under_review",
      visitDate: /* @__PURE__ */ new Date("2024-12-10"),
      providerName: "LabCorp Medical Center",
      documents: [],
      smartContractTx: "0xefgh5678901234",
      createdAt: /* @__PURE__ */ new Date("2024-12-10"),
      updatedAt: /* @__PURE__ */ new Date("2024-12-10")
    };
    this.claims.set(claim2Id, claim2);
    const tx1Id = randomUUID();
    const tx1 = {
      id: tx1Id,
      userId,
      claimId: claim1Id,
      transactionHash: "0xabcd1234567890",
      contractType: "coverage",
      status: "executed",
      metadata: { action: "claim_approval", amount: "450.00" },
      createdAt: /* @__PURE__ */ new Date("2024-09-15")
    };
    this.smartContractTransactions.set(tx1Id, tx1);
    const tx2Id = randomUUID();
    const tx2 = {
      id: tx2Id,
      userId,
      claimId: claim2Id,
      transactionHash: "0xefgh5678901234",
      contractType: "verification",
      status: "pending",
      metadata: { action: "test_verification", amount: "125.00" },
      createdAt: /* @__PURE__ */ new Date("2024-12-10")
    };
    this.smartContractTransactions.set(tx2Id, tx2);
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = {
      ...insertUser,
      id,
      phoneNumber: insertUser.phoneNumber || null,
      pregnancyWeek: insertUser.pregnancyWeek || null,
      dueDate: insertUser.dueDate || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.users.set(id, user);
    return user;
  }
  // Policy methods
  async getPolicy(id) {
    return this.policies.get(id);
  }
  async getPolicyByUserId(userId) {
    return Array.from(this.policies.values()).find(
      (policy) => policy.userId === userId
    );
  }
  async createPolicy(insertPolicy) {
    const id = randomUUID();
    const policy = {
      ...insertPolicy,
      id,
      usedAmount: insertPolicy.usedAmount || "0",
      isActive: insertPolicy.isActive ?? true,
      startDate: insertPolicy.startDate || /* @__PURE__ */ new Date(),
      endDate: insertPolicy.endDate || null
    };
    this.policies.set(id, policy);
    return policy;
  }
  async updatePolicy(id, updates) {
    const policy = this.policies.get(id);
    if (!policy) return void 0;
    const updatedPolicy = { ...policy, ...updates };
    this.policies.set(id, updatedPolicy);
    return updatedPolicy;
  }
  // Claim methods
  async getClaim(id) {
    return this.claims.get(id);
  }
  async getClaimsByUserId(userId) {
    return Array.from(this.claims.values()).filter((claim) => claim.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createClaim(insertClaim) {
    const id = randomUUID();
    const smartContractTx = `0x${Math.random().toString(16).substr(2, 12)}`;
    const claim = {
      ...insertClaim,
      id,
      status: insertClaim.status ?? "submitted",
      // <-- Ensure status is always a string
      description: insertClaim.description || null,
      documents: insertClaim.documents || [],
      smartContractTx,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.claims.set(id, claim);
    await this.createSmartContractTransaction({
      userId: insertClaim.userId,
      claimId: id,
      transactionHash: smartContractTx,
      contractType: "coverage",
      status: "pending",
      metadata: { action: "claim_submission", amount: insertClaim.amount }
    });
    return claim;
  }
  async updateClaim(id, updates) {
    const claim = this.claims.get(id);
    if (!claim) return void 0;
    const updatedClaim = {
      ...claim,
      ...updates,
      updatedAt: /* @__PURE__ */ new Date()
    };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }
  // Smart Contract Transaction methods
  async getSmartContractTransaction(id) {
    return this.smartContractTransactions.get(id);
  }
  async getSmartContractTransactionsByUserId(userId) {
    return Array.from(this.smartContractTransactions.values()).filter((tx) => tx.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  async createSmartContractTransaction(insertTx) {
    const id = randomUUID();
    const tx = {
      ...insertTx,
      id,
      status: insertTx.status || "pending",
      claimId: insertTx.claimId || null,
      metadata: insertTx.metadata || {},
      createdAt: /* @__PURE__ */ new Date()
    };
    this.smartContractTransactions.set(id, tx);
    return tx;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  pregnancyWeek: text("pregnancy_week"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow()
});
var policies = pgTable("policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  policyNumber: text("policy_number").notNull().unique(),
  policyType: text("policy_type").notNull(),
  totalCoverage: decimal("total_coverage", { precision: 10, scale: 2 }).notNull(),
  deductible: decimal("deductible", { precision: 10, scale: 2 }).notNull(),
  usedAmount: decimal("used_amount", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date")
});
var claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  policyId: varchar("policy_id").notNull().references(() => policies.id),
  claimType: text("claim_type").notNull(),
  // prenatal_checkup, lab_tests, ultrasound, emergency
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("submitted"),
  // submitted, under_review, approved, rejected, paid
  visitDate: timestamp("visit_date").notNull(),
  providerName: text("provider_name").notNull(),
  documents: jsonb("documents").default([]),
  smartContractTx: text("smart_contract_tx"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var smartContractTransactions = pgTable("smart_contract_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  claimId: varchar("claim_id").references(() => claims.id),
  transactionHash: text("transaction_hash").notNull(),
  contractType: text("contract_type").notNull(),
  // coverage, verification, payment
  status: text("status").notNull().default("pending"),
  // pending, executed, failed
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  pregnancyWeek: true,
  dueDate: true
});
var insertPolicySchema = createInsertSchema(policies).omit({
  id: true
});
var insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  smartContractTx: true
});
var insertSmartContractTransactionSchema = createInsertSchema(smartContractTransactions).omit({
  id: true,
  createdAt: true
});

// server/routes.ts
import { z } from "zod";
async function registerRoutes(app2) {
  app2.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const policy = await storage.getPolicyByUserId(userId);
      const claims2 = await storage.getClaimsByUserId(userId);
      const smartContractTx = await storage.getSmartContractTransactionsByUserId(userId);
      const activeClaims = claims2.filter((c) => c.status === "submitted" || c.status === "under_review").length;
      const coverageUsed = policy?.usedAmount || "0";
      res.json({
        user,
        policy,
        claims: claims2,
        smartContractTransactions: smartContractTx,
        stats: {
          activeClaims,
          coverageUsed
        }
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/claims/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const claims2 = await storage.getClaimsByUserId(userId);
      res.json(claims2);
    } catch (error) {
      console.error("Get claims error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/claims", async (req, res) => {
    try {
      const validatedData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(validatedData);
      const policy = await storage.getPolicy(validatedData.policyId);
      if (policy) {
        const currentUsed = parseFloat(policy.usedAmount || "0");
        const newAmount = parseFloat(validatedData.amount);
        const newUsedAmount = (currentUsed + newAmount).toFixed(2);
        await storage.updatePolicy(policy.id, { usedAmount: newUsedAmount });
      }
      res.status(201).json(claim);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      console.error("Create claim error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.patch("/api/claims/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const claim = await storage.updateClaim(id, { status });
      if (!claim) {
        return res.status(404).json({ error: "Claim not found" });
      }
      res.json(claim);
    } catch (error) {
      console.error("Update claim error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.get("/api/smart-contracts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getSmartContractTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Get smart contracts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  app2.post("/api/upload", async (req, res) => {
    try {
      const mockFileUrl = `https://storage.mothergrid.com/documents/${Date.now()}_document.pdf`;
      res.json({ url: mockFileUrl, message: "File uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen({
    port,
    host: "localhost",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
