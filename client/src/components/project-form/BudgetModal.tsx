import { useState } from 'react';
import { useFormContext } from './FormContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { budgetItemSchema, BudgetItemType } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface BudgetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'consumable' | 'service' | 'equipment' | 'travel' | 'other';
}

export function BudgetModal({ open, onOpenChange, type }: BudgetModalProps) {
  const { addBudgetItem } = useFormContext();
  const { toast } = useToast();
  
  const [description, setDescription] = useState('');
  const [group, setGroup] = useState('');
  const [year1Amount, setYear1Amount] = useState('');
  const [year2Amount, setYear2Amount] = useState('');
  
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const item: BudgetItemType = {
        type,
        description,
        group,
        year1Amount: parseFloat(year1Amount) || 0,
        year2Amount: parseFloat(year2Amount) || 0,
      };
      
      budgetItemSchema.parse(item);
      
      addBudgetItem(item);
      onOpenChange(false);
      resetForm();
      
      toast({
        title: "Budget item added",
        description: `${typeLabel} has been added to the budget.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Please fill all required fields with valid values.",
        variant: "destructive",
      });
    }
  };
  
  const resetForm = () => {
    setDescription('');
    setGroup('');
    setYear1Amount('');
    setYear2Amount('');
  };
  
  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add {typeLabel}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={`Enter ${type} description`}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="group">Group/SSGroup</Label>
            <Input
              id="group"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year1">1st Year (€)</Label>
              <Input
                id="year1"
                type="number"
                value={year1Amount}
                onChange={(e) => setYear1Amount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year2">2nd Year (€)</Label>
              <Input
                id="year2"
                type="number"
                value={year2Amount}
                onChange={(e) => setYear2Amount(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Add Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
