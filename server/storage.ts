import { proposals, budgetItems, files, type Proposal, type InsertProposal, type BudgetItem, type InsertBudgetItem, type File, type InsertFile } from "@shared/schema";

// Storage interface
export interface IStorage {
  // Proposal methods
  createProposal(proposal: InsertProposal): Promise<Proposal>;
  getProposal(id: number): Promise<Proposal | undefined>;
  getProposalByReference(referenceNumber: string): Promise<Proposal | undefined>;
  getAllProposals(): Promise<Proposal[]>;
  updateProposalStatus(id: number, status: string): Promise<Proposal | undefined>;
  
  // Budget methods
  createBudgetItem(budgetItem: InsertBudgetItem): Promise<BudgetItem>;
  getBudgetItemsByProposal(proposalId: number): Promise<BudgetItem[]>;
  
  // File methods
  createFile(file: InsertFile): Promise<File>;
  getFilesByProposal(proposalId: number): Promise<File[]>;
}

export class MemStorage implements IStorage {
  private proposals: Map<number, Proposal>;
  private budgetItems: Map<number, BudgetItem>;
  private files: Map<number, File>;
  private proposalIdCounter: number;
  private budgetItemIdCounter: number;
  private fileIdCounter: number;

  constructor() {
    this.proposals = new Map();
    this.budgetItems = new Map();
    this.files = new Map();
    this.proposalIdCounter = 1;
    this.budgetItemIdCounter = 1;
    this.fileIdCounter = 1;
  }

  // Proposal methods
  async createProposal(insertProposal: InsertProposal): Promise<Proposal> {
    const id = this.proposalIdCounter++;
    const createdAt = new Date();
    
    const proposal: Proposal = {
      ...insertProposal,
      id,
      createdAt,
    };
    
    this.proposals.set(id, proposal);
    return proposal;
  }

  async getProposal(id: number): Promise<Proposal | undefined> {
    return this.proposals.get(id);
  }

  async getProposalByReference(referenceNumber: string): Promise<Proposal | undefined> {
    for (const proposal of this.proposals.values()) {
      if (proposal.referenceNumber === referenceNumber) {
        return proposal;
      }
    }
    return undefined;
  }

  async getAllProposals(): Promise<Proposal[]> {
    return Array.from(this.proposals.values());
  }

  async updateProposalStatus(id: number, status: string): Promise<Proposal | undefined> {
    const proposal = this.proposals.get(id);
    if (!proposal) {
      return undefined;
    }
    
    const updatedProposal: Proposal = {
      ...proposal,
      status,
    };
    
    this.proposals.set(id, updatedProposal);
    return updatedProposal;
  }

  // Budget methods
  async createBudgetItem(insertBudgetItem: InsertBudgetItem): Promise<BudgetItem> {
    const id = this.budgetItemIdCounter++;
    
    const budgetItem: BudgetItem = {
      ...insertBudgetItem,
      id,
    };
    
    this.budgetItems.set(id, budgetItem);
    return budgetItem;
  }

  async getBudgetItemsByProposal(proposalId: number): Promise<BudgetItem[]> {
    const items: BudgetItem[] = [];
    
    for (const item of this.budgetItems.values()) {
      if (item.proposalId === proposalId) {
        items.push(item);
      }
    }
    
    return items;
  }

  // File methods
  async createFile(insertFile: InsertFile): Promise<File> {
    const id = this.fileIdCounter++;
    
    const file: File = {
      ...insertFile,
      id,
    };
    
    this.files.set(id, file);
    return file;
  }

  async getFilesByProposal(proposalId: number): Promise<File[]> {
    const fileItems: File[] = [];
    
    for (const file of this.files.values()) {
      if (file.proposalId === proposalId) {
        fileItems.push(file);
      }
    }
    
    return fileItems;
  }
}

export const storage = new MemStorage();
