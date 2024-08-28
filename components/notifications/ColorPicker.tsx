import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => (
  <div>
    <Label htmlFor={label}>{label}</Label>
    <Input id={label} type="color" value={value} onChange={(e) => onChange(e.target.value)} />
  </div>
);

export default ColorPicker; 