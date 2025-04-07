import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const defaultCategories = [
  'Travel',
  'Adventure',
  'Career',
  'Health',
  'Fitness',
  'Education',
  'Finance',
  'Relationship',
  'Skill',
  'Hobby',
];

export default function CategorySelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [customInput, setCustomInput] = useState(value && !defaultCategories.includes(value));
  const [customValue, setCustomValue] = useState(value);

  const handleSelect = (val: string) => {
    if (val === 'Custom') {
      setCustomValue('');
      setCustomInput(true);
    } else {
      onChange(val);
      setCustomValue(val);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomValue(e.target.value);
    onChange(e.target.value);
  };

  const handleBackToSelect = () => {
    setCustomInput(false);
    setCustomValue('');
    onChange('');
  };

  return (
    <div className="w-full">
      {!customInput ? (
        <Select value={value} onValueChange={handleSelect}>
          <SelectTrigger className="w-full border border-border rounded-[6px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="w-full border border-border rounded-[6px]">
            {defaultCategories.map((category) => (
              <SelectItem key={category} value={category} className="cursor-pointer data-[highlighted]:bg-muted"> 
                {category}
              </SelectItem>
            ))}
            <SelectItem value="Custom" className="italic font-medium cursor-pointer data-[highlighted]:bg-muted"
                >Custom</SelectItem>
          </SelectContent>
        </Select>
      ) : (
        <div className="flex gap-2">
          <Input
            value={customValue}
            onChange={handleInputChange}
            placeholder="Enter custom category"
            className="w-full border border-border rounded-[6px] focus-visible:outline-none focus-visible:ring-0 focus-visible:border-border focus:outline-none focus:ring-0"
          />
          <Button variant="outline" onClick={handleBackToSelect} className="text-[12px] px-2 cursor-pointer rounded-[6px]">
            Categories
          </Button>
        </div>
      )}
    </div>
  );
}
