import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, Wallet, TrendingUp, Banknote, Share2 } from 'lucide-react';
import { toast } from 'sonner';

interface AffiliateDashboardProps {
    userId: string;
    email: string;
}

export const AffiliateDashboard = ({ userId, email }: AffiliateDashboardProps) => {
    const [loading, setLoading] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [affiliate, setAffiliate] = useState<any>(null);

    // Registration Form
    const [customCode, setCustomCode] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');

    useEffect(() => {
        if (userId) fetchAffiliateData();
    }, [userId]);

    const fetchAffiliateData = async () => {
        try {
            const { data, error } = await supabase
                .from('affiliates')
                .select('*')
                .eq('user_id', userId)
                .single();

            if (data) setAffiliate(data);
        } catch (error) {
            console.log("Not an affiliate yet");
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegistering(true);

        try {
            const { data, error } = await supabase.functions.invoke('join-affiliate', {
                body: {
                    user_id: userId,
                    custom_code: customCode || undefined,
                    bank_info: {
                        bank_name: bankName,
                        account_number: accountNumber,
                        account_holder: accountHolder
                    }
                }
            });

            if (error) throw error;
            if (!data.success) throw new Error(data.error || 'Failed to join');

            toast.success("Berhasil bergabung! Kode kupon Anda siap digunakan.");
            setAffiliate(data.data); // Update state immediately
        } catch (err: any) {
            toast.error(err.message || "Gagal mendaftar affiliate");
        } finally {
            setRegistering(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Kode berhasil disalin!");
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    // --- VIEW: DASHBOARD (ALREADY AFFILIATE) ---
    if (affiliate) {
        return (
            <div className="space-y-8 animate-fade-up">
                {/* Header Card */}
                <div className="glass-card p-6 md:p-8 rounded-2xl border-l-4 border-l-primary relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground mb-1">Affiliate Dashboard</h2>
                            <p className="text-muted-foreground">Status: <span className="text-green-500 font-medium uppercase">{affiliate.status}</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className="text-sm text-muted-foreground uppercase tracking-wider">Kode Kupon Anda</span>
                            <div className="flex items-center gap-2 bg-background/50 p-2 rounded-lg border border-border">
                                <code className="text-xl font-mono font-bold text-primary tracking-wider">{affiliate.coupon_code}</code>
                                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => copyToClipboard(affiliate.coupon_code)}>
                                    <Copy className="w-4 h-4" />
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground">Diskon 10% untuk pembeli • Komisi 20% untuk Anda</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                            <Wallet className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Saldo Tersedia</p>
                            <h3 className="text-2xl font-bold text-foreground">Rp {parseInt(affiliate.balance || 0).toLocaleString()}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Siap ditarik</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Pendapatan</p>
                            <h3 className="text-2xl font-bold text-foreground">Rp {parseInt(affiliate.total_earnings || 0).toLocaleString()}</h3>
                            <p className="text-xs text-muted-foreground mt-1">Sejak bergabung</p>
                        </div>
                    </div>
                </div>

                {/* Info & Tools */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Banknote className="w-4 h-4" /> Info Rekening
                        </h3>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-muted-foreground">Bank:</span> {affiliate.bank_info?.bank_name || '-'}</p>
                            <p><span className="text-muted-foreground">No. Rekening:</span> {affiliate.bank_info?.account_number || '-'}</p>
                            <p><span className="text-muted-foreground">Atas Nama:</span> {affiliate.bank_info?.account_holder || '-'}</p>
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Share2 className="w-4 h-4" /> Cara Promosi
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                            <li>Bagikan kode kupon <strong>{affiliate.coupon_code}</strong> ke teman atau followers.</li>
                            <li>Mereka dapat <strong>Diskon 10%</strong> saat checkout full report.</li>
                            <li>Anda otomatis dapat <strong>20% Komisi</strong> dari total pembayaran mereka.</li>
                            <li>Komisi masuk ke saldo saat status order "PAID".</li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }

    // --- VIEW: REGISTRATION (NOT AFFILIATE) ---
    return (
        <div className="animate-fade-up max-w-2xl mx-auto">
            <div className="glass-card p-8 rounded-2xl text-center mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Banknote className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Join TemanBatin Affiliate</h2>
                <p className="text-muted-foreground">Dapatkan penghasilan tambahan dengan membagikan value Human Design.</p>

                <div className="grid grid-cols-2 gap-4 mt-8 mb-8 text-left max-w-md mx-auto">
                    <div className="p-4 bg-secondary/30 rounded-xl">
                        <p className="text-xs text-muted-foreground uppercase mb-1">Benefit User</p>
                        <p className="font-bold text-lg text-foreground">Diskon 10%</p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-xl border border-primary/30">
                        <p className="text-xs text-primary uppercase mb-1">Komisi Anda</p>
                        <p className="font-bold text-lg text-primary">Komisi 20%</p>
                    </div>
                </div>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-2xl">
                <h3 className="font-semibold text-lg mb-6">Form Pendaftaran</h3>
                <form onSubmit={handleJoin} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Kode Kupon Pilihan (Opsional)</Label>
                        <Input
                            placeholder="Contoh: NAMAANDA, BERKAH123 (Min. 4 huruf)"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                            className="bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground">Jika kosong, kami buatkan otomatis. Gunakan huruf & angka.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Nama Bank</Label>
                            <Input
                                placeholder="BCA / Mandiri / GoPay"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>No. Rekening</Label>
                            <Input
                                placeholder="1234xxxx"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Atas Nama (Pemilik Rekening)</Label>
                        <Input
                            placeholder="Sesuai buku tabungan"
                            value={accountHolder}
                            onChange={(e) => setAccountHolder(e.target.value)}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full fire-glow mt-2" disabled={registering}>
                        {registering ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mendaftar...</> : "Daftar Affiliate Sekarang"}
                    </Button>
                </form>
            </div>
        </div>
    );
};
