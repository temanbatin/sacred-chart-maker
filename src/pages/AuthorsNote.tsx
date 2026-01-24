import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';
import { Quote, Sparkles } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import nusaAuthor from '@/assets/nusa-author.jpg';

const AuthorsNote = () => {
    const navigate = useNavigate();

    const handleGetChart = () => {
        navigate('/');
        setTimeout(() => {
            const element = document.getElementById('calculator');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    return (
        <div className="min-h-screen bg-background">
            <MainNavbar />

            <main className="pt-24 pb-16 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-12">
                        <span className="text-accent font-semibold tracking-wider text-sm uppercase mb-4 block">
                            Author's Note
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
                            Saya Menghabiskan 15 Tahun Mencoba Menjadi Orang Lain, Sampai Saya Menemukan Bahwa "Mesin" Saya Tidak Dirancang untuk Itu.
                        </h1>
                    </div>

                    {/* Hero Image */}
                    <div className="relative max-w-lg mx-auto mb-16 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-accent to-primary opacity-30 blur-lg rounded-2xl group-hover:opacity-50 transition-opacity duration-500" />
                        <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-white/10">
                            <img
                                src={nusaAuthor}
                                alt="Nusa Ardi Camping"
                                className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="prose prose-lg dark:prose-invert mx-auto text-muted-foreground space-y-6">
                        <p>
                            Hai, saya Nusa Ardi.
                        </p>
                        <p>
                            Jika kita hitung mundur, saya membuang 15 tahun untuk trial and error.
                        </p>
                        <p>
                            Bukan waktu yang sebentar. Itu adalah 15 tahun yang penuh keringat, deadline, dan perasaan "ingin lari".
                        </p>
                        <p>
                            Dulu, saya adalah seorang Video Editor. Setiap hari saya duduk di depan layar, mengejar bills agar terpenuhi. Orang bilang itu pekerjaan kreatif, tapi bagi saya, itu penjara.
                        </p>
                        <p>
                            Yang saya rasakan hanya tekanan. Deadline adalah satu-satunya hal yang membuat saya bergerak. Uang? Jujur saja, uang tidak pernah memotivasi saya.
                        </p>
                        <p>
                            Saya sering melihat teman-teman saya dan bertanya dengan frustrasi:
                            <br />
                            <span className="font-semibold italic block mt-2">"Kok bisa ya mereka punya api motivasi dari dalam diri sendiri?"</span>
                        </p>
                        <p>
                            Sementara saya?
                        </p>
                        <p>
                            Motivasi saya selalu eksternal. Saya bekerja cuma buat nyenengin Ibu. Buat nyenengin anak. Buat nyenengin pasangan.
                        </p>
                        <p>
                            Saya pikir itu mulia, tapi ternyata itu racun. Saya bekerja bukan karena passion, tapi karena takut mengecewakan orang lain. Rasanya kosong.
                        </p>

                        <h3 className="text-2xl font-bold text-foreground mt-12 mb-4 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-accent" />
                            Titik Balik
                        </h3>

                        <p>
                            Tahun 2023 mengubah segalanya.
                        </p>
                        <p>
                            Saya menemukan sebuah konsep bernama <span className="text-foreground font-semibold">Human Design</span>.
                        </p>
                        <p>
                            Awalnya saya skeptis. Tapi karena saya (sekarang saya tahu) adalah seorang Manifesting Generator dengan Sacral Authority, rasa penasaran saya meledak.
                        </p>
                        <p>
                            Saya adalah pembelajar cepat. Dalam 1 minggu, saya melahap data dari berbagai sumber. Saya bedah chart saya dari A sampai Z.
                        </p>
                        <p>
                            Dan saat itulah saya menemukan jawabannya di dalam chart saya:
                        </p>

                        <div className="bg-secondary/30 border border-border rounded-xl p-6 my-8">
                            <p className="font-semibold text-foreground mb-4">
                                Saya adalah Manifesting Generator dengan Profil 3/5.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>
                                        <strong className="text-foreground">Profil 3/5 (The Martyr/Heretic):</strong> Hidup saya memang didesain untuk Trial and Error. 15 tahun kegagalan itu bukan buang waktu, itu adalah riset.
                                    </span>
                                </li>
                                <li className="flex gap-3">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2.5 flex-shrink-0" />
                                    <span>
                                        <strong className="text-foreground">Manifesting Generator:</strong> Saya tidak didesain untuk mengerjakan satu hal yang sama berulang-ulang setiap hari (seperti mengedit video rutin). Jiwa saya berteriak.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <p>
                            Pantas saja saya depresi. Pantas saja saya ingin lari.
                        </p>
                        <p>
                            Saya memaksakan mesin Lambo untuk mendaki gunung yang belum beraspal.
                        </p>

                        <h3 className="text-2xl font-bold text-foreground mt-12 mb-4">
                            The New Framework (Mekanisme Baru)
                        </h3>

                        <p>
                            Sekarang, saya tidak lagi bekerja karena tekanan. Saya tahu misi saya. Saya tahu cara "sakral" saya merespons.
                        </p>
                        <p>
                            Saya mengambil 15 tahun eksperimen rasa sakit saya, dan memadatkannya menjadi sebuah framework baru untuk kamu.
                        </p>
                        <p>
                            Saya tidak ingin kamu menghabiskan 15 tahun tersesat seperti saya.
                        </p>
                        <p>
                            Itulah kenapa saya membangun <span className="text-accent font-semibold">Temanbatin.com</span>.
                        </p>
                        <p>
                            Satu hal yang perlu kamu tahu: Kebanyakan generator chart di luar sana hanya "menempel" (embed) kalkulator buatan luar negeri. Bahasanya kaku, konteksnya asing.
                        </p>
                        <p>
                            Temanbatin.com sepertinya adalah satu-satunya generator chart yang murni dikembangkan di Indonesia. Fully personalized, kalo kebanyakan analisis reading human design yang kamu ketemui, mereka dibuat dengan template yang seperti lego. Temanbatin berbeda...
                        </p>
                        <p>
                            Dibuat dengan algoritma yang presisi, tapi diterjemahkan dengan "rasa" dan bahasa yang membumi, khusus untuk konteks kita di sini. Saya bekerja pagi hingga malam untuk membuat sistem ini dalam 2 tahun terakhir, dan akhirnya bisa menyajikannya kepada kamu.
                        </p>

                        <div className="bg-accent/10 border-l-4 border-accent p-6 my-8 rounded-r-xl">
                            <Quote className="w-8 h-8 text-accent/50 mb-2" />
                            <p className="text-lg font-medium text-foreground italic">
                                "Jangan ulangi kesalahan 15 tahun saya. Cek chart kamu, temukan 'tombol on' motivasi kamu yang asli, dan berhenti hidup demi ekspektasi orang lain."
                            </p>
                        </div>

                        <p className="mb-8">
                            Sampai jumpa di dalam,
                        </p>

                        <div className="mt-8">
                            <p className="font-bold text-foreground text-xl">Nusa Ardi</p>
                            <p className="text-sm text-muted-foreground">Manifesting Generator 3/5 | Founder Temanbatin.com</p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center">
                        <button
                            onClick={handleGetChart}
                            className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-accent/90 transition-all transform hover:scale-105 shadow-lg shadow-accent/20"
                        >
                            <Sparkles className="w-5 h-5" />
                            Cek Chart Saya Sekarang
                        </button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AuthorsNote;
