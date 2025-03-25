import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/layouts/AdminLayout";
import { ProposalDetails } from "@/components/admin/ProposalDetails";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProposalDetailsPage() {
  const { id } = useParams();
  const proposalId = parseInt(id);

  const { data: proposal, isLoading, error } = useQuery({
    queryKey: [`/api/proposals/${proposalId}`],
    enabled: !isNaN(proposalId),
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !proposal) {
    return (
      <AdminLayout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load proposal details. Please try again later.
          </AlertDescription>
        </Alert>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ProposalDetails proposal={proposal} />
    </AdminLayout>
  );
}
