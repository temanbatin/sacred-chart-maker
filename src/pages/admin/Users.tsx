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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Search, Edit, UserCog } from 'lucide-react';

interface UserProfile {
    id: string;
    user_id: string;
    name: string;
    email: string;
    whatsapp: string | null;
    role: string | null;
    created_at: string;
}

const Users = () => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Edit Role State
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
    const [newRole, setNewRole] = useState<string>('user');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data || []);
            setUsers(data || []);
        } catch (error: unknown) {
            console.error('Error fetching users:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error('Gagal mengambil data user: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateRole = async () => {
        if (!selectedUser) return;

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', selectedUser.id);

            if (error) throw error;

            toast.success(`Role user ${selectedUser.name} berhasil diupdate ke ${newRole}`);
            setIsDialogOpen(false);
            fetchUsers(); // Refresh list
            setIsDialogOpen(false);
            fetchUsers(); // Refresh list
        } catch (error: unknown) {
            console.error('Error updating role:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            toast.error('Gagal update role: ' + errorMessage);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Kelola pengguna dan akses role.</p>
                </div>
                <div className="relative w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari user..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nama</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Terdaftar</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Loading users...</TableCell>
                            </TableRow>
                        ) : filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8">Tidak ada user ditemukan.</TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name || 'Tanpa Nama'}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.whatsapp || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </TableCell>
                                    <TableCell>{format(new Date(user.created_at), 'dd MMM yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                        <Dialog open={isDialogOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                                            setIsDialogOpen(open);
                                            if (!open) setSelectedUser(null);
                                        }}>
                                            <DialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setNewRole(user.role || 'user');
                                                        setIsDialogOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Role User</DialogTitle>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label>User</Label>
                                                        <Input value={user.name} disabled />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label>Role</Label>
                                                        <Select value={newRole} onValueChange={setNewRole}>
                                                            <SelectTrigger>
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="user">User</SelectItem>
                                                                <SelectItem value="admin">Admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <Button onClick={handleUpdateRole} className="w-full">Simpan Perubahan</Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
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

export default Users;