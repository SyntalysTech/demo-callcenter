'use client';

import { useState, useEffect, use } from 'react';
import { getLead } from '@/lib/localStorage';
import { type Lead } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import { EditLeadForm } from './EditLeadForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditLeadPage({ params }: Props) {
  const { id } = use(params);
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = getLead(id);
    setLead(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-gray-500">Cargando lead...</div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="p-8">
        <div className="text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Lead no encontrado</p>
          <Link href="/leads" className="text-brand-primary hover:underline mt-2 inline-block">
            Volver a leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href={"/leads/" + id}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">Editar Lead</h1>
      </div>

      <div className="max-w-2xl">
        <EditLeadForm lead={lead} />
      </div>
    </div>
  );
}
