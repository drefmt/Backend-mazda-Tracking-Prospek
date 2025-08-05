function predictScore(prospek) {
  let score = 0;

  // ===== Demografi =====
  const { usia = 0, penghasilan = 0, pekerjaan = "" } = prospek.demografi || {};

  if (usia >= 25 && usia <= 35) score += 15;
  else if (usia > 35 && usia <= 50) score += 10;
  else score += 5;

  const pekerjaanScore = {
    Pengusaha: 15,
    PNS: 12,
    "Karyawan Swasta": 10,
    Freelancer: 8,
    Mahasiswa: 5,
    Lainnya: 5,
  };
  score += pekerjaanScore[pekerjaan] || 5;

  if (penghasilan > 15000000) score += 25;
  else if (penghasilan >= 10000000) score += 20;
  else if (penghasilan >= 5000000) score += 10;
  else score += 5;

  // ===== Psikografis =====
  const minat = prospek.psikografis?.minat || [];
  const gayaHidup = prospek.psikografis?.gayaHidup || "";
  const motivasi = prospek.psikografis?.motivasi || "";

  const gayaHidupSkor = {
    Modern: 10,
    Aktif: 10,
    Keluarga: 8,
    Karier: 8,
    Minimalis: 6,
    Trendi: 7,
    "Pencari Keamanan": 5,
    "Pecinta Teknologi": 9,
    "Hobi Outdoor": 6,
    "Hobi Indoor": 5,
    "Mobilitas Tinggi": 10,
  };
  score += gayaHidupSkor[gayaHidup] || 5;

  const motivasiScore = {
    Gengsi: 10,
    "Kebutuhan Keluarga": 8,
    "Efisiensi BBM": 7,
    Keamanan: 6,
    Promo: 5,
  };
  score += motivasiScore[motivasi] || 5;

  if (Array.isArray(minat)) {
    score += Math.min(minat.length * 2, 10);
  }

  // ===== Perilaku =====
  const {
    frekuensiKontak = 0,
    responAwal = "",
    interaksiFavorit = "",
  } = prospek.perilaku || {};

  if (frekuensiKontak >= 5) score += 15;
  else if (frekuensiKontak >= 3) score += 10;
  else if (frekuensiKontak >= 1) score += 5;

  if (responAwal === "Cepat") score += 10;
  else if (responAwal === "Biasa") score += 5;
  else if (responAwal === "Lambat") score += 2;

  if (["WhatsApp", "Kunjungan"].includes(interaksiFavorit)) score += 5;

  // ===== Lingkungan =====
  const sumber = prospek.lingkungan?.sumber || "";

  const sumberScore = {
    Keluarga: 10,
    Teman: 8,
    "Media Sosial": 6,
    Iklan: 4,
    Komunitas: 7,
    "Marketplace Mobil": 5,
  };
  score += sumberScore[sumber] || 3;

  // ===== Konversi skor ke kategori =====
  let category = "Low";
  if (score >= 70) category = "Hot";
  else if (score >= 40) category = "Medium";

return { score, category };

}

module.exports = { predictScore };
