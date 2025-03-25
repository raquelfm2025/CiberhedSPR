import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProposalSchema, insertBudgetItemSchema, insertFileSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Helper function to handle validation and response
  const validateAndExecute = async <T>(
    req: Request,
    res: Response,
    schema: any,
    callback: (data: T) => Promise<any>
  ) => {
    try {
      const data = schema.parse(req.body) as T;
      const result = await callback(data);
      return res.status(200).json(result);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  // Generate a unique reference number for new proposals
  const generateReferenceNumber = async (): Promise<string> => {
    const proposals = await storage.getAllProposals();
    const year = new Date().getFullYear();
    const count = proposals.length + 1;
    return `CIBEREHD-${year}-${count.toString().padStart(4, '0')}`;
  };

  // API routes
  // Create a new proposal
  app.post("/api/proposals", async (req, res) => {
    return validateAndExecute(req, res, insertProposalSchema, async (data) => {
      // Generate reference number
      const referenceNumber = await generateReferenceNumber();
      
      // Create proposal
      const proposal = await storage.createProposal({
        ...data,
        referenceNumber,
      });
      
      return { 
        message: "Proposal created successfully", 
        proposal,
      };
    });
  });

  // Get all proposals
  app.get("/api/proposals", async (req, res) => {
    try {
      const proposals = await storage.getAllProposals();
      return res.status(200).json(proposals);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get proposal by ID
  app.get("/api/proposals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const proposal = await storage.getProposal(id);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      return res.status(200).json(proposal);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get proposal by reference number
  app.get("/api/proposals/reference/:referenceNumber", async (req, res) => {
    try {
      const referenceNumber = req.params.referenceNumber;
      
      const proposal = await storage.getProposalByReference(referenceNumber);
      if (!proposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      return res.status(200).json(proposal);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update proposal status
  app.patch("/api/proposals/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const { status } = req.body;
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedProposal = await storage.updateProposalStatus(id, status);
      if (!updatedProposal) {
        return res.status(404).json({ message: "Proposal not found" });
      }
      
      return res.status(200).json({ 
        message: "Proposal status updated successfully",
        proposal: updatedProposal
      });
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create budget item for a proposal
  app.post("/api/budget-items", async (req, res) => {
    return validateAndExecute(req, res, insertBudgetItemSchema, async (data) => {
      const budgetItem = await storage.createBudgetItem(data);
      return { 
        message: "Budget item created successfully", 
        budgetItem,
      };
    });
  });

  // Get budget items for a proposal
  app.get("/api/proposals/:id/budget-items", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const budgetItems = await storage.getBudgetItemsByProposal(id);
      return res.status(200).json(budgetItems);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create file for a proposal
  app.post("/api/files", async (req, res) => {
    return validateAndExecute(req, res, insertFileSchema, async (data) => {
      const file = await storage.createFile(data);
      return { 
        message: "File created successfully", 
        file,
      };
    });
  });

  // Get files for a proposal
  app.get("/api/proposals/:id/files", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid proposal ID" });
      }
      
      const files = await storage.getFilesByProposal(id);
      return res.status(200).json(files);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
