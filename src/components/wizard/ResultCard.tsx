'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, Copy, MessageCircle } from 'lucide-react';
import { getBadgeLabel, getBadgeClass } from '@/lib/decision-engine';

interface ResultCardProps {
  badge: 'RED' | 'YELLOW' | 'GREEN';
  reasons: string[];
  checklist: string[];
  onSaveLead: () => void;
  onSendToRM: () => void;
  canSendToRM: boolean;
  leadId?: string;
}

export function ResultCard({ 
  badge, 
  reasons, 
  checklist, 
  onSaveLead, 
  onSendToRM, 
  canSendToRM,
  leadId 
}: ResultCardProps) {
  const getBadgeIcon = () => {
    switch (badge) {
      case 'GREEN':
        return <CheckCircle className="h-5 w-5" />;
      case 'YELLOW':
        return <AlertTriangle className="h-5 w-5" />;
      case 'RED':
        return <XCircle className="h-5 w-5" />;
    }
  };


  const copyLink = () => {
    if (leadId) {
      const url = `${window.location.origin}/lead/${leadId}`;
      navigator.clipboard.writeText(url);
      // You could add a toast notification here
    }
  };

  const generateWhatsAppMessage = () => {
    const badgeText = getBadgeLabel(badge);
    const message = `Halo, saya ingin menyerahkan lead SME dengan status: ${badgeText}\n\nLink detail: ${window.location.origin}/lead/${leadId}`;
    return encodeURIComponent(message);
  };

  const openWhatsApp = () => {
    if (leadId) {
      const message = generateWhatsAppMessage();
      window.open(`https://wa.me/?text=${message}`, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* Result Badge */}
      <Card className="p-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          {getBadgeIcon()}
          <Badge className={`text-lg px-4 py-2 ${getBadgeClass(badge)}`}>
            {getBadgeLabel(badge)}
          </Badge>
        </div>
        
        {reasons.length > 0 && (
          <div className="text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Alasan:</h3>
            <ul className="space-y-2">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-700">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Checklist */}
      {checklist.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Checklist Dokumen/Informasi:</h3>
          <ul className="space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex gap-3">
            <Button onClick={onSaveLead} className="flex-1">
              Simpan Lead
            </Button>
            {canSendToRM && (
              <Button onClick={onSendToRM} variant="outline" className="flex-1">
                Kirim ke RM
              </Button>
            )}
          </div>

          {leadId && (
            <div className="flex gap-3">
              <Button 
                onClick={copyLink}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Link
              </Button>
              <Button 
                onClick={openWhatsApp} 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp RM
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
