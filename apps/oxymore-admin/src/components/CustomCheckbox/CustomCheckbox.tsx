import { Check } from 'lucide-react';

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const CustomCheckbox = ({ checked, onChange, className = '' }: CustomCheckboxProps) => (
  <div 
    className={`w-5 h-5 rounded border-2 flex items-center justify-center cursor-pointer transition-all ${
      checked 
        ? 'bg-purple-500 border-purple-500' 
        : 'border-gray-300 hover:border-purple-500'
    } ${className}`}
    onClick={() => onChange(!checked)}
  >
    {checked && <Check className="w-3 h-3 text-white" />}
  </div>
); 