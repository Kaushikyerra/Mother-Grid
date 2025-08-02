import { 
  type User, 
  type InsertUser, 
  type Policy, 
  type InsertPolicy, 
  type Claim, 
  type InsertClaim,
  type SmartContractTransaction,
  type InsertSmartContractTransaction
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Policies
  getPolicy(id: string): Promise<Policy | undefined>;
  getPolicyByUserId(userId: string): Promise<Policy | undefined>;
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy | undefined>;
  
  // Claims
  getClaim(id: string): Promise<Claim | undefined>;
  getClaimsByUserId(userId: string): Promise<Claim[]>;
  createClaim(claim: InsertClaim): Promise<Claim>;
  updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined>;
  
  // Smart Contract Transactions
  getSmartContractTransaction(id: string): Promise<SmartContractTransaction | undefined>;
  getSmartContractTransactionsByUserId(userId: string): Promise<SmartContractTransaction[]>;
  createSmartContractTransaction(tx: InsertSmartContractTransaction): Promise<SmartContractTransaction>;
  

}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private policies: Map<string, Policy>;
  private claims: Map<string, Claim>;
  private smartContractTransactions: Map<string, SmartContractTransaction>;


  constructor() {
    this.users = new Map();
    this.policies = new Map();
    this.claims = new Map();
    this.smartContractTransactions = new Map();

    
    // Initialize with sample user and data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample user with predictable ID for dashboard access
    const userId = "user-1";
    const user: User = {
      id: userId,
      username: "sarah.johnson",
      password: "hashedpassword",
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com",
      phoneNumber: "+1234567890",
      pregnancyWeek: "24",
      dueDate: new Date("2025-04-15"),
      createdAt: new Date(),
    };
    this.users.set(userId, user);

    // Create sample policy
    const policyId = randomUUID();
    const policy: Policy = {
      id: policyId,
      userId,
      policyNumber: "MG-2024-001234",
      policyType: "Maternity Plus",
      totalCoverage: "15000.00",
      deductible: "500.00",
      usedAmount: "2450.00",
      isActive: true,
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
    };
    this.policies.set(policyId, policy);

    // Create sample claims
    const claim1Id = randomUUID();
    const claim1: Claim = {
      id: claim1Id,
      userId,
      policyId,
      claimType: "prenatal_checkup",
      title: "First Prenatal Visit",
      description: "Initial checkup and insurance verification completed",
      amount: "450.00",
      status: "approved",
      visitDate: new Date("2024-09-15"),
      providerName: "Dr. Smith, General Hospital",
      documents: [],
      smartContractTx: "0xabcd1234567890",
      createdAt: new Date("2024-09-15"),
      updatedAt: new Date("2024-09-16"),
    };
    this.claims.set(claim1Id, claim1);

    const claim2Id = randomUUID();
    const claim2: Claim = {
      id: claim2Id,
      userId,
      policyId,
      claimType: "lab_tests",
      title: "Glucose Screening Test",
      description: "Test completed, awaiting results and claim processing",
      amount: "125.00",
      status: "under_review",
      visitDate: new Date("2024-12-10"),
      providerName: "LabCorp Medical Center",
      documents: [],
      smartContractTx: "0xefgh5678901234",
      createdAt: new Date("2024-12-10"),
      updatedAt: new Date("2024-12-10"),
    };
    this.claims.set(claim2Id, claim2);

    // Create sample smart contract transactions
    const tx1Id = randomUUID();
    const tx1: SmartContractTransaction = {
      id: tx1Id,
      userId,
      claimId: claim1Id,
      transactionHash: "0xabcd1234567890",
      contractType: "coverage",
      status: "executed",
      metadata: { action: "claim_approval", amount: "450.00" },
      createdAt: new Date("2024-09-15"),
    };
    this.smartContractTransactions.set(tx1Id, tx1);

    const tx2Id = randomUUID();
    const tx2: SmartContractTransaction = {
      id: tx2Id,
      userId,
      claimId: claim2Id,
      transactionHash: "0xefgh5678901234",
      contractType: "verification",
      status: "pending",
      metadata: { action: "test_verification", amount: "125.00" },
      createdAt: new Date("2024-12-10"),
    };
    this.smartContractTransactions.set(tx2Id, tx2);


  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      phoneNumber: insertUser.phoneNumber || null,
      pregnancyWeek: insertUser.pregnancyWeek || null,
      dueDate: insertUser.dueDate || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // Policy methods
  async getPolicy(id: string): Promise<Policy | undefined> {
    return this.policies.get(id);
  }

  async getPolicyByUserId(userId: string): Promise<Policy | undefined> {
    return Array.from(this.policies.values()).find(
      (policy) => policy.userId === userId,
    );
  }

  async createPolicy(insertPolicy: InsertPolicy): Promise<Policy> {
    const id = randomUUID();
    const policy: Policy = { 
      ...insertPolicy, 
      id,
      usedAmount: insertPolicy.usedAmount || "0",
      isActive: insertPolicy.isActive ?? true,
      startDate: insertPolicy.startDate || new Date(),
      endDate: insertPolicy.endDate || null,
    };
    this.policies.set(id, policy);
    return policy;
  }

  async updatePolicy(id: string, updates: Partial<Policy>): Promise<Policy | undefined> {
    const policy = this.policies.get(id);
    if (!policy) return undefined;
    
    const updatedPolicy = { ...policy, ...updates };
    this.policies.set(id, updatedPolicy);
    return updatedPolicy;
  }

  // Claim methods
  async getClaim(id: string): Promise<Claim | undefined> {
    return this.claims.get(id);
  }

  async getClaimsByUserId(userId: string): Promise<Claim[]> {
    return Array.from(this.claims.values())
      .filter((claim) => claim.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createClaim(insertClaim: InsertClaim): Promise<Claim> {
    const id = randomUUID();
    const smartContractTx = `0x${Math.random().toString(16).substr(2, 12)}`;
    const claim: Claim = { 
      ...insertClaim, 
      id,
      status: insertClaim.status ?? "submitted", // <-- Ensure status is always a string
      description: insertClaim.description || null,
      documents: insertClaim.documents || [],
      smartContractTx,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.claims.set(id, claim);
    
    // Create associated smart contract transaction
    await this.createSmartContractTransaction({
      userId: insertClaim.userId,
      claimId: id,
      transactionHash: smartContractTx,
      contractType: "coverage",
      status: "pending",
      metadata: { action: "claim_submission", amount: insertClaim.amount },
    });
    
    return claim;
  }

  async updateClaim(id: string, updates: Partial<Claim>): Promise<Claim | undefined> {
    const claim = this.claims.get(id);
    if (!claim) return undefined;
    
    const updatedClaim = { 
      ...claim, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.claims.set(id, updatedClaim);
    return updatedClaim;
  }

  // Smart Contract Transaction methods
  async getSmartContractTransaction(id: string): Promise<SmartContractTransaction | undefined> {
    return this.smartContractTransactions.get(id);
  }

  async getSmartContractTransactionsByUserId(userId: string): Promise<SmartContractTransaction[]> {
    return Array.from(this.smartContractTransactions.values())
      .filter((tx) => tx.userId === userId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async createSmartContractTransaction(insertTx: InsertSmartContractTransaction): Promise<SmartContractTransaction> {
    const id = randomUUID();
    const tx: SmartContractTransaction = { 
      ...insertTx, 
      id,
      status: insertTx.status || "pending",
      claimId: insertTx.claimId || null,
      metadata: insertTx.metadata || {},
      createdAt: new Date(),
    };
    this.smartContractTransactions.set(id, tx);
    return tx;
  }


}

export const storage = new MemStorage();
