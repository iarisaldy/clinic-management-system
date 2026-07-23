-- Seed Data for Clinic EMR

-- Insert Master Data Medicines
INSERT INTO public.medicines (code, name, category, unit, sell_price, stock, min_stock) VALUES
('OBT-001', 'Paracetamol 500mg', 'Analgesik & Antipiretik', 'Tablet', 5000.00, 150, 20),
('OBT-002', 'Amoxicillin 500mg', 'Antibiotik', 'Kaplet', 12000.00, 80, 15),
('OBT-003', 'Cetirizine 10mg', 'Antihistamin', 'Tablet', 7500.00, 95, 10),
('OBT-004', 'OBH Combi Batuk Flu', 'Sirup Obat Batuk', 'Botol', 24000.00, 25, 5),
('OBT-005', 'Metformin 500mg', 'Antidiabetes', 'Tablet', 8000.00, 120, 20),
('OBT-006', 'Amlodipine 5mg', 'Antihipertensi', 'Tablet', 10000.00, 90, 15),
('OBT-007', 'Vitamin C 500mg (Esther C)', 'Suplemen', 'Strip', 15000.00, 6, 10), -- low stock demo
('OBT-008', 'Antasida Doen', 'Antasida', 'Tablet', 4500.00, 110, 15)
ON CONFLICT (code) DO NOTHING;

-- Insert Master Data Services / Tarif
INSERT INTO public.services (code, name, category, price) VALUES
('SRV-001', 'Konsultasi & Pemeriksaan Dokter Umum', 'Pemeriksaan', 50000.00),
('SRV-002', 'Pemeriksaan Gula Darah Sewaktu (GDS)', 'Laboratorium', 20000.00),
('SRV-003', 'Pemeriksaan Kolesterol', 'Laboratorium', 35000.00),
('SRV-004', 'Pemeriksaan Asam Urat', 'Laboratorium', 25000.00),
('SRV-005', 'Tindakan Pembersihan / Rawat Luka Light', 'Tindakan', 40000.00),
('SRV-006', 'Nebulizer Therapy', 'Tindakan', 60000.00)
ON CONFLICT (code) DO NOTHING;

-- Insert Sample Patients
INSERT INTO public.patients (id, nik, name, phone, dob, gender, address, allergies) VALUES
('11111111-1111-1111-1111-111111111111', '3273011508920001', 'Budi Santoso', '081234567890', '1992-08-15', 'L', 'Jl. Sukajadi No. 45, Bandung', 'Penicillin'),
('22222222-2222-2222-2222-222222222222', '3273022204880003', 'Siti Rahmawati', '085698765432', '1988-04-22', 'P', 'Jl. Merdeka No. 12, Bandung', 'Tidak ada'),
('33333333-3333-3333-3333-333333333333', '3273031011990005', 'Ahmad Rizky', '087811223344', '1999-11-10', 'L', 'Jl. Dago No. 88, Bandung', 'Debu & Udara Dingin')
ON CONFLICT (nik) DO NOTHING;
