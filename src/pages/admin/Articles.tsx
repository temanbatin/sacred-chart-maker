import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Sparkles, Image as ImageIcon, Save, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

// Mock data until DB table is ready
const MOCK_ARTICLES = [
  { id: '1', title: 'Kenapa Hidup Terasa Berat?', category: 'Basics', status: 'published' },
  { id: '2', title: '5 Tipe Energi', category: 'Basics', status: 'draft' },
];

const AdminArticles = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<any>({
    title: '',
    slug: '',
    content: '',
    category: 'Basics',
    is_published: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal mengambil artikel: ' + error.message);
    } else {
      setArticles(data || []);
    }
  };

  const handleSaveArticle = async () => {
    if (!currentArticle.title || !currentArticle.slug) {
      toast.error('Judul dan Slug wajib diisi');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('articles')
        .upsert({
          ...currentArticle,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Artikel berhasil disimpan!');
      setIsEditing(false);
      fetchArticles();
    } catch (err: any) {
      toast.error('Gagal menyimpan: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Hapus artikel ini?')) return;

    try {
      const { error } = await supabase.from('articles').delete().eq('id', id);
      if (error) throw error;
      toast.success('Artikel dihapus');
      fetchArticles();
    } catch (err: any) {
      toast.error('Gagal menghapus: ' + err.message);
    }
  };

  const handleGenerateAI = async () => {
    if (!currentArticle.title) {
      toast.error('Masukkan judul artikel terlebih dahulu');
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: { type: 'text', title: currentArticle.title }
      });

      if (error) throw error;

      if (data) {
        setCurrentArticle({
          ...currentArticle,
          content: data.content || data,
          excerpt: data.excerpt || ''
        });
        toast.success('Artikel berhasil digenerate AI!');
      }
    } catch (err: any) {
      console.error('AI Error:', err);
      toast.error('Gagal generate AI: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!currentArticle.title) {
      toast.error('Masukkan judul artikel terlebih dahulu');
      return;
    }

    setIsGeneratingImage(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: currentArticle.title }
      });

      if (error) throw error;

      if (data && data.image_url) {
        setCurrentArticle({
          ...currentArticle,
          image_url: data.image_url
        });
        toast.success('Gambar berhasil digenerate AI!');
      }
    } catch (err: any) {
      console.error('Image AI Error:', err);
      toast.error('Gagal generate gambar: ' + err.message);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Content Manager</h1>
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button onClick={() => setCurrentArticle({ title: '', slug: '', content: '', category: 'Basics', is_published: false })}>
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" aria-describedby="dialog-desc">
            <DialogHeader>
              <DialogTitle>Editor Artikel</DialogTitle>
              <DialogDescription id="dialog-desc" className="sr-only">
                Form untuk membuat atau mengedit artikel.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Judul</label>
                  <Input
                    value={currentArticle.title || ''}
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                      setCurrentArticle({ ...currentArticle, title, slug });
                    }}
                    placeholder="Judul Artikel..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input
                    value={currentArticle.slug || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, slug: e.target.value })}
                    placeholder="url-artikel-anda"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategori</label>
                  <Input
                    value={currentArticle.category || ''}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, category: e.target.value })}
                    placeholder="Basics, Deep Dive..."
                  />
                </div>
                <div className="flex items-center gap-2 pt-8">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={currentArticle.is_published || false}
                    onChange={(e) => setCurrentArticle({ ...currentArticle, is_published: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium">Publish Sekarang</label>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="w-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-pink-500/20 text-pink-400 hover:text-pink-300"
                  onClick={handleGenerateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <ImageIcon className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ImageIcon className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingImage ? 'Generating Image...' : 'Generate Image (AI)'}
                </Button>
                <Button
                  variant="secondary"
                  className="w-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 mr-2" />
                  )}
                  {isGenerating ? 'Sedang Menulis...' : 'Generate with Gemini AI'}
                </Button>
              </div>

              {currentArticle.image_url && (
                <div className="relative group rounded-lg overflow-hidden border border-border aspect-video bg-muted/20">
                  <img
                    src={currentArticle.image_url}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setCurrentArticle({ ...currentArticle, image_url: '' })}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Konten (Markdown)</label>
                <Textarea
                  value={currentArticle.content}
                  onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                  className="min-h-[400px] font-mono text-sm"
                  placeholder="# Tulis konten di sini..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="ghost" onClick={() => setIsEditing(false)}>Batal</Button>
                <Button
                  onClick={handleSaveArticle}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Menyimpan...' : 'Simpan Artikel'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="group hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {article.category}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${article.is_published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                  {article.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              <h3 className="font-bold text-lg mb-2">{article.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{article.excerpt}</p>
              <div className="flex justify-end gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" onClick={() => { setCurrentArticle(article); setIsEditing(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleDeleteArticle(article.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminArticles;
