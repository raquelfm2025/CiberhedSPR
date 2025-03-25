import { Link } from "wouter";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, FilePlus, FileSearch, Clock } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <div className="px-4 sm:px-0">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl font-heading">
            CIBEREHD Intramural Projects
          </h1>
          <p className="mt-4 text-lg leading-6 text-gray-600">
            Submission system for intramural project proposals for young researchers CIBEREHD 2024
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/submit-proposal">
              <Button size="lg" className="font-medium">
                <FilePlus className="mr-2 h-5 w-5" />
                Submit a Proposal
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <Clock className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-sm text-red-600">
            <span className="font-medium">Deadline:</span> 13th May, 2024
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-primary-600" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Call Opening</span>
                  <span className="text-sm font-medium">April 1, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Submission Deadline</span>
                  <span className="text-sm font-medium">May 13, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Evaluation Period</span>
                  <span className="text-sm font-medium">May 14 - June 15, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Results Announcement</span>
                  <span className="text-sm font-medium">June 30, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Project Start</span>
                  <span className="text-sm font-medium">September 1, 2024</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSearch className="h-5 w-5 mr-2 text-primary-600" />
                Eligibility Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li className="text-sm text-gray-600">
                  Young researchers (born after 1984)
                </li>
                <li className="text-sm text-gray-600">
                  PhD degree obtained within the last 10 years
                </li>
                <li className="text-sm text-gray-600">
                  Belonging to a CIBEREHD group as principal investigator
                </li>
                <li className="text-sm text-gray-600">
                  Innovative project related to hepatic and digestive diseases
                </li>
                <li className="text-sm text-gray-600">
                  Duration: 2 years
                </li>
                <li className="text-sm text-gray-600">
                  Budget: Maximum €50,000
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilePlus className="h-5 w-5 mr-2 text-primary-600" />
                How to Apply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal pl-5">
                <li className="text-sm text-gray-600">
                  Complete all sections of the online form
                </li>
                <li className="text-sm text-gray-600">
                  Attach any supporting documentation
                </li>
                <li className="text-sm text-gray-600">
                  Ensure your budget does not exceed €50,000
                </li>
                <li className="text-sm text-gray-600">
                  Include all the required signatures
                </li>
                <li className="text-sm text-gray-600">
                  Submit before the deadline (May 13, 2024)
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Link href="/submit-proposal" className="w-full">
                <Button className="w-full">Apply Now</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">Need Assistance?</h2>
          <p className="text-gray-600 mb-6">
            If you have any questions or need help with your application, please contact us at:
          </p>
          <p className="text-primary-600 font-medium">ciberehd@ciberehd.org</p>
        </div>
      </div>
    </MainLayout>
  );
}
