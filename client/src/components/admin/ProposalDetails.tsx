import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Proposal } from "@shared/schema";
import { formatDate, formatCurrency, countWords } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Download, 
  Printer 
} from "lucide-react";
import { Link } from "wouter";

interface ProposalDetailsProps {
  proposal: Proposal;
}

export function ProposalDetails({ proposal }: ProposalDetailsProps) {
  const { toast } = useToast();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState(proposal.status);
  const [isUpdating, setIsUpdating] = useState(false);

  // Function to handle status update
  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    
    try {
      await apiRequest("PATCH", `/api/proposals/${proposal.id}/status`, { status: newStatus });
      
      toast({
        title: "Estado actualizado",
        description: `El estado de la propuesta se ha actualizado a ${newStatus === 'approved' ? 'aprobada' : newStatus === 'rejected' ? 'rechazada' : 'pendiente'}.`,
      });
      
      // Invalidate proposal query to refresh data
      queryClient.invalidateQueries({ queryKey: [`/api/proposals/${proposal.id}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      
      setStatusDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la propuesta. Por favor, inténtelo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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

  // Function to render status icon
  const renderStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500 mr-2" />;
      default:
        return <FileText className="h-5 w-5 text-amber-500 mr-2" />;
    }
  };

  // Parse JSON data from proposal
  const projectCoordinator = typeof proposal.projectCoordinator === 'object' 
    ? proposal.projectCoordinator 
    : { name: 'Unknown', email: '', phone: '', institution: '', collaborators: [] };
  
  const researchTeam = typeof proposal.researchTeam === 'object' 
    ? proposal.researchTeam 
    : { ciberehdGroups: [], ciberGroups: [], externalGroups: [] };
  
  const budget = typeof proposal.budget === 'object' 
    ? proposal.budget 
    : { items: [], totalYear1: 0, totalYear2: 0, grandTotal: 0 };
  
  const signatures = typeof proposal.signatures === 'object' 
    ? proposal.signatures 
    : { piCoordinator: '', piCiber: '', coPi: '', piCiber2: '' };

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Volver a la lista
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 font-heading">Detalles de la Propuesta</h1>
            <div className="flex items-center mt-2">
              <Badge className="mr-3">{proposal.referenceNumber}</Badge>
              {renderStatusBadge(proposal.status)}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-1" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Exportar PDF
            </Button>
            <Button size="sm" onClick={() => setStatusDialogOpen(true)}>
              Cambiar Estado
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Título</h3>
                <p className="mt-1 text-base font-medium">{proposal.title}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Acrónimo</h3>
                <p className="mt-1">{proposal.acronym}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Fecha de Envío</h3>
                <div className="mt-1 flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                  {formatDate(proposal.createdAt)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Principal Investigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 font-medium">{projectCoordinator.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                <p className="mt-1">{projectCoordinator.email}</p>
                <p>{projectCoordinator.phone}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                <p className="mt-1">{projectCoordinator.institution}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Budget Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
                <p className="mt-1 text-xl font-bold">{formatCurrency(budget.grandTotal)}</p>
                <p className="text-xs text-gray-500">
                  {budget.grandTotal > 50000 ? 
                    "Exceeds maximum allowed (€50,000)" : 
                    "Within budget limit"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">1st Year</h3>
                  <p className="mt-1">{formatCurrency(budget.totalYear1)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">2nd Year</h3>
                  <p className="mt-1">{formatCurrency(budget.totalYear2)}</p>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Budget Items</h3>
                <p className="mt-1">{budget.items.length} items</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="summary" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="team">Equipo Investigador</TabsTrigger>
          <TabsTrigger value="details">Detalles del Proyecto</TabsTrigger>
          <TabsTrigger value="budget">Presupuesto</TabsTrigger>
          <TabsTrigger value="final">Detalles Finales</TabsTrigger>
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>Project Summary</CardTitle>
              <CardDescription>
                {countWords(proposal.summary)} words
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap">{proposal.summary}</div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Research Team Tab */}
        <TabsContent value="team">
          <div className="space-y-6">
            {/* Project Coordinator */}
            <Card>
              <CardHeader>
                <CardTitle>Project Coordinator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 font-medium">{projectCoordinator.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Hired by CIBEREHD</h3>
                    <p className="mt-1">{projectCoordinator.hiredByCiberehd ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Thesis Defense Year</h3>
                    <p className="mt-1">{projectCoordinator.thesisYear || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Year of Birth</h3>
                    <p className="mt-1">{projectCoordinator.birthYear || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Annex I Extension</h3>
                    <p className="mt-1">{projectCoordinator.annexExtension ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{projectCoordinator.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="mt-1">{projectCoordinator.phone}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                    <p className="mt-1">{projectCoordinator.institution}</p>
                  </div>
                </div>

                {projectCoordinator.collaborators && projectCoordinator.collaborators.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Collaborators</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Group Code</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projectCoordinator.collaborators.map((collaborator, index) => (
                          <TableRow key={index}>
                            <TableCell>{collaborator.name}</TableCell>
                            <TableCell>{collaborator.groupCode}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* CIBEREHD Groups */}
            {researchTeam.ciberehdGroups && researchTeam.ciberehdGroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>CIBEREHD Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {researchTeam.ciberehdGroups.map((group, index) => (
                      <AccordionItem key={index} value={`ciberehd-${index}`}>
                        <AccordionTrigger>Group {index + 1}: {group.name}</AccordionTrigger>
                        <AccordionContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Name</h3>
                              <p className="mt-1">{group.name}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Hired by CIBEREHD</h3>
                              <p className="mt-1">{group.hiredByCiberehd ? "Yes" : "No"}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Email</h3>
                              <p className="mt-1">{group.email}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                              <p className="mt-1">{group.phone}</p>
                            </div>
                            <div>
                              <h3 className="text-sm font-medium text-gray-500">Institution</h3>
                              <p className="mt-1">{group.institution}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {/* CIBER Groups */}
            {researchTeam.ciberGroups && researchTeam.ciberGroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>CIBER Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Researcher Name</TableHead>
                        <TableHead>Group Code</TableHead>
                        <TableHead>Thematic Area</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {researchTeam.ciberGroups.map((group, index) => (
                        <TableRow key={index}>
                          <TableCell>{group.researcherName}</TableCell>
                          <TableCell>{group.groupCode}</TableCell>
                          <TableCell>{group.thematicArea}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* External Groups */}
            {researchTeam.externalGroups && researchTeam.externalGroups.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>External Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Researcher Name</TableHead>
                        <TableHead>Research Group</TableHead>
                        <TableHead>Institution</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {researchTeam.externalGroups.map((group, index) => (
                        <TableRow key={index}>
                          <TableCell>{group.researcherName}</TableCell>
                          <TableCell>{group.researchGroup}</TableCell>
                          <TableCell>{group.institution}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Project Details Tab */}
        <TabsContent value="details">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
                <CardDescription>Maximum 300 words</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.summary}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Word count: {countWords(proposal.summary)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Objectives</CardTitle>
                <CardDescription>Maximum 500 words</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.objectives}</div>
                <div className="text-sm text-gray-500 mt-2">
                  Word count: {countWords(proposal.objectives)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>State of the Art & Justification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.stateOfArt}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detailed Workplan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.workplan}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Novelty, Originality and Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.innovation}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Coordination and Added Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.coordination}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Details</CardTitle>
              <CardDescription>
                Total: {formatCurrency(budget.grandTotal)}
                {budget.grandTotal > 50000 && (
                  <span className="text-red-500 ml-2">
                    (Exceeds €50,000 limit)
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Group</TableHead>
                    <TableHead>1st Year</TableHead>
                    <TableHead>2nd Year</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budget.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="capitalize">{item.type}</TableCell>
                      <TableCell>{item.description}</TableCell>
                      <TableCell>{item.group}</TableCell>
                      <TableCell>{formatCurrency(item.year1Amount)}</TableCell>
                      <TableCell>{formatCurrency(item.year2Amount)}</TableCell>
                      <TableCell>{formatCurrency(item.year1Amount + item.year2Amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-medium">
                    <TableCell colSpan={3} className="text-right">Total</TableCell>
                    <TableCell>{formatCurrency(budget.totalYear1)}</TableCell>
                    <TableCell>{formatCurrency(budget.totalYear2)}</TableCell>
                    <TableCell>{formatCurrency(budget.grandTotal)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Final Details Tab */}
        <TabsContent value="final">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Future Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.futurePlan}</div>
              </CardContent>
            </Card>

            {proposal.ipr && (
              <Card>
                <CardHeader>
                  <CardTitle>Industrial and Intellectual Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap">{proposal.ipr}</div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Ethical Approval</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Will the project involve experiments requiring ethical approval?{" "}
                  <span className="font-medium">{proposal.ethicalApproval ? "Yes" : "No"}</span>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Signatures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PI Coordinator</h3>
                    <p className="mt-1">{signatures.piCoordinator}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">PI of the CIBER research group</h3>
                    <p className="mt-1">{signatures.piCiber}</p>
                  </div>
                  {signatures.coPi && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Co-PI of the collaboration</h3>
                      <p className="mt-1">{signatures.coPi}</p>
                    </div>
                  )}
                  {signatures.piCiber2 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">PI of the CIBER research group (2)</h3>
                      <p className="mt-1">{signatures.piCiber2}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appendix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap">{proposal.appendix}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Change Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Proposal Status</DialogTitle>
            <DialogDescription>
              Update the status of proposal {proposal.referenceNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center mb-4">
              <div className="w-full">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Current Status: {renderStatusBadge(proposal.status)}
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
