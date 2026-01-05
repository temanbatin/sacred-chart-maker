import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';

const SyaratKetentuan = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />
      
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Syarat & Ketentuan
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Terakhir diperbarui: Januari 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Penerimaan Ketentuan</h2>
            <p className="text-muted-foreground">
              Dengan mengakses dan menggunakan layanan Teman Batin, Anda menyetujui untuk 
              terikat oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan ketentuan 
              ini, harap tidak menggunakan layanan kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Deskripsi Layanan</h2>
            <p className="text-muted-foreground">
              Teman Batin menyediakan layanan perhitungan Human Design Chart berdasarkan 
              data kelahiran yang Anda berikan. Layanan ini bersifat informatif dan tidak 
              dimaksudkan sebagai pengganti nasihat profesional medis, psikologis, atau 
              hukum.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Akurasi Informasi</h2>
            <p className="text-muted-foreground">
              Akurasi hasil Human Design Chart bergantung pada keakuratan data kelahiran 
              yang Anda berikan. Kami tidak bertanggung jawab atas ketidakakuratan hasil 
              yang disebabkan oleh data yang salah atau tidak lengkap.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Penggunaan Layanan</h2>
            <p className="text-muted-foreground mb-4">
              Anda setuju untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Memberikan informasi yang akurat dan lengkap</li>
              <li>Menggunakan layanan hanya untuk tujuan personal dan non-komersial</li>
              <li>Tidak menyalin atau mendistribusikan konten tanpa izin</li>
              <li>Tidak menggunakan layanan untuk aktivitas ilegal</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Hak Kekayaan Intelektual</h2>
            <p className="text-muted-foreground">
              Semua konten, termasuk teks, grafik, logo, dan perangkat lunak yang tersedia 
              di platform ini adalah milik Teman Batin dan dilindungi oleh undang-undang 
              hak cipta.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Batasan Tanggung Jawab</h2>
            <p className="text-muted-foreground">
              Teman Batin tidak bertanggung jawab atas kerugian langsung, tidak langsung, 
              insidental, atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan 
              menggunakan layanan kami.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Perubahan Ketentuan</h2>
            <p className="text-muted-foreground">
              Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja. Perubahan akan 
              berlaku segera setelah dipublikasikan di situs web. Penggunaan layanan yang 
              berkelanjutan setelah perubahan merupakan penerimaan Anda terhadap ketentuan 
              yang diperbarui.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">8. Hukum yang Berlaku</h2>
            <p className="text-muted-foreground">
              Syarat dan ketentuan ini diatur oleh dan ditafsirkan sesuai dengan hukum 
              Republik Indonesia.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SyaratKetentuan;
