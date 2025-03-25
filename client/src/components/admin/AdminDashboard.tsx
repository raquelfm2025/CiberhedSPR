import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProposalList } from "./ProposalList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Proposal } from "@shared/schema";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("all");

  const { data: proposals, isLoading } = useQuery<Proposal[]>({
    queryKey: ['/api/proposals'],
  });

  // Filter proposals based on active tab
  const filteredProposals = proposals?.filter((proposal) => {
    if (activeTab === "all") return true;
    return proposal.status === activeTab;
  });

  // Count proposals by status
  const pendingCount = proposals?.filter((p) => p.status === "pending").length || 0;
  const approvedCount = proposals?.filter((p) => p.status === "approved").length || 0;
  const rejectedCount = proposals?.filter((p) => p.status === "rejected").length || 0;
  const totalCount = proposals?.length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6 font-heading">Panel de Administración</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propuestas Totales</CardTitle>
            <FileText className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : totalCount}</div>
            <p className="text-xs text-gray-500">Todas las propuestas enviadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <FilePlus className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : pendingCount}</div>
            <p className="text-xs text-gray-500">En espera de evaluación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : approvedCount}</div>
            <p className="text-xs text-gray-500">Listas para financiación</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : rejectedCount}</div>
            <p className="text-xs text-gray-500">No aprobadas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">Todas las Propuestas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="approved">Aprobadas</TabsTrigger>
            <TabsTrigger value="rejected">Rechazadas</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                  <span className="ml-2 text-gray-500">Cargando propuestas...</span>
                </div>
              </CardContent>
            </Card>
          ) : filteredProposals && filteredProposals.length > 0 ? (
            <ProposalList proposals={filteredProposals} />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center p-12">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron propuestas</h3>
                  <p className="text-gray-500">No hay propuestas que coincidan con el filtro seleccionado.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
