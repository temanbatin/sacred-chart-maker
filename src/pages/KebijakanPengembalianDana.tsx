import { MainNavbar } from '@/components/MainNavbar';
import { Footer } from '@/components/Footer';

const KebijakanPengembalianDana = () => {
  return (
    <div className="min-h-screen bg-background">
      <MainNavbar />

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Kebijakan Pengembalian Dana</h1>

          <div className="prose prose-lg max-w-none space-y-8 text-muted-foreground">
            {/* Human Design Report Section */}
            <section id="human-design-report" className="bg-accent/10 border border-accent/30 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Garansi Human Design Report</h2>
              <p className="mb-4">
                Untuk <strong>Human Design Report (Essential & Full Report)</strong>, kami memberikan
                <strong className="text-accent"> Garansi 100% Pembuatan Report Ulang</strong> dengan ketentuan berikut:
              </p>

              <div className="bg-background/50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Garansi Berlaku Untuk:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Kesalahan perhitungan dalam chart Human Design kamu</li>
                  <li>Data report tidak sesuai dengan informasi kelahiran yang kamu berikan</li>
                  <li>Kesalahan teknis dalam pembuatan report dari pihak kami</li>
                  <li>Report tidak dapat diunduh atau diakses karena masalah dari sistem kami</li>
                </ul>
              </div>

              <div className="bg-background/50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-foreground mb-3">Cara Mengajukan Garansi:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Hubungi tim kami via email <a href="mailto:Hei@temanbatin.com" className="text-accent hover:underline">Hei@temanbatin.com</a> atau WhatsApp</li>
                  <li>Sertakan nomor order dan bukti kesalahan (screenshot jika memungkinkan)</li>
                  <li>Tim kami akan memverifikasi dalam 1-2 hari kerja</li>
                  <li>Report baru akan dibuat dan dikirimkan dalam 3-5 hari kerja</li>
                </ol>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-2">⚠️ Penting:</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li>Garansi ini <strong>bukan pengembalian dana</strong>, melainkan pembuatan report ulang</li>
                  <li>Kesalahan input data dari pengguna (misal: tanggal lahir salah) tidak termasuk garansi</li>
                  <li>Report yang sudah diunduh dan diakses tidak dapat diminta pengembalian dana</li>
                  <li>Untuk layanan lainnya, berlaku kebijakan pengembalian dana di bawah ini</li>
                </ul>
              </div>
            </section>

            <div className="border-t border-border my-8"></div>

            {/* Existing Sections */}
            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">Kebijakan Pengembalian Dana (Layanan Lainnya)</h2>
              <p>
                Kebijakan di bawah ini berlaku untuk layanan berbayar selain Human Design Report,
                seperti konsultasi personal dan layanan berlangganan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Ketentuan Umum</h2>
              <p>
                Teman Batin berkomitmen untuk memberikan layanan terbaik kepada setiap pengguna.
                Kebijakan pengembalian dana ini mengatur prosedur dan ketentuan yang berlaku untuk
                permintaan pengembalian dana atas layanan yang telah dibeli.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Layanan yang Dapat Dikembalikan</h2>
              <p>Pengembalian dana dapat diajukan untuk:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Layanan konsultasi yang belum digunakan</li>
                <li>Paket premium yang dibatalkan dalam waktu 7 hari setelah pembelian</li>
                <li>Layanan yang tidak dapat diakses karena masalah teknis dari pihak kami</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. Layanan yang Tidak Dapat Dikembalikan</h2>
              <p>Pengembalian dana tidak berlaku untuk:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Chart Human Design gratis yang telah dihasilkan</li>
                <li>Layanan konsultasi yang telah dilaksanakan</li>
                <li>Produk digital yang telah diunduh atau diakses</li>
                <li>Paket premium setelah melewati masa 7 hari sejak pembelian</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Prosedur Pengajuan</h2>
              <p>Untuk mengajukan pengembalian dana, ikuti langkah-langkah berikut:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>Hubungi tim dukungan kami melalui halaman Hubungi Kami atau email</li>
                <li>Sertakan informasi pesanan: nomor order, tanggal pembelian, dan alasan pengembalian</li>
                <li>Tim kami akan meninjau permintaan dalam waktu 3-5 hari kerja</li>
                <li>Jika disetujui, pengembalian dana akan diproses dalam 7-14 hari kerja</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Metode Pengembalian</h2>
              <p>
                Pengembalian dana akan dilakukan melalui metode pembayaran yang sama dengan yang
                digunakan saat pembelian. Untuk pembayaran via transfer bank, pastikan informasi
                rekening yang diberikan sudah benar.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Pengembalian Sebagian</h2>
              <p>
                Dalam beberapa kasus, kami mungkin menawarkan pengembalian dana sebagian jika
                sebagian layanan telah digunakan. Jumlah pengembalian akan dihitung berdasarkan
                proporsi layanan yang belum digunakan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Pembatalan Berlangganan</h2>
              <p>
                Untuk layanan berlangganan, kamu dapat membatalkan kapan saja. Pembatalan akan
                efektif di akhir periode berlangganan yang sedang berjalan. Tidak ada pengembalian
                dana untuk periode berlangganan yang sedang berjalan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Pengecualian</h2>
              <p>
                Teman Batin berhak menolak permintaan pengembalian dana jika ditemukan indikasi
                penyalahgunaan kebijakan ini atau pelanggaran terhadap Syarat & Ketentuan layanan kami.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Perubahan Kebijakan</h2>
              <p>
                Kebijakan ini dapat diperbarui sewaktu-waktu. Perubahan akan diberitahukan melalui
                email atau pemberitahuan di website. Kebijakan yang berlaku adalah yang tercantum
                pada saat permintaan pengembalian dana diajukan.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Hubungi Kami</h2>
              <p>
                Jika kamu memiliki pertanyaan tentang kebijakan pengembalian dana ini, silakan
                hubungi tim dukungan kami melalui halaman Hubungi Kami atau email ke
                Hei@temanbatin.com
              </p>
            </section>

            <p className="text-sm text-muted-foreground/70 pt-8 border-t border-border">
              Terakhir diperbarui: Januari 2025
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default KebijakanPengembalianDana;
