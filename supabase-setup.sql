-- =============================================================
-- Devreleri Anla — Supabase kurulum SQL'i
-- Supabase Dashboard > SQL Editor > New Query > Yapıştır > Run
-- =============================================================

-- 1. Lisans tablosu
CREATE TABLE IF NOT EXISTS licenses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,          -- SHA-256 hash (client-side)
  device_id     TEXT,                   -- NULL = henüz cihaza bağlanmadı
  is_active     BOOLEAN DEFAULT TRUE,
  notes         TEXT DEFAULT '',
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Admin config tablosu (admin şifresi burada saklanır)
CREATE TABLE IF NOT EXISTS admin_config (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- 3. Admin şifresini ayarla
-- Önce SHA-256 hesapla: https://emn178.github.io/online-tools/sha256.html
-- Örnek: "admin1234" → hash'ini koy
-- Bunu mutlaka kendi şifrenizle değiştirin!
INSERT INTO admin_config (key, value)
VALUES ('admin_password_hash', 'BURAYA_ADMIN_SIFRENIZIN_SHA256_HASHINI_YAZIN')
ON CONFLICT (key) DO NOTHING;

-- 4. RLS aktif et (tablolara direkt erişim kapat)
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS deny_all_licenses ON licenses;
DROP POLICY IF EXISTS deny_all_config ON admin_config;

CREATE POLICY deny_all_licenses ON licenses FOR ALL USING (false);
CREATE POLICY deny_all_config ON admin_config FOR ALL USING (false);

-- 5. Kullanıcı giriş doğrulama fonksiyonu
CREATE OR REPLACE FUNCTION verify_login(p_username TEXT, p_hash TEXT)
RETURNS TABLE (success BOOLEAN, device_id TEXT, is_active BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    (l.password_hash = p_hash) AS success,
    l.device_id,
    l.is_active
  FROM licenses l
  WHERE l.username = p_username;
END;
$$;

-- 6. Cihaz bağlama
CREATE OR REPLACE FUNCTION bind_device(p_username TEXT, p_hash TEXT, p_device_id TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (password_hash = p_hash) INTO v_valid FROM licenses WHERE username = p_username;
  IF v_valid THEN
    UPDATE licenses SET device_id = p_device_id WHERE username = p_username;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

-- 7. Cihaz sıfırlama (kullanıcı kendi cihazını değiştirmek istediğinde)
CREATE OR REPLACE FUNCTION reset_device(p_username TEXT, p_hash TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_valid BOOLEAN;
BEGIN
  SELECT (password_hash = p_hash) INTO v_valid FROM licenses WHERE username = p_username;
  IF v_valid THEN
    UPDATE licenses SET device_id = NULL WHERE username = p_username;
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

-- 8. Admin: kullanıcı listesi
CREATE OR REPLACE FUNCTION admin_get_users(p_admin_hash TEXT)
RETURNS TABLE (id UUID, username TEXT, device_id TEXT, is_active BOOLEAN, notes TEXT, created_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_admin_hash TEXT;
BEGIN
  SELECT value INTO v_admin_hash FROM admin_config WHERE key = 'admin_password_hash';
  IF v_admin_hash IS DISTINCT FROM p_admin_hash THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  RETURN QUERY
  SELECT l.id, l.username, l.device_id, l.is_active, l.notes, l.created_at
  FROM licenses l ORDER BY l.created_at DESC;
END;
$$;

-- 9. Admin: kullanıcı oluştur
CREATE OR REPLACE FUNCTION admin_create_user(
  p_admin_hash TEXT,
  p_username   TEXT,
  p_password_hash TEXT,
  p_notes      TEXT DEFAULT ''
) RETURNS JSON LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_admin_hash TEXT;
BEGIN
  SELECT value INTO v_admin_hash FROM admin_config WHERE key = 'admin_password_hash';
  IF v_admin_hash IS DISTINCT FROM p_admin_hash THEN
    RETURN json_build_object('success', false, 'error', 'Yetkisiz erişim');
  END IF;
  INSERT INTO licenses (username, password_hash, notes)
  VALUES (p_username, p_password_hash, p_notes);
  RETURN json_build_object('success', true);
EXCEPTION WHEN unique_violation THEN
  RETURN json_build_object('success', false, 'error', 'Bu kullanıcı adı zaten kullanımda');
END;
$$;

-- 10. Admin: cihaz sıfırla
CREATE OR REPLACE FUNCTION admin_reset_device(p_admin_hash TEXT, p_username TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_admin_hash TEXT;
BEGIN
  SELECT value INTO v_admin_hash FROM admin_config WHERE key = 'admin_password_hash';
  IF v_admin_hash IS DISTINCT FROM p_admin_hash THEN RETURN FALSE; END IF;
  UPDATE licenses SET device_id = NULL WHERE username = p_username;
  RETURN TRUE;
END;
$$;

-- 11. Admin: aktif/pasif yap
CREATE OR REPLACE FUNCTION admin_set_active(p_admin_hash TEXT, p_username TEXT, p_active BOOLEAN)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_admin_hash TEXT;
BEGIN
  SELECT value INTO v_admin_hash FROM admin_config WHERE key = 'admin_password_hash';
  IF v_admin_hash IS DISTINCT FROM p_admin_hash THEN RETURN FALSE; END IF;
  UPDATE licenses SET is_active = p_active WHERE username = p_username;
  RETURN TRUE;
END;
$$;

-- 12. Admin: kullanıcı sil
CREATE OR REPLACE FUNCTION admin_delete_user(p_admin_hash TEXT, p_username TEXT)
RETURNS BOOLEAN LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_admin_hash TEXT;
BEGIN
  SELECT value INTO v_admin_hash FROM admin_config WHERE key = 'admin_password_hash';
  IF v_admin_hash IS DISTINCT FROM p_admin_hash THEN RETURN FALSE; END IF;
  DELETE FROM licenses WHERE username = p_username;
  RETURN TRUE;
END;
$$;

-- 13. Anon rolüne fonksiyonları çalıştırma izni ver
GRANT EXECUTE ON FUNCTION verify_login TO anon;
GRANT EXECUTE ON FUNCTION bind_device TO anon;
GRANT EXECUTE ON FUNCTION reset_device TO anon;
GRANT EXECUTE ON FUNCTION admin_get_users TO anon;
GRANT EXECUTE ON FUNCTION admin_create_user TO anon;
GRANT EXECUTE ON FUNCTION admin_reset_device TO anon;
GRANT EXECUTE ON FUNCTION admin_set_active TO anon;
GRANT EXECUTE ON FUNCTION admin_delete_user TO anon;
