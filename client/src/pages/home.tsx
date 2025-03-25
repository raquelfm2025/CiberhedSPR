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
            Proyectos Intramurales CIBEREHD
          </h1>
          <p className="mt-4 text-lg leading-6 text-gray-600">
            Sistema de presentación de propuestas de proyectos intramurales para jóvenes investigadores CIBEREHD 2024
          </p>
          <div className="mt-6 flex justify-center">
            <Link href="/submit-proposal">
              <Button size="lg" className="font-medium">
                <FilePlus className="mr-2 h-5 w-5" />
                Presentar una Propuesta
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex items-center mb-6">
          <Clock className="h-5 w-5 text-red-600 mr-2" />
          <p className="text-sm text-red-600">
            <span className="font-medium">Fecha límite:</span> 13 de mayo, 2024
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-primary-600" />
                Fechas Importantes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Apertura de la Convocatoria</span>
                  <span className="text-sm font-medium">1 de abril, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Fecha Límite de Envío</span>
                  <span className="text-sm font-medium">13 de mayo, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Período de Evaluación</span>
                  <span className="text-sm font-medium">14 de mayo - 15 de junio, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Anuncio de Resultados</span>
                  <span className="text-sm font-medium">30 de junio, 2024</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-sm text-gray-600">Inicio del Proyecto</span>
                  <span className="text-sm font-medium">1 de septiembre, 2024</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSearch className="h-5 w-5 mr-2 text-primary-600" />
                Requisitos de Elegibilidad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 list-disc pl-5">
                <li className="text-sm text-gray-600">
                  Jóvenes investigadores (nacidos después de 1984)
                </li>
                <li className="text-sm text-gray-600">
                  Doctorado obtenido en los últimos 10 años
                </li>
                <li className="text-sm text-gray-600">
                  Perteneciente a un grupo CIBEREHD como investigador principal
                </li>
                <li className="text-sm text-gray-600">
                  Proyecto innovador relacionado con enfermedades hepáticas y digestivas
                </li>
                <li className="text-sm text-gray-600">
                  Duración: 2 años
                </li>
                <li className="text-sm text-gray-600">
                  Presupuesto: Máximo 50.000€
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FilePlus className="h-5 w-5 mr-2 text-primary-600" />
                Cómo Solicitar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 list-decimal pl-5">
                <li className="text-sm text-gray-600">
                  Complete todas las secciones del formulario en línea
                </li>
                <li className="text-sm text-gray-600">
                  Adjunte toda la documentación de apoyo
                </li>
                <li className="text-sm text-gray-600">
                  Asegúrese de que su presupuesto no exceda los 50.000€
                </li>
                <li className="text-sm text-gray-600">
                  Incluya todas las firmas requeridas
                </li>
                <li className="text-sm text-gray-600">
                  Envíe antes de la fecha límite (13 de mayo, 2024)
                </li>
              </ol>
            </CardContent>
            <CardFooter>
              <Link href="/submit-proposal" className="w-full">
                <Button className="w-full">Solicitar Ahora</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-heading">¿Necesita Ayuda?</h2>
          <p className="text-gray-600 mb-6">
            Si tiene alguna pregunta o necesita ayuda con su solicitud, por favor contáctenos en:
          </p>
          <p className="text-primary-600 font-medium">ciberehd@ciberehd.org</p>
        </div>
      </div>
    </MainLayout>
  );
}
