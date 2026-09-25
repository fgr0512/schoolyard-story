export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      alunos: {
        Row: {
          ativo: boolean
          cpf: string | null
          created_at: string
          data_nascimento: string
          endereco: string | null
          id: string
          matricula: string
          nome: string
          responsavel_id: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento: string
          endereco?: string | null
          id?: string
          matricula: string
          nome: string
          responsavel_id?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cpf?: string | null
          created_at?: string
          data_nascimento?: string
          endereco?: string | null
          id?: string
          matricula?: string
          nome?: string
          responsavel_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alunos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      anos_letivos: {
        Row: {
          ano: number
          ativo: boolean
          created_at: string
          fim: string
          id: string
          inicio: string
          updated_at: string
        }
        Insert: {
          ano: number
          ativo?: boolean
          created_at?: string
          fim: string
          id?: string
          inicio: string
          updated_at?: string
        }
        Update: {
          ano?: number
          ativo?: boolean
          created_at?: string
          fim?: string
          id?: string
          inicio?: string
          updated_at?: string
        }
        Relationships: []
      }
      comunicados: {
        Row: {
          aluno_id: string
          canal: string
          created_at: string
          enviado_em: string | null
          enviado_por: string
          id: string
          mensagem: string
          responsavel_id: string
          status: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          canal?: string
          created_at?: string
          enviado_em?: string | null
          enviado_por: string
          id?: string
          mensagem: string
          responsavel_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          canal?: string
          created_at?: string
          enviado_em?: string | null
          enviado_por?: string
          id?: string
          mensagem?: string
          responsavel_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "comunicados_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_enviado_por_fkey"
            columns: ["enviado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comunicados_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinas: {
        Row: {
          carga_horaria: number
          created_at: string
          id: string
          nome: string
          updated_at: string
        }
        Insert: {
          carga_horaria?: number
          created_at?: string
          id?: string
          nome: string
          updated_at?: string
        }
        Update: {
          carga_horaria?: number
          created_at?: string
          id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: []
      }
      documentos: {
        Row: {
          aluno_id: string
          conteudo: Json
          created_at: string
          emitido_em: string
          emitido_por: string
          id: string
          motivo: string
          responsavel_id: string | null
          tipo: Database["public"]["Enums"]["document_type"]
          updated_at: string
        }
        Insert: {
          aluno_id: string
          conteudo?: Json
          created_at?: string
          emitido_em?: string
          emitido_por: string
          id?: string
          motivo: string
          responsavel_id?: string | null
          tipo: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          conteudo?: Json
          created_at?: string
          emitido_em?: string
          emitido_por?: string
          id?: string
          motivo?: string
          responsavel_id?: string | null
          tipo?: Database["public"]["Enums"]["document_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_emitido_por_fkey"
            columns: ["emitido_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "responsaveis"
            referencedColumns: ["id"]
          },
        ]
      }
      equipe: {
        Row: {
          ativo: boolean
          cargo: string | null
          cpf: string | null
          created_at: string
          email: string | null
          formacao: string | null
          id: string
          nome: string
          telefone: string | null
          tipo: Database["public"]["Enums"]["staff_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ativo?: boolean
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          formacao?: string | null
          id?: string
          nome: string
          telefone?: string | null
          tipo: Database["public"]["Enums"]["staff_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ativo?: boolean
          cargo?: string | null
          cpf?: string | null
          created_at?: string
          email?: string | null
          formacao?: string | null
          id?: string
          nome?: string
          telefone?: string | null
          tipo?: Database["public"]["Enums"]["staff_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "equipe_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      faltas: {
        Row: {
          created_at: string
          data: string
          disciplina_id: string
          id: string
          justificativa: string | null
          lancado_por: string
          matricula_id: string
          quantidade: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          disciplina_id: string
          id?: string
          justificativa?: string | null
          lancado_por: string
          matricula_id: string
          quantidade?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          disciplina_id?: string
          id?: string
          justificativa?: string | null
          lancado_por?: string
          matricula_id?: string
          quantidade?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faltas_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faltas_lancado_por_fkey"
            columns: ["lancado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "faltas_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      matriculas: {
        Row: {
          aluno_id: string
          created_at: string
          data_matricula: string
          id: string
          media_final: number | null
          status: Database["public"]["Enums"]["enrollment_status"]
          total_faltas: number
          turma_id: string
          updated_at: string
        }
        Insert: {
          aluno_id: string
          created_at?: string
          data_matricula?: string
          id?: string
          media_final?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          total_faltas?: number
          turma_id: string
          updated_at?: string
        }
        Update: {
          aluno_id?: string
          created_at?: string
          data_matricula?: string
          id?: string
          media_final?: number | null
          status?: Database["public"]["Enums"]["enrollment_status"]
          total_faltas?: number
          turma_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matriculas_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matriculas_turma_id_fkey"
            columns: ["turma_id"]
            isOneToOne: false
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      notas: {
        Row: {
          created_at: string
          disciplina_id: string
          id: string
          lancado_por: string
          matricula_id: string
          nota: number
          periodo: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          disciplina_id: string
          id?: string
          lancado_por: string
          matricula_id: string
          nota: number
          periodo: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          disciplina_id?: string
          id?: string
          lancado_por?: string
          matricula_id?: string
          nota?: number
          periodo?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notas_disciplina_id_fkey"
            columns: ["disciplina_id"]
            isOneToOne: false
            referencedRelation: "disciplinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_lancado_por_fkey"
            columns: ["lancado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notas_matricula_id_fkey"
            columns: ["matricula_id"]
            isOneToOne: false
            referencedRelation: "matriculas"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          telefone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      responsaveis: {
        Row: {
          aceita_whatsapp: boolean
          cpf: string | null
          created_at: string
          email: string | null
          id: string
          nome: string
          parentesco: string
          telefone: string
          updated_at: string
        }
        Insert: {
          aceita_whatsapp?: boolean
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          parentesco: string
          telefone: string
          updated_at?: string
        }
        Update: {
          aceita_whatsapp?: boolean
          cpf?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          parentesco?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      series: {
        Row: {
          created_at: string
          id: string
          nome: string
          ordem: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          ordem: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
          updated_at?: string
        }
        Relationships: []
      }
      turmas: {
        Row: {
          ano_letivo_id: string
          created_at: string
          id: string
          nome: string
          serie_id: string
          turno: string
          updated_at: string
        }
        Insert: {
          ano_letivo_id: string
          created_at?: string
          id?: string
          nome: string
          serie_id: string
          turno: string
          updated_at?: string
        }
        Update: {
          ano_letivo_id?: string
          created_at?: string
          id?: string
          nome?: string
          serie_id?: string
          turno?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "turmas_ano_letivo_id_fkey"
            columns: ["ano_letivo_id"]
            isOneToOne: false
            referencedRelation: "anos_letivos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "turmas_serie_id_fkey"
            columns: ["serie_id"]
            isOneToOne: false
            referencedRelation: "series"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin" | "professor" | "funcionario"
      document_type: "historico" | "convocacao" | "declaracao_comparecimento"
      enrollment_status:
        | "cursando"
        | "aprovado"
        | "reprovado"
        | "transferido"
        | "concluido"
      staff_type: "professor" | "funcionario"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "professor", "funcionario"],
      document_type: ["historico", "convocacao", "declaracao_comparecimento"],
      enrollment_status: [
        "cursando",
        "aprovado",
        "reprovado",
        "transferido",
        "concluido",
      ],
      staff_type: ["professor", "funcionario"],
    },
  },
} as const
