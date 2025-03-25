import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import SubmitProposal from "@/pages/submit-proposal";
import Admin from "@/pages/admin";
import ProposalDetails from "@/pages/proposal-details";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/submit-proposal" component={SubmitProposal} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/proposals/:id" component={ProposalDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
