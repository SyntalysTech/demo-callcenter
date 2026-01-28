'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { updateLead } from '@/lib/localStorage';
import { STATUS_CONFIG, type LeadStatus } from '@/lib/types';

interface Props {
  leadId: string;
  currentStatus: LeadStatus;
  onUpdate?: () => void;
}

export function StatusSelect({ leadId, currentStatus, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (newStatus: LeadStatus) => {
    setStatus(newStatus);
    updateLead(leadId, { status: newStatus });
    setIsOpen(false);
    onUpdate?.();
  };

  const config = STATUS_CONFIG[status];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}
      >
        {config.shortLabel}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1">
          {(Object.keys(STATUS_CONFIG) as LeadStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => handleChange(s)}
              className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 ${
                s === status ? 'bg-gray-50' : ''
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${STATUS_CONFIG[s].bgColor}`} />
              <span className="text-gray-700">{STATUS_CONFIG[s].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
