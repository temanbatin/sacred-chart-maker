import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Sedang memverifikasi email Anda...');

    useEffect(() => {
        const verify = async () => {
            const token = searchParams.get('token');
            const email = searchParams.get('email');

            if (!token || !email) {
                setStatus('error');
                setMessage('Link verifikasi tidak valid.');
                return;
            }

            // Logic for custom verification
            // For now, if we use Supabase's native token, we can use verifyOtp
            // But if we use a fully custom token, we'd call an Edge Function

            const { error } = await supabase.auth.verifyOtp({
                email,
                token,
                type: 'signup',
            });

            if (error) {
                setStatus('error');
                setMessage('Gagal memverifikasi: ' + error.message);
            } else {
                setStatus('success');
                setMessage('Email Anda berhasil dikonfirmasi! Anda akan diarahkan ke dashboard.');
                setTimeout(() => navigate('/account'), 3000);
            }
        };

        verify();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="glass-card max-w-md w-full p-8 text-center rounded-2xl">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 animate-spin text-accent mb-4" />
                        <h1 className="text-xl font-bold">{message}</h1>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Berhasil!</h1>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Button onClick={() => navigate('/account')} className="w-full fire-glow">
                            Masuk ke Akun
                        </Button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h1 className="text-2xl font-bold mb-2">Oops!</h1>
                        <p className="text-muted-foreground mb-6">{message}</p>
                        <Button onClick={() => navigate('/account')} variant="outline" className="w-full">
                            Kembali ke Login
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
