import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface NotificationTypeDialogProps {
    isAddScreenOpen: boolean;
    setIsAddScreenOpen: (isAddScreenOpen: boolean) => void;
    handleAddOption: (option: "push" | "Modal") => void;
}

export default function NotificationTypeDialog({ isAddScreenOpen, setIsAddScreenOpen, handleAddOption }: NotificationTypeDialogProps) {
    return (
        <Dialog open={isAddScreenOpen} onOpenChange={setIsAddScreenOpen}>
            <DialogContent className="sm:max-w-[700px] bg-card border-2 border-primary">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-center sm:text-left text-foreground font-industry">Select Notification Type</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between space-y-6 sm:space-y-0 sm:space-x-6">
                    <Button 
                        onClick={() => handleAddOption('push')} 
                        className="w-full sm:w-[calc(50%-0.75rem)] h-auto aspect-[4/3] p-2 overflow-hidden hover:shadow-lg transition-smooth hover-lift active-shrink bg-background hover:bg-background border-0"
                    >
                        <div className="relative w-full h-full">
                            <Image 
                                src="/images/Push.png" 
                                alt="Push Notification Preview" 
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </Button>
                    <Button 
                        onClick={() => handleAddOption('Modal')} 
                        className="w-full sm:w-[calc(50%-0.75rem)] h-auto hover:bg-background aspect-[4/3] p-2 overflow-hidden hover:shadow-lg transition-smooth hover-lift active-shrink bg-background border-0"
                    >
                        <div className="relative w-full h-full">
                            <Image 
                                src="/images/Modal.png" 
                                alt="Modal Preview" 
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}