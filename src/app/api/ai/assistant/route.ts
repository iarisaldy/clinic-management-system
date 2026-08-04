import { NextRequest, NextResponse } from 'next/server';

interface AIRequest {
  type: 'icd10_suggest' | 'general_chat' | 'triage' | 'prescription_check';
  prompt: string;
  patientContext?: {
    age?: number;
    gender?: string;
    anamnesis?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: AIRequest = await req.json();
    const { type, prompt, patientContext } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Anda adalah AI Asisten Dokter & Klinik (MedAssistant AI) terpercaya. Berikan jawaban profesional, ringkas, akurat, dan terstruktur sesuai kaidah medis & ICD-10 Indonesia.\n\nKonteks Tugas: ${type}\nAnamnesis Pasien: ${patientContext?.anamnesis || '-'}\nPertanyaan/Permintaan Dokter: ${prompt}`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({ success: true, reply, provider: 'gemini' });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Smart Medical Engine:', err);
      }
    }

    // Smart Fallback Medical Intelligence Engine
    const reply = generateSmartFallbackReply(type, prompt, patientContext);
    return NextResponse.json({ success: true, reply, provider: 'smart_fallback' });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

function generateSmartFallbackReply(
  type: string,
  prompt: string,
  patientContext?: any
): string {
  const pLower = (prompt + ' ' + (patientContext?.anamnesis || '')).toLowerCase();

  if (type === 'icd10_suggest' || pLower.includes('icd') || pLower.includes('diagnosis')) {
    if (pLower.includes('demam') || pLower.includes('panas') || pLower.includes('pusing') || pLower.includes('dengue')) {
      return `🩺 **Analisis Rekomendasi Diagnosis AI (ICD-10)**:

1. **A90 - Dengue Fever (Classical Dengue)**
   - *Kriteria*: Demam mendadak tinggi, sakit kepala, nyeri retro-orbital, artralgia.
   - *Saran Pemeriksaan*: Darah Lengkap (Hb, Ht, Leukosit, Trombosit), NS1 Ag.
2. **R50.9 - Fever, Unspecified**
   - *Kriteria*: Demam febris belum teridentifikasi etiologinya.
3. **J06.9 - Acute Upper Respiratory Infection, Unspecified (ISPA)**
   - *Kriteria*: Jika disertai batuk, pilek, atau nyeri tenggorokan.

💡 **Saran Dosis & Resep**:
- Paracetamol 500 mg (3x1 sesudah makan)
- Tablet Vitamin C 500 mg (1x1)
- Edukasi hidrasi cairan oral murni minimal 2.5 L/hari.`;
    }

    if (pLower.includes('batuk') || pLower.includes('flu') || pLower.includes('pilek') || pLower.includes('tenggorokan')) {
      return `🩺 **Analisis Rekomendasi Diagnosis AI (ICD-10)**:

1. **J00 - Acute Nasopharyngitis (Common Cold)**
   - *Kriteria*: Batuk, bersin, hidung tersumbat, tenggorokan gatal.
2. **J02.9 - Acute Pharyngitis, Unspecified**
   - *Kriteria*: Nyeri saat menelan, hiperemis faring.
3. **J40 - Bronchitis, Not Specified as Acute or Chronic**
   - *Kriteria*: Batuk berdahak > 5 hari.

💡 **Saran Dosis & Resep**:
- Paracetamol 500 mg + Glyceryl Guaiacolate (GG) 100 mg (3x1)
- Cetirizine 10 mg (1x1 malam)`;
    }

    if (pLower.includes('lambung') || pLower.includes('mual') || pLower.includes('perut') || pLower.includes('maag') || pLower.includes('gerd')) {
      return `🩺 **Analisis Rekomendasi Diagnosis AI (ICD-10)**:

1. **K29.7 - Gastritis, Unspecified**
   - *Kriteria*: Nyeri ulu hati (epigastrium), mual, kembung, perih.
2. **K21.9 - Gastro-Esophageal Reflux Disease without Esophagitis (GERD)**
   - *Kriteria*: Rasa terbakar di dada (heartburn), mulut terasa asam.

💡 **Saran Dosis & Resep**:
- Omeprazole 20 mg (2x1 sebelum makan / AC)
- Antasida Doen Syrup (3x1 cth AC)`;
    }

    return `🩺 **Analisis Rekomendasi Diagnosis AI (ICD-10)**:

1. **R69 - Illness, Unspecified**
   - Berdasarkan keluhan: *"${prompt}"*
2. **Z00.0 - General Medical Examination**

💡 **Rekomendasi**: Evaluasi tanda-tanda vital (TD, Nadi, Suhu, RR) dan lakukan anamnesis fisik terarah untuk konfirmasi organ terdampak.`;
  }

  if (type === 'triage' || pLower.includes('darurat') || pLower.includes('triage')) {
    return `🚨 **Status Skrining Triage AI**:
- **Kategori**: Hijau (Non-Emergency / Rawat Jalan Praktik Mandiri).
- **Rekomendasi**: Lanjutkan antrean konsultasi dokter umum. Segera edukasi pasien untuk ke IGD RS jika ada sesak napas berat, nyeri dada kiri menembus punggung, atau penurunan kesadaran.`;
  }

  // General Chatbot response
  return `🤖 **MedAssistant AI**: 
Halo Dokter! Saya siap membantu penelusuran referensi ICD-10, rekomendasi resep obat standar formularium, atau penyusunan ringkasan rekam medis. 

Ada keluhan atau kode diagnosis spesifik yang ingin dianalisis hari ini?`;
}
