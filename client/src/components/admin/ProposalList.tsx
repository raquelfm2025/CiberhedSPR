import { Link } from "wouter";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Proposal } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EyeIcon, FileTextIcon } from "lucide-react";

interface ProposalListProps {
  proposals: Proposal[];
}

export function ProposalList({ proposals }: ProposalListProps) {
  // Sort proposals by creation date (newest first)
  const sortedProposals = [...proposals].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Function to render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Pendiente</Badge>;
      case "approved":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Aprobada</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rechazada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Referencia</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Fecha de Envío</TableHead>
              <TableHead>Presupuesto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedProposals.map((proposal) => (
              <TableRow key={proposal.id}>
                <TableCell className="font-medium">{proposal.referenceNumber}</TableCell>
                <TableCell className="max-w-[200px] truncate" title={proposal.title}>
                  {proposal.title}
                </TableCell>
                <TableCell>
                  {proposal.projectCoordinator && typeof proposal.projectCoordinator === 'object' 
                    ? (proposal.projectCoordinator as any).name 
                    : 'Desconocido'}
                </TableCell>
                <TableCell>{formatDate(proposal.createdAt)}</TableCell>
                <TableCell>
                  {proposal.budget && typeof proposal.budget === 'object' 
                    ? formatCurrency((proposal.budget as any).grandTotal) 
                    : '€0,00'}
                </TableCell>
                <TableCell>{renderStatusBadge(proposal.status)}</TableCell>
                <TableCell className="text-right">
                  <Link href={`/admin/proposals/${proposal.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">Ver detalles</span>
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
