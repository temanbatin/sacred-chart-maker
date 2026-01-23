import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';

const KebijakanPrivasi = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto prose prose-invert">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Kebijakan Privasi
          </h1>

          <p className="text-muted-foreground mb-8">
            Terakhir diperbarui: Januari 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Informasi yang Kami Kumpulkan</h2>
            <p className="text-muted-foreground mb-4">
              Kami mengumpulkan informasi yang kamu berikan secara langsung, termasuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Nama lengkap</li>
              <li>Alamat email</li>
              <li>Nomor WhatsApp</li>
              <li>Tanggal, waktu, dan tempat lahir (untuk perhitungan Human Design Chart)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Penggunaan Informasi</h2>
            <p className="text-muted-foreground mb-4">
              Informasi yang kami kumpulkan digunakan untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Menghitung dan menghasilkan Human Design Chart kamu</li>
              <li>Mengirimkan hasil chart dan materi terkait</li>
              <li>Memberikan update tentang layanan dan penawaran</li>
              <li>Meningkatkan layanan kami</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Perlindungan Data</h2>
            <p className="text-muted-foreground">
              Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi
              pribadi kamu dari akses yang tidak sah, perubahan, pengungkapan, atau penghancuran.
              Data kamu disimpan dengan enkripsi dan hanya diakses oleh personel yang berwenang.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Berbagi Informasi</h2>
            <p className="text-muted-foreground">
              Kami tidak menjual, memperdagangkan, atau mentransfer informasi pribadi kamu
              kepada pihak ketiga tanpa persetujuan kamu, kecuali jika diwajibkan oleh hukum.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Hak Kamu</h2>
            <p className="text-muted-foreground mb-4">
              Kamu memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Mengakses data pribadi kamu</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data kamu</li>
              <li>Berhenti berlangganan dari komunikasi pemasaran</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Jika kamu memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi
              kami melalui halaman Hubungi Kami.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KebijakanPrivasi;
