import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Phone, Mail, Loader2, CheckCircle } from 'lucide-react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { whatsapp: string; email: string }) => void;
  isLoading?: boolean;
}

export const LeadCaptureModal = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: LeadCaptureModalProps) => {
  const [whatsapp, setWhatsapp] = useState('+62');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ whatsapp?: string; email?: string }>({});

  const validateWhatsapp = (value: string): boolean => {
    // Must start with +62 and have 10-13 digits after country code
    const whatsappRegex = /^\+62[0-9]{9,12}$/;
    return whatsappRegex.test(value);
  };

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleWhatsappChange = (value: string) => {
    // Ensure it always starts with +62
    if (!value.startsWith('+62')) {
      value = '+62' + value.replace(/^\+?62?/, '');
    }
    // Only allow numbers after +62
    const cleanValue = '+62' + value.slice(3).replace(/[^0-9]/g, '');
    setWhatsapp(cleanValue);
    
    if (errors.whatsapp) {
      setErrors(prev => ({ ...prev, whatsapp: undefined }));
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { whatsapp?: string; email?: string } = {};
    
    if (!validateWhatsapp(whatsapp)) {
      newErrors.whatsapp = 'Masukkan nomor WhatsApp yang valid (contoh: +628123456789)';
    }
    
    if (!validateEmail(email)) {
      newErrors.email = 'Masukkan alamat email yang valid';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({ whatsapp, email });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient-fire text-center">
            Satu Langkah Lagi! 🌟
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Sebelum lanjut, silahkan masukkan WhatsApp dan email yang valid untuk menerima hasil chart Human Design kamu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* WhatsApp */}
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="text-foreground">
              Nomor WhatsApp
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="whatsapp"
                type="tel"
                placeholder="+628123456789"
                value={whatsapp}
                onChange={(e) => handleWhatsappChange(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10"
                required
              />
            </div>
            {errors.whatsapp && (
              <p className="text-sm text-destructive">{errors.whatsapp}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Hanya menerima nomor Indonesia (+62)
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="lead-email" className="text-foreground">
              Alamat Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="lead-email"
                type="email"
                placeholder="contoh@email.com"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground h-12 rounded-xl pl-10"
                required
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full fire-glow bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6 rounded-xl font-semibold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Lihat Chart Saya
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Kami menghormati privasimu. Data kamu aman bersama kami.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
