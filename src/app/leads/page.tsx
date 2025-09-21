'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Download, Search, Eye } from 'lucide-react';
import { getBadgeLabel, getBadgeClass } from '@/lib/decision-engine';

interface Lead {
  id: string;
  createdAt: string;
  status: 'RED' | 'YELLOW' | 'GREEN';
  sektor: string;
  omzetBracket: string;
  yearsOperating: string;
  productNeed: string;
  createdBy: {
    email: string;
  };
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    let filtered = leads;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(lead =>
        lead.sektor.toLowerCase().includes(term) ||
        lead.productNeed.toLowerCase().includes(term) ||
        lead.createdBy.email.toLowerCase().includes(term)
      );
    }

    setFilteredLeads(filtered);
  }, [leads, statusFilter, searchTerm]);

  const exportCSV = async () => {
    try {
      const response = await fetch('/api/leads/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };


  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <p>Memuat data leads...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Leads</h1>
          <p className="text-gray-600">Kelola dan ekspor data leads SME</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan sektor atau produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
              >
                <option value="all">Semua Status</option>
                <option value="GREEN">Siap Di-PAS</option>
                <option value="YELLOW">Perlu Konfirmasi Lanjut</option>
                <option value="RED">Tidak Lolos Screen</option>
              </select>
              
              <Button onClick={exportCSV} variant="outline" className="flex items-center justify-center gap-2 w-full sm:w-auto">
                <Download className="h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredLeads.length} dari {leads.length} leads
            </p>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada leads yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Tanggal</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Sektor</th>
                    <th className="text-left py-3 px-4">Omzet</th>
                    <th className="text-left py-3 px-4">Usia</th>
                    <th className="text-left py-3 px-4">Produk</th>
                    <th className="text-left py-3 px-4">Staff</th>
                    <th className="text-left py-3 px-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getBadgeClass(lead.status)}>
                          {getBadgeLabel(lead.status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">{lead.sektor}</td>
                      <td className="py-3 px-4 text-sm">{lead.omzetBracket}</td>
                      <td className="py-3 px-4 text-sm">{lead.yearsOperating}</td>
                      <td className="py-3 px-4 text-sm">{lead.productNeed}</td>
                      <td className="py-3 px-4 text-sm">{lead.createdBy.email}</td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.location.href = `/lead/${lead.id}`}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-3 w-3" />
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
