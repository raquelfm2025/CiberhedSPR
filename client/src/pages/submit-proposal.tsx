import MainLayout from "@/layouts/MainLayout";
import { ProjectForm } from "@/components/project-form/ProjectForm";
import { FormProvider } from "@/components/project-form/FormContext";
import { CalendarIcon } from "lucide-react";

export default function SubmitProposal() {
  return (
    <MainLayout>
      <div className="px-4 sm:px-0 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-heading">Expression of Interest</h1>
        <h2 className="text-xl text-gray-700 font-heading">INTRAMURAL PROJECTS FOR YOUNG RESEARCHERS CIBEREHD 2024</h2>
        <p className="mt-2 text-sm text-red-600 flex items-center">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Deadline: 13th May, 2024</span>
        </p>
      </div>

      <FormProvider>
        <ProjectForm />
      </FormProvider>
    </MainLayout>
  );
}
