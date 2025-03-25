import { Link } from "wouter";
import { Languages, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <div className="h-8 flex items-center">
                  <span className="font-heading font-bold text-xl text-primary-700">CIBER</span>
                  <span className="font-heading font-bold text-xl text-cyan-600">EHD</span>
                </div>
              </Link>
              <div className="ml-4 text-sm font-medium text-gray-500">
                Sistema de Presentación de Proyectos Intramurales
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Help</span>
                <HelpCircleIcon className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <span className="sr-only">Language</span>
                <Languages className="h-5 w-5 text-gray-500" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center">
              <img 
                src="/images/smartpeerreviewers-logo.png" 
                alt="SmartPeerReviewers Logo" 
                className="h-10"
              />
            </div>
            <div className="text-center text-sm text-gray-500">
              <p>&copy; {new Date().getFullYear()} CIBEREHD. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
