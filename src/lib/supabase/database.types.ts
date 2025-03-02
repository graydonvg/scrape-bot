export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      executionPhases: {
        Row: {
          completedAt: string | null;
          creditsConsumed: number | null;
          executionPhaseId: number;
          inputs: Json | null;
          node: Json;
          outputs: Json | null;
          phase: number;
          startedAt: string | null;
          status: Database["public"]["Enums"]["ExecutionPhaseStatus"];
          taskName: string;
          userId: string;
          workflowExecutionId: number;
        };
        Insert: {
          completedAt?: string | null;
          creditsConsumed?: number | null;
          executionPhaseId?: number;
          inputs?: Json | null;
          node: Json;
          outputs?: Json | null;
          phase: number;
          startedAt?: string | null;
          status: Database["public"]["Enums"]["ExecutionPhaseStatus"];
          taskName: string;
          userId?: string;
          workflowExecutionId: number;
        };
        Update: {
          completedAt?: string | null;
          creditsConsumed?: number | null;
          executionPhaseId?: number;
          inputs?: Json | null;
          node?: Json;
          outputs?: Json | null;
          phase?: number;
          startedAt?: string | null;
          status?: Database["public"]["Enums"]["ExecutionPhaseStatus"];
          taskName?: string;
          userId?: string;
          workflowExecutionId?: number;
        };
        Relationships: [
          {
            foreignKeyName: "executionPhase_workflowExecutionId_fkey";
            columns: ["workflowExecutionId"];
            isOneToOne: false;
            referencedRelation: "workflowExecutions";
            referencedColumns: ["workflowExecutionId"];
          },
        ];
      };
      users: {
        Row: {
          email: string;
          firstName: string | null;
          lastName: string | null;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          email: string;
          firstName?: string | null;
          lastName?: string | null;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          email?: string;
          firstName?: string | null;
          lastName?: string | null;
          updatedAt?: string;
          userId?: string;
        };
        Relationships: [];
      };
      workflowExecutions: {
        Row: {
          completedAt: string | null;
          createdAt: string;
          creditsConsumed: number;
          startedAt: string;
          status: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId: string;
          workflowExecutionId: number;
          workflowId: number;
        };
        Insert: {
          completedAt?: string | null;
          createdAt?: string;
          creditsConsumed: number;
          startedAt: string;
          status: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId?: string;
          workflowExecutionId?: number;
          workflowId: number;
        };
        Update: {
          completedAt?: string | null;
          createdAt?: string;
          creditsConsumed?: number;
          startedAt?: string;
          status?: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger?: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId?: string;
          workflowExecutionId?: number;
          workflowId?: number;
        };
        Relationships: [
          {
            foreignKeyName: "workflowExecution_workflowId_fkey";
            columns: ["workflowId"];
            isOneToOne: false;
            referencedRelation: "workflows";
            referencedColumns: ["workflowId"];
          },
        ];
      };
      workflows: {
        Row: {
          createdAt: string;
          definition: Json;
          description: string | null;
          name: string;
          status: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt: string;
          userId: string;
          workflowId: number;
        };
        Insert: {
          createdAt?: string;
          definition: Json;
          description?: string | null;
          name: string;
          status?: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt?: string;
          userId?: string;
          workflowId?: number;
        };
        Update: {
          createdAt?: string;
          definition?: Json;
          description?: string | null;
          name?: string;
          status?: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt?: string;
          userId?: string;
          workflowId?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      ExecutionPhaseStatus:
        | "CREATED"
        | "PENDING"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED";
      WorkflowExecutionStatus: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";
      WorkflowExecutionTrigger: "MANUAL";
      WorkflowStatus: "DRAFT" | "PUBLISHED";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
