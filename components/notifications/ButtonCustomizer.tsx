import React from 'react';
import TextInput from './TextInput';
import ColorPicker from './ColorPicker';

interface ButtonCustomizerProps {
  text: string;
  background: string;
  textColor: string;
  onTextChange: (value: string) => void;
  onBackgroundChange: (value: string) => void;
  onTextColorChange: (value: string) => void;
}

const ButtonCustomizer: React.FC<ButtonCustomizerProps> = ({
  text,
  background,
  textColor,
  onTextChange,
  onBackgroundChange,
  onTextColorChange
}) => {
  return (
    <div className="space-y-4">
      <TextInput
        label="Button text"
        value={text}
        onChange={onTextChange}
      />
      <ColorPicker
        label="Button Background"
        value={background}
        onChange={onBackgroundChange}
      />
      <ColorPicker
        label="Button Text Color"
        value={textColor}
        onChange={onTextColorChange}
      />
    </div>
  );
};

export default ButtonCustomizer;