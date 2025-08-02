import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phoneNumber: text("phone_number"),
  pregnancyWeek: text("pregnancy_week"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const policies = pgTable("policies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  policyNumber: text("policy_number").notNull().unique(),
  policyType: text("policy_type").notNull(),
  totalCoverage: decimal("total_coverage", { precision: 10, scale: 2 }).notNull(),
  deductible: decimal("deductible", { precision: 10, scale: 2 }).notNull(),
  usedAmount: decimal("used_amount", { precision: 10, scale: 2 }).default("0"),
  isActive: boolean("is_active").default(true),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
});

export const claims = pgTable("claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  policyId: varchar("policy_id").notNull().references(() => policies.id),
  claimType: text("claim_type").notNull(), // prenatal_checkup, lab_tests, ultrasound, emergency
  title: text("title").notNull(),
  description: text("description"),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, rejected, paid
  visitDate: timestamp("visit_date").notNull(),
  providerName: text("provider_name").notNull(),
  documents: jsonb("documents").default([]),
  smartContractTx: text("smart_contract_tx"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const smartContractTransactions = pgTable("smart_contract_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  claimId: varchar("claim_id").references(() => claims.id),
  transactionHash: text("transaction_hash").notNull(),
  contractType: text("contract_type").notNull(), // coverage, verification, payment
  status: text("status").notNull().default("pending"), // pending, executed, failed
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});



export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  pregnancyWeek: true,
  dueDate: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  smartContractTx: true,
});

export const insertSmartContractTransactionSchema = createInsertSchema(smartContractTransactions).omit({
  id: true,
  createdAt: true,
});



export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;
export type InsertSmartContractTransaction = z.infer<typeof insertSmartContractTransactionSchema>;
export type SmartContractTransaction = typeof smartContractTransactions.$inferSelect;

