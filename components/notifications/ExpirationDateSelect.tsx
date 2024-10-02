import React from 'react';
import moment from 'moment-timezone';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InfoIcon } from 'lucide-react';

interface LocalConfig {
    expirationDate?: string;
    // Add other properties of localConfig as needed
  }
  
  interface ExpirationDateSelectProps {
    localConfig: LocalConfig;
    updateConfig: (key: 'expirationDate', value: string) => void;
  }
  
  const ExpirationDateSelect: React.FC<ExpirationDateSelectProps> = ({ localConfig, updateConfig }) => {
    const calculateExpirationDate = (days: number): string => {
      return moment().add(days, 'days').toISOString();
    };

  const getDaysDifference = (date: moment.MomentInput) => {
    const now = moment();
    const expirationDate = moment(date);
    return expirationDate.diff(now, 'days');
  };

  const handleExpirationChange = (value: string) => {
    const calculatedDate = calculateExpirationDate(parseInt(value));
    updateConfig('expirationDate', calculatedDate);
  };

  const currentValue = localConfig.expirationDate
    ? getDaysDifference(localConfig.expirationDate).toString()
    : '';

  return (
    <div>
      <Label className="text-foreground flex items-center">
        Expiration Date
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="ml-2 h-4 w-4 text-primary cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="z-50 bg-background p-2 rounded shadow">
              <p>The date when this notification will no longer be shown to users.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Label>
      <Select
        value={currentValue}
        onValueChange={handleExpirationChange}
      >
        <SelectTrigger className="w-full border-primary focus:ring-primary">
          <SelectValue placeholder="Select expiration" />
        </SelectTrigger>
        <SelectContent className='bg-background'>
          {[1, 2, 3, 4, 5, 6, 7].map((days) => (
            <SelectItem key={days} value={days.toString()}>
              {days} {days === 1 ? 'day' : 'days'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-primary mt-1">
        Expiration: {localConfig.expirationDate
          ? moment(localConfig.expirationDate).format('MMMM D, YYYY, h:mm A')
          : 'Not set'}
      </p>
    </div>
  );
};

export default ExpirationDateSelect;