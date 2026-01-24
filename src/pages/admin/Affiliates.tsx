import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AffiliateExtended {
    id: string;
    user_id: string;
    coupon_code: string;
    commission_rate: number;
    bank_details: string | null;
    status: string;
    profile?: {
        name: string;
        email: string;
    };
    earnings: {
        total: number;
        paid: number;
        pending: number;
    };
}

const Affiliates = () => {
    const [affiliates, setAffiliates] = useState<AffiliateExtended[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAffiliatesData();
    }, []);

    const fetchAffiliatesData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Affiliates
            const { data: affiliatesData, error: affError } = await supabase
                .from('affiliates')
                .select('*');

            if (affError) throw affError;

            if (!affiliatesData || affiliatesData.length === 0) {
                setAffiliates([]);
                return;
            }

            // 2. Fetch Profiles for these affiliates (linking via user_id)
            const userIds = affiliatesData.map(a => a.user_id);
            const { data: profilesData, error: profError } = await supabase
                .from('profiles')
                .select('user_id, name, email')
                .in('user_id', userIds);

            if (profError) throw profError;

            // 3. Fetch Commissions
            const affiliateIds = affiliatesData.map(a => a.id);
            const { data: commissionsData, error: commError } = await supabase
                .from('commissions')
                .select('affiliate_id, amount, status')
                .in('affiliate_id', affiliateIds);

            if (commError) throw commError;

            // 4. Merge Data
            const mergedData: AffiliateExtended[] = affiliatesData.map(aff => {
                // Find profile
                const profile = profilesData?.find(p => p.user_id === aff.user_id);

                // Calculate earnings
                const myCommissions = commissionsData?.filter(c => c.affiliate_id === aff.id) || [];
                const total = myCommissions.reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
                const paid = myCommissions
                    .filter(c => c.status === 'paid')
                    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);
                const pending = myCommissions
                    .filter(c => c.status === 'pending')
                    .reduce((sum, c) => sum + (Number(c.amount) || 0), 0);

                return {
                    ...aff,
                    profile: profile ? { name: profile.name, email: profile.email } : undefined,
                    earnings: { total, paid, pending }
                };
            });

            setAffiliates(mergedData);

        } catch (error: unknown) {
            console.error('Error fetching affiliate data:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error(`Gagal mengambil data affiliate: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const formatIDR = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Affiliate Management</h1>
                <p className="text-muted-foreground">Kelola mitra affiliate dan pembayaran komisi.</p>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Affiliator</TableHead>
                            <TableHead>Kode Kupon</TableHead>
                            <TableHead>Rate</TableHead>
                            <TableHead>Total Earnings</TableHead>
                            <TableHead>Info Bank</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Jadwal Bayar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Loading data...</TableCell>
                            </TableRow>
                        ) : affiliates.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8">Belum ada affiliator terdaftar.</TableCell>
                            </TableRow>
                        ) : (
                            affiliates.map((aff) => (
                                <TableRow key={aff.id}>
                                    <TableCell>
                                        <div className="font-medium">{aff.profile?.name || 'Unknown User'}</div>
                                        <div className="text-xs text-muted-foreground">{aff.profile?.email}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="font-mono text-sm">{aff.coupon_code}</Badge>
                                    </TableCell>
                                    <TableCell>{aff.commission_rate}%</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-green-600">{formatIDR(aff.earnings.total)}</div>
                                        <div className="text-xs text-muted-foreground">
                                            Pending: {formatIDR(aff.earnings.pending)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={aff.bank_details || ''}>
                                        {aff.bank_details || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={aff.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                            {aff.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">Akhir Bulan</Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Affiliates;