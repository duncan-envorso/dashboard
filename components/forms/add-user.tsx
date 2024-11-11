'use client';

import { Plus, UserPlus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface AddUserButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showTooltip?: boolean;
  tooltipContent?: string;
}

export const AddUserButton = ({
  className,
  variant = 'default',
  size = 'default',
  showTooltip = true,
  tooltipContent = 'Add a new user to the system',
}: AddUserButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard/users/new');
  };

  const button = (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={cn(
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-200 ease-in-out",
        "flex items-center gap-2",
        "focus:ring-2 focus:ring-primary/20",
        className
      )}
    >
      <UserPlus className="h-4 w-4" />
      <span>Add New User</span>
    </Button>
  );

  if (!showTooltip) return button;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Usage example with loading state and disabled state
export const AddUserButtonWithStates = ({
  className,
  isLoading,
  isDisabled,
  tooltipContent,
}: {
  className?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  tooltipContent?: string;
}) => {
  const router = useRouter();

  const buttonContent = isLoading ? (
    <>
      <span className="animate-spin">
        <Plus className="h-4 w-4" />
      </span>
      <span>Adding User...</span>
    </>
  ) : (
    <>
      <UserPlus className="h-4 w-4" />
      <span>Add New User</span>
    </>
  );

  const button = (
    <Button
      onClick={() => router.push('/dashboard/users/new')}
      className={cn(
        "bg-primary hover:bg-primary/90 text-primary-foreground",
        "transition-all duration-200 ease-in-out",
        "flex items-center gap-2",
        "focus:ring-2 focus:ring-primary/20",
        isDisabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={isLoading || isDisabled}
    >
      {buttonContent}
    </Button>
  );

  if (isDisabled) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {button}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>You dont have permission to add new users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
};