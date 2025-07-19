-- =====================================================
-- CONFIGURAÇÃO DO SUPABASE PARA DRCal API
-- =====================================================

-- Tabela de agendamentos
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  doctor_id UUID NOT NULL,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de fila de espera
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  patient_email VARCHAR(255) NOT NULL,
  preferred_date DATE,
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários (para API keys)
CREATE TABLE IF NOT EXISTS users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- View para slots disponíveis
CREATE OR REPLACE VIEW available_slots AS
SELECT 
  date_trunc('day', appointment_date)::date as date,
  date_trunc('hour', appointment_date)::time as time,
  doctor_id,
  COUNT(*) < 1 as available
FROM appointments
WHERE appointment_date >= NOW()
  AND status != 'cancelled'
GROUP BY date_trunc('day', appointment_date)::date, 
         date_trunc('hour', appointment_date)::time, 
         doctor_id;

-- Função RPC para advisory lock
CREATE OR REPLACE FUNCTION get_advisory_lock(lock_key TEXT)
RETURNS JSON AS $$
DECLARE
  lock_id BIGINT;
  result JSON;
BEGIN
  -- Converte a chave em um número para o advisory lock
  lock_id := abs(('x' || substr(md5(lock_key), 1, 16))::bit(64)::bigint);
  
  -- Tenta obter o lock
  IF pg_try_advisory_lock(lock_id) THEN
    result := json_build_object('locked', true, 'lock_id', lock_id);
  ELSE
    result := json_build_object('locked', false, 'lock_id', lock_id);
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para liberar advisory lock
CREATE OR REPLACE FUNCTION release_advisory_lock(lock_key TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  lock_id BIGINT;
BEGIN
  -- Converte a chave em um número para o advisory lock
  lock_id := abs(('x' || substr(md5(lock_key), 1, 16))::bit(64)::bigint);
  
  -- Libera o lock
  RETURN pg_advisory_unlock(lock_id);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger na tabela appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger na tabela users
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(patient_email);
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(patient_email);
CREATE INDEX IF NOT EXISTS idx_waitlist_date ON waitlist(preferred_date);
CREATE INDEX IF NOT EXISTS idx_users_api_key ON users(api_key);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- Políticas RLS (Row Level Security) - Descomente se necessário
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Exemplo de política RLS para appointments (ajuste conforme necessário)
-- CREATE POLICY "Users can view their own appointments" ON appointments
--   FOR SELECT USING (auth.uid()::text = doctor_id::text);

-- CREATE POLICY "Users can insert appointments" ON appointments
--   FOR INSERT WITH CHECK (true);

-- CREATE POLICY "Users can update their own appointments" ON appointments
--   FOR UPDATE USING (auth.uid()::text = doctor_id::text);

-- Exemplo de política RLS para waitlist
-- CREATE POLICY "Users can view waitlist" ON waitlist
--   FOR SELECT USING (true);

-- CREATE POLICY "Users can insert into waitlist" ON waitlist
--   FOR INSERT WITH CHECK (true);

-- =====================================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- =====================================================

-- Inserir alguns agendamentos de exemplo
INSERT INTO appointments (patient_name, patient_email, appointment_date, doctor_id, status, notes) VALUES
('João Silva', 'joao.silva@email.com', NOW() + INTERVAL '1 day', 'd123e4567-e89b-12d3-a456-426614174000', 'scheduled', 'Consulta de rotina'),
('Maria Santos', 'maria.santos@email.com', NOW() + INTERVAL '2 days', 'd123e4567-e89b-12d3-a456-426614174000', 'confirmed', 'Retorno'),
('Pedro Costa', 'pedro.costa@email.com', NOW() + INTERVAL '3 days', 'd123e4567-e89b-12d3-a456-426614174000', 'scheduled', 'Primeira consulta')
ON CONFLICT DO NOTHING;

-- Inserir alguns pacientes na fila de espera
INSERT INTO waitlist (patient_name, patient_email, preferred_date, phone, notes) VALUES
('Ana Oliveira', 'ana.oliveira@email.com', CURRENT_DATE + INTERVAL '1 week', '(11) 99999-9999', 'Preferência por manhã'),
('Carlos Lima', 'carlos.lima@email.com', CURRENT_DATE + INTERVAL '2 weeks', '(11) 88888-8888', 'Urgente')
ON CONFLICT DO NOTHING;

-- =====================================================
-- CONFIGURAÇÃO DE WEBHOOKS (FAZER NO DASHBOARD DO SUPABASE)
-- =====================================================

/*
Para configurar webhooks no Supabase:

1. Vá para o Dashboard do Supabase
2. Navegue para Database > Webhooks
3. Crie webhooks para as seguintes tabelas:

WEBHOOK 1:
- Nome: appointments_webhook
- Tabela: appointments
- Eventos: INSERT, UPDATE, DELETE
- URL: http://seu-dominio/webhooks/supabase
- Método: POST

WEBHOOK 2:
- Nome: waitlist_webhook
- Tabela: waitlist
- Eventos: INSERT
- URL: http://seu-dominio/webhooks/supabase
- Método: POST

WEBHOOK 3:
- Nome: auth_users_webhook
- Tabela: auth.users
- Eventos: INSERT
- URL: http://seu-dominio/webhooks/supabase
- Método: POST

4. Configure autenticação se necessário
5. Teste os webhooks
*/

-- =====================================================
-- VERIFICAÇÃO DA CONFIGURAÇÃO
-- =====================================================

-- Verificar se as tabelas foram criadas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('appointments', 'waitlist');

-- Verificar se a view foi criada
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' 
AND table_name = 'available_slots';

-- Verificar se as funções foram criadas
SELECT routine_name FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('get_advisory_lock', 'release_advisory_lock', 'update_updated_at_column');

-- Testar a função de advisory lock
SELECT get_advisory_lock('test_lock');

-- Verificar slots disponíveis
SELECT * FROM available_slots LIMIT 5; 