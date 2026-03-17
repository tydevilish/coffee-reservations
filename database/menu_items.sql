-- ===== BeanBliss Coffee - Menu Items Table =====
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'coffee',
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  is_recommended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data with sample images
INSERT INTO menu_items (name, description, price, category, image_url, is_available, is_recommended) VALUES
('Espresso', 'เอสเปรสโซ่แท้ เข้มข้นจากเมล็ดกาแฟอาราบิก้า', 65, 'coffee', 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600&h=400&fit=crop', true, true),
('Americano', 'อเมริกาโน่ รสชาติกลมกล่อม เหมาะสำหรับคนชอบกาแฟดำ', 75, 'coffee', 'https://images.unsplash.com/photo-1551030173-122aabc4489c?w=600&h=400&fit=crop', true, false),
('Latte', 'ลาเต้ครีมมี่ นมสดผสมกาแฟอย่างลงตัว', 85, 'coffee', 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&h=400&fit=crop', true, true),
('Cappuccino', 'คาปูชิโน่ ฟองนมละเอียด โรยผงโกโก้', 85, 'coffee', 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&h=400&fit=crop', true, false),
('Mocha', 'มอคค่า ช็อกโกแลตผสมกาแฟ หวานกลมกล่อม', 95, 'coffee', 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=600&h=400&fit=crop', true, true),
('Cold Brew', 'โคลด์บรูว์ สกัดเย็น 12 ชั่วโมง รสชาตินุ่มลึก', 95, 'coffee', 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop', true, false),
('Matcha Latte', 'มัทฉะลาเต้ ชาเขียวญี่ปุ่นผสมนมสด', 90, 'non-coffee', 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&h=400&fit=crop', true, true),
('Chocolate', 'ช็อกโกแลตร้อน เข้มข้นจากโกโก้แท้', 85, 'non-coffee', 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=600&h=400&fit=crop', true, false),
('Thai Tea', 'ชาไทย รสชาติต้นตำรับ หอมหวาน', 70, 'non-coffee', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop', true, false),
('Croissant', 'ครัวซองค์เนยสด อบกรอบทุกวัน', 75, 'bakery', 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=600&h=400&fit=crop', true, true),
('Brownie', 'บราวนี่ช็อกโกแลต หนึบนุ่ม เข้มข้น', 85, 'bakery', 'https://images.unsplash.com/photo-1607920591413-4ec007e70023?w=600&h=400&fit=crop', true, false),
('Cheesecake', 'ชีสเค้กนิวยอร์ก ครีมชีสเนื้อแน่น', 120, 'bakery', 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd?w=600&h=400&fit=crop', true, true);
