'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepProps {
  title: string;
  description?: string;
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  status?: 'GREEN' | 'YELLOW' | 'RED';
  children: React.ReactNode;
}

export function StepWrapper({ 
  title, 
  description, 
  onNext, 
  onPrev, 
  canGoNext, 
  canGoPrev, 
  status = 'GREEN',
  children 
}: StepProps) {
  const statusLabel = status === 'GREEN' ? 'OK' : status === 'YELLOW' ? 'Perlu Konfirmasi' : 'Tidak Lolos';
  const statusClass = status === 'GREEN'
    ? 'border-transparent bg-green-600 text-white hover:bg-green-700'
    : status === 'YELLOW'
    ? 'border-transparent bg-yellow-500 text-black hover:bg-yellow-600'
    : 'border-transparent bg-red-600 text-white hover:bg-red-700';
  return (
    <Card className="p-6 relative">
      <div className="absolute right-4 top-4">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusClass}`}>
          {statusLabel}
        </span>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>

      <div className="mb-6">
        {children}
      </div>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Sebelumnya
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          className="flex items-center gap-2"
        >
          Selanjutnya
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

interface RadioStepProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function RadioStep({ value, onChange, options }: RadioStepProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label htmlFor={option.value} className="text-sm font-medium">
            {option.label}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}

interface YesNoStepProps {
  value: boolean | null | undefined;
  onChange: (value: boolean) => void;
}

export function YesNoStep({ value, onChange }: YesNoStepProps) {
  return (
    <RadioGroup 
      value={value == null ? '' : value.toString()} 
      onValueChange={(val) => onChange(val === 'true')}
      className="space-y-3"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="true" id="yes" />
        <Label htmlFor="yes" className="text-sm font-medium">Ya</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="false" id="no" />
        <Label htmlFor="no" className="text-sm font-medium">Tidak</Label>
      </div>
    </RadioGroup>
  );
}

interface NumberStepProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  min?: number;
  max?: number;
}

export function NumberStep({ value, onChange, placeholder, min, max }: NumberStepProps) {
  return (
    <Input
      type="number"
      value={value || ''}
      onChange={(e) => onChange(e.target.value ? parseInt(e.target.value) : undefined)}
      placeholder={placeholder}
      min={min}
      max={max}
      className="max-w-xs"
    />
  );
}

interface TextStepProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
}

export function TextStep({ value, onChange, placeholder, maxLength }: TextStepProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
    />
  );
}
