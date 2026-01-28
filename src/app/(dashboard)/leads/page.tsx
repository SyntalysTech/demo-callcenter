'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { STATUS_CONFIG, type LeadStatus, type Lead } from '@/lib/types';
import { getLeads } from '@/lib/localStorage';
import { LeadsTable } from './LeadsTable';
import { LeadFilters } from './LeadFilters';
import { CreateLeadButton } from './CreateLeadButton';
import { ExcelButtons } from './ExcelButtons';

function LeadsContent() {
  const searchParams = useSearchParams();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [statusCounts, setStatusCounts] = useState<Record<LeadStatus, number>>({
    red: 0,
    yellow: 0,
    orange: 0,
    blue: 0,
    green: 0,
  });

  useEffect(() => {
    const allLeads = getLeads();
    setLeads(allLeads);

    // Count by status
    const counts: Record<LeadStatus, number> = {
      red: 0,
      yellow: 0,
      orange: 0,
      blue: 0,
      green: 0,
    };
    allLeads.forEach(lead => {
      if (lead.status in counts) {
        counts[lead.status as LeadStatus]++;
      }
    });
    setStatusCounts(counts);
  }, []);

  useEffect(() => {
    let result = [...leads];

    // Filter by status
    const status = searchParams.get('status');
    if (status && status in STATUS_CONFIG) {
      result = result.filter(l => l.status === status);
    }

    // Search filter
    const search = searchParams.get('search')?.toLowerCase();
    if (search) {
      result = result.filter(l =>
        l.full_name.toLowerCase().includes(search) ||
        l.email?.toLowerCase().includes(search) ||
        l.phone.toLowerCase().includes(search)
      );
    }

    // Date range filter
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    if (from) {
      result = result.filter(l => l.contact_date >= from);
    }
    if (to) {
      result = result.filter(l => l.contact_date <= to);
    }

    // Sorting
    const sort = searchParams.get('sort');
    switch (sort) {
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'name_asc':
        result.sort((a, b) => a.full_name.localeCompare(b.full_name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.full_name.localeCompare(a.full_name));
        break;
      case 'contact_date':
        result.sort((a, b) => new Date(b.contact_date).getTime() - new Date(a.contact_date).getTime());
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredLeads(result);
  }, [leads, searchParams]);

  const refreshLeads = () => {
    const allLeads = getLeads();
    setLeads(allLeads);

    // Recalculate counts
    const counts: Record<LeadStatus, number> = {
      red: 0,
      yellow: 0,
      orange: 0,
      blue: 0,
      green: 0,
    };
    allLeads.forEach(lead => {
      if (lead.status in counts) {
        counts[lead.status as LeadStatus]++;
      }
    });
    setStatusCounts(counts);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
        <div className="flex items-center gap-3">
          <ExcelButtons leads={filteredLeads} onUpdate={refreshLeads} />
          <CreateLeadButton onCreated={refreshLeads} />
        </div>
      </div>

      <LeadFilters statusCounts={statusCounts} />

      <LeadsTable leads={filteredLeads} onUpdate={refreshLeads} />
    </div>
  );
}

export default function LeadsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Cargando leads...</div>}>
      <LeadsContent />
    </Suspense>
  );
}
