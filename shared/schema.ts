import { pgTable, text, serial, integer, boolean, json, timestamp, primaryKey, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Proposal table definition
export const proposals = pgTable("proposals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  acronym: text("acronym").notNull(),
  summary: text("summary").notNull(),
  objectives: text("objectives").notNull(),
  stateOfArt: text("state_of_art").notNull(),
  workplan: text("workplan").notNull(),
  innovation: text("innovation").notNull(),
  coordination: text("coordination").notNull(),
  futurePlan: text("future_plan").notNull(),
  ipr: text("ipr"),
  ethicalApproval: boolean("ethical_approval").notNull(),
  appendix: text("appendix").notNull(),
  status: text("status").notNull().default("pending"),
  referenceNumber: text("reference_number").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  projectCoordinator: json("project_coordinator").notNull(),
  researchTeam: json("research_team").notNull(),
  budget: json("budget").notNull(),
  signatures: json("signatures").notNull(),
});

export const budgetItems = pgTable("budget_items", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull().references(() => proposals.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  description: text("description").notNull(),
  group: text("group").notNull(),
  year1Amount: real("year1_amount").notNull(),
  year2Amount: real("year2_amount").notNull(),
});

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  proposalId: integer("proposal_id").notNull().references(() => proposals.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  filename: text("filename").notNull(),
  mimetype: text("mimetype").notNull(),
  size: integer("size").notNull(),
  content: text("content").notNull(),
});

// Project Coordinator schema
export const projectCoordinatorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hiredByCiberehd: z.boolean().nullable(),
  thesisYear: z.number().min(1900).max(new Date().getFullYear()).nullable(),
  birthYear: z.number().min(1900).max(new Date().getFullYear()).nullable(),
  annexExtension: z.boolean().nullable(),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  institution: z.string().min(1, "Institution is required"),
  collaborators: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      groupCode: z.string().min(1, "Group code is required"),
    })
  ).optional().default([]),
});

// Other CIBEREHD Groups schema
export const ciberehdGroupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hiredByCiberehd: z.boolean().nullable(),
  thesisYear: z.number().min(1900).max(new Date().getFullYear()).nullable(),
  birthYear: z.number().min(1900).max(new Date().getFullYear()).nullable(),
  annexExtension: z.boolean().nullable(),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  institution: z.string().min(1, "Institution is required"),
  collaborators: z.array(
    z.object({
      name: z.string().min(1, "Name is required"),
      groupCode: z.string().min(1, "Group code is required"),
    })
  ).optional().default([]),
});

// Other CIBER Groups schema
export const ciberGroupSchema = z.object({
  researcherName: z.string().min(1, "Researcher name is required"),
  groupCode: z.string().min(1, "Group code is required"),
  thematicArea: z.string().min(1, "Thematic area is required"),
});

// External Groups schema
export const externalGroupSchema = z.object({
  researcherName: z.string().min(1, "Researcher name is required"),
  researchGroup: z.string().min(1, "Research group is required"),
  institution: z.string().min(1, "Institution is required"),
});

// Research Team schema
export const researchTeamSchema = z.object({
  ciberehdGroups: z.array(ciberehdGroupSchema).optional().default([]),
  ciberGroups: z.array(ciberGroupSchema).optional().default([]),
  externalGroups: z.array(externalGroupSchema).optional().default([]),
});

// Budget Item schema
export const budgetItemSchema = z.object({
  type: z.enum(["consumable", "service", "equipment", "travel", "other"]),
  description: z.string().min(1, "Description is required"),
  group: z.string().min(1, "Group is required"),
  year1Amount: z.number().min(0, "Amount must be positive"),
  year2Amount: z.number().min(0, "Amount must be positive"),
});

// Budget schema
export const budgetSchema = z.object({
  items: z.array(budgetItemSchema).optional().default([]),
  totalYear1: z.number().min(0),
  totalYear2: z.number().min(0),
  grandTotal: z.number().min(0).max(50000, "Total budget cannot exceed €50,000"),
});

// Signature schema
export const signatureSchema = z.object({
  piCoordinator: z.string().min(1, "PI Coordinator signature is required"),
  piCiber: z.string().min(1, "PI of CIBER research group signature is required"),
  coPi: z.string().optional(),
  piCiber2: z.string().optional(),
});

// File schema
export const fileSchema = z.object({
  type: z.enum(["annexDocumentation", "workplanGantt"]),
  filename: z.string().min(1),
  mimetype: z.string().min(1),
  size: z.number().min(1),
  content: z.string().min(1),
});

// Full proposal schema
export const proposalSchema = z.object({
  title: z.string().min(1, "Project title is required"),
  acronym: z.string().min(1, "Project acronym is required"),
  summary: z.string().min(1, "Summary is required").max(1800, "Summary cannot exceed 300 words"),
  objectives: z.string().min(1, "Objectives are required").max(3000, "Objectives cannot exceed 500 words"),
  stateOfArt: z.string().min(1, "State of the art is required"),
  workplan: z.string().min(1, "Workplan is required"),
  innovation: z.string().min(1, "Innovation description is required"),
  coordination: z.string().min(1, "Coordination description is required"),
  futurePlan: z.string().min(1, "Future plan is required"),
  ipr: z.string().optional(),
  ethicalApproval: z.boolean(),
  appendix: z.string().min(1, "Appendix is required"),
  projectCoordinator: projectCoordinatorSchema,
  researchTeam: researchTeamSchema,
  budget: budgetSchema,
  signatures: signatureSchema,
  files: z.array(fileSchema).optional().default([]),
});

// Insert schemas
export const insertProposalSchema = createInsertSchema(proposals).omit({ id: true, createdAt: true });
export const insertBudgetItemSchema = createInsertSchema(budgetItems).omit({ id: true });
export const insertFileSchema = createInsertSchema(files).omit({ id: true });

// Export types
export type Proposal = typeof proposals.$inferSelect;
export type InsertProposal = z.infer<typeof insertProposalSchema>;
export type BudgetItem = typeof budgetItems.$inferSelect;
export type InsertBudgetItem = z.infer<typeof insertBudgetItemSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

// Export section specific types
export type ProjectCoordinator = z.infer<typeof projectCoordinatorSchema>;
export type CiberehdGroup = z.infer<typeof ciberehdGroupSchema>;
export type CiberGroup = z.infer<typeof ciberGroupSchema>;
export type ExternalGroup = z.infer<typeof externalGroupSchema>;
export type ResearchTeam = z.infer<typeof researchTeamSchema>;
export type BudgetItemType = z.infer<typeof budgetItemSchema>;
export type Budget = z.infer<typeof budgetSchema>;
export type Signature = z.infer<typeof signatureSchema>;
export type FileItem = z.infer<typeof fileSchema>;
export type FormProposal = z.infer<typeof proposalSchema>;
