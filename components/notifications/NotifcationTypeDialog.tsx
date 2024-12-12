import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface NotificationTypeDialogProps {
  isAddScreenOpen: boolean;
  setIsAddScreenOpen: (isAddScreenOpen: boolean) => void;
  handleAddOption: (option: 'push' | 'Modal') => void;
}

export default function NotificationTypeDialog({
  isAddScreenOpen,
  setIsAddScreenOpen,
  handleAddOption
}: NotificationTypeDialogProps) {
  return (
    <Dialog open={isAddScreenOpen} onOpenChange={setIsAddScreenOpen}>
      <DialogContent className="border-2 border-primary bg-card sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="font-industry text-center text-2xl font-semibold text-foreground sm:text-left">
            Select Notification Type
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 sm:flex-row sm:justify-between sm:space-x-6 sm:space-y-0">
          <Button
            onClick={() => handleAddOption('push')}
            className="transition-smooth hover-lift active-shrink aspect-[4/3] h-auto w-full overflow-hidden border-0 bg-background p-2 hover:bg-background hover:shadow-lg sm:w-[calc(50%-0.75rem)]"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/Push.png"
                alt="Push Notification Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Button>
          <Button
            onClick={() => handleAddOption('Modal')}
            className="transition-smooth hover-lift active-shrink aspect-[4/3] h-auto w-full overflow-hidden border-0 bg-background p-2 hover:bg-background hover:shadow-lg sm:w-[calc(50%-0.75rem)]"
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/Modal.png"
                alt="Modal Preview"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
