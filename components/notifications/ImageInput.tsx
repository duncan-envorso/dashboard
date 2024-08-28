import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ImageInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => (
  <div>
    <Label htmlFor={label}>{label}</Label>
    <Input id={label} value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default ImageInput;