"use client";

import { useState, useEffect } from "react";
import { BirthdayManager } from "../../components/features/clients/BirthdayManager";
import { Client } from "../../types";
import { supabase } from "../../lib/supabase/config";

// Simple spinner component
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default function BirthdaysPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentMonth = new Date().getMonth();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(currentMonth);

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch clients from Supabase
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("last_name", { ascending: true });

        if (error) throw error;

        setClients(data || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Error al cargar los datos de clientes");
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Handle month change from BirthdayManager
  const handleBirthdayManagerMonthChange = (monthIndex: number) => {
    setSelectedMonthIndex(monthIndex);
  };

  // Go to previous month
  
  // Calculate birthday statistics


  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="relative">
        {/* Gradient background effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50 to-white h-72 w-full -z-10" />
        <div className="absolute inset-0 bg-grid-pattern opacity-5 h-72 w-full -z-5" />

        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col space-y-8 pb-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Cumpleaños de Clientes
              </h1>
              <p className="text-gray-600 max-w-3xl">
                Gestiona y haz seguimiento de los cumpleaños de tus clientes.
                Recibe notificaciones cuando se acerquen fechas importantes.
              </p>
            </div>


          </div>

          {/* Content */}
          <div className="pb-12">
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center">
                  <Spinner className="h-12 w-12 text-emerald-500 mx-auto animate-spin" />
                  <p className="mt-4 text-gray-600">
                    Cargando datos de clientes...
                  </p>
                </div>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-96">
                <div className="text-center max-w-md">
                  <div className="rounded-full bg-red-50 p-4 w-16 h-16 mx-auto mb-4">
                    <svg
                      className="h-8 w-8 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Error al cargar datos
                  </h3>
                  <p className="text-gray-600">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Reintentar
                  </button>
                </div>
              </div>
            ) : (
              <BirthdayManager
                clients={clients}
                initialMonth={selectedMonthIndex}
                onMonthChange={handleBirthdayManagerMonthChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
