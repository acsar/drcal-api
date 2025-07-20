-- ============================================================
-- DrCal - Sistema Open Source de Agendamento para Profissionais de Saúde
-- ============================================================
-- Este arquivo contém toda a estrutura do banco de dados necessária
-- para o funcionamento do sistema DrCal.
--
-- AUTOR: DrCal Team
-- VERSÃO: 1.0
-- DESCRIÇÃO: Script de inicialização do banco de dados Supabase
-- ============================================================
--
-- 🚀 COMO EXECUTAR ESTE SCRIPT:
-- ============================================================
-- 1. Acesse o painel do Supabase (https://supabase.com/dashboard)
-- 2. Selecione seu projeto
-- 3. Vá para "SQL Editor" no menu lateral
-- 4. Clique em "New query"
-- 5. Cole TODO o conteúdo deste arquivo no editor (Ctrl+A, Ctrl+C, Ctrl+V)
-- 6. Clique em "Run" para executar tudo de uma vez
--
-- 💡 DICA: Você pode executar todo o script de uma vez!
-- O Supabase suporta múltiplos comandos SQL em uma única execução.
--
-- ⚠️  IMPORTANTE:
-- - Execute este script apenas UMA VEZ
-- - Faça backup do seu banco antes de executar (se já tiver dados)
-- - Certifique-se de que está no projeto correto do Supabase
--
-- 📋 O QUE ESTE SCRIPT FAZ:
-- - Cria todas as tabelas necessárias
-- - Configura triggers e funções
-- - Estabelece relacionamentos entre tabelas
-- - Configura índices para performance
-- ============================================================

-- ============================================================
-- FUNÇÕES AUXILIARES DO SISTEMA
-- ============================================================

-- Função para atualizar automaticamente o campo updated_at
-- Esta função é usada em triggers para manter a data de atualização
-- sempre atualizada em todas as tabelas
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Função para criar usuário automaticamente quando um novo usuário
-- é registrado no sistema de autenticação do Supabase
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Cria automaticamente um registro na tabela users com uma API key única
  INSERT INTO public.users (user_id, api_key)
  VALUES (NEW.id, gen_random_uuid()::text);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER;

-- ============================================================
-- TRIGGERS DO SISTEMA
-- ============================================================

-- Trigger que executa automaticamente quando um novo usuário é criado
-- no sistema de autenticação do Supabase
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- TABELAS PRINCIPAIS DO SISTEMA
-- ============================================================

-- ============================================================
-- 1. TABELA: users (Usuários do Sistema)
-- ============================================================
-- Armazena informações dos usuários do sistema
-- Cada usuário tem uma API key única para autenticação
CREATE TABLE IF NOT EXISTS public.users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  api_key TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 2. TABELA: professionals (Profissionais de Saúde)
-- ============================================================
-- Armazena informações dos médicos e outros profissionais de saúde
-- que utilizam o sistema para agendamentos
CREATE TABLE IF NOT EXISTS public.professionals (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- Nome completo do profissional
  specialty TEXT NULL,                   -- Especialidade médica
  slug TEXT NOT NULL,                    -- URL amigável (ex: dr-joao-silva)
  crm TEXT NULL,                         -- Número do CRM (Conselho Regional de Medicina)
  rqe TEXT NULL,                         -- Número do RQE (Registro de Qualificação de Especialista)
  img_url TEXT NULL,                     -- URL da foto do profissional
  user_id UUID NOT NULL,                     -- Referência ao usuário do sistema
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT professionals_pkey PRIMARY KEY (id),
  CONSTRAINT professionals_slug_key UNIQUE (slug),
  CONSTRAINT professionals_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id)
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_professionals_updated_at
BEFORE UPDATE ON public.professionals
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 3. TABELA: calendars (Calendários de Agendamento)
-- ============================================================
-- Cada profissional pode ter múltiplos calendários
-- para diferentes tipos de consulta ou locais de atendimento
CREATE TABLE IF NOT EXISTS public.calendars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL,         -- Profissional responsável pelo calendário
  name TEXT NOT NULL,                    -- Nome do calendário (ex: "Consultório Principal")
  description TEXT,                      -- Descrição do calendário
  color TEXT,                            -- Cor para identificação visual
  tz TEXT NOT NULL DEFAULT 'America/Sao_Paulo',  -- Fuso horário do calendário
  slot_duration_minutes INTEGER NOT NULL DEFAULT 30,  -- Duração padrão dos horários (minutos)
  break_between_slots_minutes INTEGER NOT NULL DEFAULT 0,  -- Intervalo entre horários (minutos)
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT calendars_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE
);

-- Índice para melhorar performance de consultas por profissional
CREATE INDEX idx_calendars_professional_id ON public.calendars(professional_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendars
BEFORE UPDATE ON public.calendars
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 4. TABELA: calendar_users (Usuários que Gerenciam Calendários)
-- ============================================================
-- Permite que múltiplos usuários gerenciem um mesmo calendário
-- com diferentes níveis de permissão (admin, read-only, etc.)
CREATE TABLE IF NOT EXISTS public.calendar_users (
  calendar_id UUID NOT NULL,             -- Calendário
  user_id UUID NOT NULL,                 -- Usuário que gerencia o calendário
  role TEXT DEFAULT 'admin',             -- Papel do usuário (admin, read-only, etc.)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT calendar_users_pkey PRIMARY KEY (calendar_id, user_id),
  CONSTRAINT calendar_users_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE CASCADE,
  CONSTRAINT calendar_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Índices para melhorar performance
CREATE INDEX idx_calendar_users_calendar_id ON public.calendar_users(calendar_id);
CREATE INDEX idx_calendar_users_user_id ON public.calendar_users(user_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendar_users
BEFORE UPDATE ON public.calendar_users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 5. TABELA: calendar_working_hours (Horários de Funcionamento)
-- ============================================================
-- Define os horários de funcionamento de cada calendário
-- por dia da semana (0=domingo, 1=segunda, ..., 6=sábado)
CREATE TABLE IF NOT EXISTS public.calendar_working_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL,             -- Calendário ao qual pertence o horário
  weekday INTEGER NOT NULL,              -- Dia da semana (0-6)
  start_time TIME WITHOUT TIME ZONE NOT NULL,  -- Horário de início
  end_time TIME WITHOUT TIME ZONE NOT NULL,    -- Horário de fim
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT calendar_working_hours_pkey PRIMARY KEY (id),
  CONSTRAINT unique_calendar_day UNIQUE (calendar_id, weekday, start_time, end_time),
  CONSTRAINT calendar_working_hours_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE CASCADE,
  CONSTRAINT calendar_working_hours_weekday_check CHECK (weekday >= 0 AND weekday <= 6)
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendar_working_hours
BEFORE UPDATE ON public.calendar_working_hours
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 6. TABELA: calendar_manual_blocks (Bloqueios Manuais)
-- ============================================================
-- Permite bloquear horários específicos no calendário
-- (ex: férias, feriados, compromissos pessoais)
CREATE TABLE IF NOT EXISTS public.calendar_manual_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL,             -- Calendário onde será aplicado o bloqueio
  start_datetime TIMESTAMPTZ NOT NULL,   -- Data/hora de início do bloqueio
  end_datetime TIMESTAMPTZ NOT NULL,     -- Data/hora de fim do bloqueio
  reason TEXT NULL,                      -- Motivo do bloqueio
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT manual_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT calendar_manual_blocks_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendar_manual_blocks
BEFORE UPDATE ON public.calendar_manual_blocks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 7. TABELA: professional_insurances (Convênios Médicos)
-- ============================================================
-- Lista de convênios médicos aceitos por cada profissional
CREATE TABLE IF NOT EXISTS public.professional_insurances (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL,         -- Profissional que aceita o convênio
  name TEXT NOT NULL,                    -- Nome do convênio (ex: "Unimed", "Amil")
  description TEXT NULL,                 -- Descrição adicional do convênio
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT insurances_pkey PRIMARY KEY (id),
  CONSTRAINT insurances_name_key UNIQUE(professional_id, name),
  CONSTRAINT insurances_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_professional_insurances_updated_at
  BEFORE UPDATE ON public.professional_insurances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 8. TABELA: calendar_insurances (Convênios por Calendário)
-- ============================================================
-- Relaciona quais convênios são aceitos em cada calendário
-- Permite que diferentes calendários aceitem convênios diferentes
CREATE TABLE IF NOT EXISTS public.calendar_insurances (
  calendar_id UUID NOT NULL,             -- Calendário
  insurance_id UUID NOT NULL,            -- Convênio aceito
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT calendar_insurances_pkey PRIMARY KEY (calendar_id, insurance_id),
  CONSTRAINT calendar_insurances_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE CASCADE,
  CONSTRAINT calendar_insurances_insurance_id_fkey FOREIGN KEY (insurance_id) REFERENCES public.professional_insurances (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Índices para melhorar performance
CREATE INDEX idx_calendar_insurances_calendar_id ON public.calendar_insurances(calendar_id);
CREATE INDEX idx_calendar_insurances_insurance_id ON public.calendar_insurances(insurance_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendar_insurances
BEFORE UPDATE ON public.calendar_insurances
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 9. TABELA: calendar_custom_fields (Campos Personalizados)
-- ============================================================
-- Permite adicionar campos personalizados aos agendamentos
-- (ex: sintomas, histórico médico, observações)
CREATE TABLE IF NOT EXISTS public.calendar_custom_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID REFERENCES public.calendars(id) ON DELETE CASCADE,
  name TEXT NOT NULL,                    -- Nome interno do campo
  label TEXT NOT NULL,                   -- Rótulo exibido para o usuário
  type TEXT NOT NULL,                    -- Tipo do campo (text, number, select, etc.)
  required BOOLEAN NOT NULL DEFAULT FALSE,  -- Se o campo é obrigatório
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice para melhorar performance
CREATE INDEX idx_calendar_custom_fields_calendar_id ON public.calendar_custom_fields(calendar_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_calendar_custom_fields
BEFORE UPDATE ON public.calendar_custom_fields
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 10. TABELA: appointments (Agendamentos)
-- ============================================================
-- Armazena todos os agendamentos realizados no sistema
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL REFERENCES public.calendars(id) ON DELETE CASCADE,
  professional_id UUID NOT NULL,         -- Profissional responsável
  patient_name TEXT NOT NULL,            -- Nome do paciente
  patient_phone TEXT,                    -- Telefone do paciente
  start_time TIMESTAMPTZ NOT NULL,       -- Data/hora de início da consulta
  end_time TIMESTAMPTZ NOT NULL,         -- Data/hora de fim da consulta
  agent TEXT,                            -- Quem fez o agendamento (sistema, recepcionista, etc.)
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT appointments_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE,
  CONSTRAINT appointments_time_check CHECK (end_time > start_time)  -- Validação de horário
);

-- Índices para melhorar performance
CREATE INDEX idx_appointments_calendar_id ON public.appointments(calendar_id);
CREATE INDEX idx_appointments_professional_id ON public.appointments(professional_id);

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_appointments
BEFORE UPDATE ON public.appointments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 11. TABELA: appointment_custom_field_values (Valores dos Campos Personalizados)
-- ============================================================
-- Armazena os valores preenchidos nos campos personalizados
-- de cada agendamento
CREATE TABLE IF NOT EXISTS public.appointment_custom_field_values (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL,          -- Agendamento
  field_id UUID NOT NULL,                -- Campo personalizado
  value TEXT NULL,                       -- Valor preenchido
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT appointment_custom_field_values_pkey PRIMARY KEY (id),
  CONSTRAINT appointment_custom_field_values_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments (id) ON DELETE CASCADE,
  CONSTRAINT appointment_custom_field_values_field_id_fkey FOREIGN KEY (field_id) REFERENCES public.calendar_custom_fields (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_appointment_custom_field_values
BEFORE UPDATE ON public.appointment_custom_field_values
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 12. TABELA: waitlist (Lista de Espera)
-- ============================================================
-- Permite que pacientes se inscrevam em uma lista de espera
-- quando não há horários disponíveis
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  calendar_id UUID NOT NULL,             -- Calendário da lista de espera
  professional_id UUID NOT NULL,         -- Profissional
  patient_name TEXT NOT NULL,            -- Nome do paciente
  patient_birthdate DATE NULL,           -- Data de nascimento
  patient_phone TEXT NULL,               -- Telefone do paciente
  preferred_date DATE NULL,              -- Data preferencial
  preferred_period TEXT NULL,            -- Período preferencial (morning, afternoon, evening)
  insurance_name TEXT NULL,              -- Convênio do paciente
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT waitlist_pkey PRIMARY KEY (id),
  CONSTRAINT waitlist_calendar_id_fkey FOREIGN KEY (calendar_id) REFERENCES public.calendars (id) ON DELETE CASCADE,
  CONSTRAINT waitlist_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE,
  CONSTRAINT waitlist_preferred_period_check CHECK (
    preferred_period IS NULL
    OR preferred_period = ANY (
      ARRAY[
        'morning'::text,
        'afternoon'::text,
        'evening'::text
      ]
    )
  )
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON public.waitlist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 13. TABELA: holiday_blocks (Bloqueios de Feriados)
-- ============================================================
-- Permite definir feriados e datas especiais onde não há atendimento
CREATE TABLE IF NOT EXISTS public.holiday_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  professional_id UUID NULL,             -- Profissional (NULL = todos os profissionais)
  date DATE NOT NULL,                    -- Data do feriado
  description TEXT NULL,                 -- Descrição do feriado
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT holiday_blocks_pkey PRIMARY KEY (id),
  CONSTRAINT holiday_blocks_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER set_updated_at_holiday_blocks
BEFORE UPDATE ON public.holiday_blocks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- 14. TABELA: professional_services (Serviços dos Profissionais)
-- ============================================================
-- Define os tipos de serviço oferecidos por cada profissional
-- e suas respectivas durações
CREATE TABLE IF NOT EXISTS public.professional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  professional_id UUID NOT NULL,         -- Profissional
  service_name TEXT NOT NULL,            -- Nome do serviço (ex: "Consulta", "Retorno")
  duration_minutes INTEGER NOT NULL,     -- Duração em minutos
  is_deleted BOOLEAN DEFAULT FALSE,      -- Soft delete
  created_at TIMESTAMPTZ NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NULL DEFAULT now(),
  CONSTRAINT professional_services_pkey PRIMARY KEY (id),
  CONSTRAINT professional_services_professional_id_fkey FOREIGN KEY (professional_id) REFERENCES public.professionals (id) ON DELETE CASCADE
) TABLESPACE pg_default;

-- Trigger para atualizar automaticamente o campo updated_at
CREATE TRIGGER update_professional_services_updated_at
  BEFORE UPDATE ON public.professional_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- FIM DO SCRIPT DE INICIALIZAÇÃO
-- ============================================================
-- 
-- ✅ SCRIPT EXECUTADO COM SUCESSO!
-- 
-- Este script criou toda a estrutura necessária para o funcionamento
-- do sistema DrCal. Após executar este script, o banco de dados
-- estará pronto para receber dados e permitir o funcionamento
-- completo do sistema open source de agendamento para profissionais de saúde.
--
-- 🎯 PRÓXIMOS PASSOS:
-- 1. Configure as variáveis de ambiente no arquivo .env
-- 2. Inicie a API com: npm run dev
-- 3. Acesse a documentação em: http://localhost:3000/docs
-- 4. Crie uma conta no Supabase Auth para obter sua API key
--
-- 📚 Para mais informações, consulte a documentação do projeto.
-- ============================================================

