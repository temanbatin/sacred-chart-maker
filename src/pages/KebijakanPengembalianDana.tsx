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
                Untuk layanan berlangganan, Anda dapat membatalkan kapan saja. Pembatalan akan 
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
                Jika Anda memiliki pertanyaan tentang kebijakan pengembalian dana ini, silakan 
                hubungi tim dukungan kami melalui halaman Hubungi Kami atau email ke 
                support@temanbatin.com
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
