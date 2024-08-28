import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange, multiline = false }) => (
  <div>
    <Label htmlFor={label}>{label}</Label>
    {multiline ? (
      <Textarea id={label} value={value} onChange={(e) => onChange(e.target.value)} />
    ) : (
      <Input id={label} value={value} onChange={(e) => onChange(e.target.value)} />
    )}
  </div>
);

export default TextInput;