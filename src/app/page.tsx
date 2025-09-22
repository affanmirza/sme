'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, List } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">PrePAS</h1>
          <p className="text-lg text-gray-600">
            PrePAS - SME Quick Screen Application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/form')}>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-blue-100 rounded-full">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">New Lead Assessment</h2>
              <p className="text-gray-600">
                Start a new SME lead screening process
              </p>
              <Button className="w-full">
                Create New Lead
              </Button>
            </div>
          </Card>

          <Card className="p-8 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/leads')}>
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-green-100 rounded-full">
                <List className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">View Existing Leads</h2>
              <p className="text-gray-600">
                Browse and manage existing lead records
              </p>
              <Button variant="outline" className="w-full">
                View Leads
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
