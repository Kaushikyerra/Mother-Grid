import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertClaimSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get user dashboard data
  app.get("/api/dashboard/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const policy = await storage.getPolicyByUserId(userId);
      const claims = await storage.getClaimsByUserId(userId);
      const smartContractTx = await storage.getSmartContractTransactionsByUserId(userId);

      // Calculate stats
      const activeClaims = claims.filter(c => c.status === "submitted" || c.status === "under_review").length;
      const coverageUsed = policy?.usedAmount || "0";

      res.json({
        user,
        policy,
        claims,
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

  // Get claims for a user
  app.get("/api/claims/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const claims = await storage.getClaimsByUserId(userId);
      res.json(claims);
    } catch (error) {
      console.error("Get claims error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new claim
  app.post("/api/claims", async (req, res) => {
    try {
      const validatedData = insertClaimSchema.parse(req.body);
      const claim = await storage.createClaim(validatedData);
      
      // Update policy used amount
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

  // Update claim status
  app.patch("/api/claims/:id", async (req, res) => {
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

  // Get smart contract transactions
  app.get("/api/smart-contracts/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const transactions = await storage.getSmartContractTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      console.error("Get smart contracts error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // File upload endpoint (simulated)
  app.post("/api/upload", async (req, res) => {
    try {
      // In a real implementation, this would handle file uploads to a cloud storage service
      const mockFileUrl = `https://storage.mothergrid.com/documents/${Date.now()}_document.pdf`;
      res.json({ url: mockFileUrl, message: "File uploaded successfully" });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
