import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { MultiStepForm, BirthData } from '@/components/MultiStepForm';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ChartGenerationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: BirthData) => void;
    isLoading: boolean;
}

export const ChartGenerationModal = ({
    isOpen,
    onClose,
    onSubmit,
    isLoading,
}: ChartGenerationModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] p-0 bg-transparent border-none shadow-none overflow-hidden">
                <VisuallyHidden>
                    <DialogTitle>Generate Your Chart</DialogTitle>
                </VisuallyHidden>
                <div className="bg-background rounded-2xl shadow-2xl border border-border p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
                    <MultiStepForm
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
