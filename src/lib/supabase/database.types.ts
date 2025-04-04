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
      credentials: {
        Row: {
          createdAt: string;
          credentialId: string;
          name: string;
          userId: string;
          value: string;
        };
        Insert: {
          createdAt?: string;
          credentialId?: string;
          name: string;
          userId?: string;
          value: string;
        };
        Update: {
          createdAt?: string;
          credentialId?: string;
          name?: string;
          userId?: string;
          value?: string;
        };
        Relationships: [];
      };
      taskLogs: {
        Row: {
          logLevel: Database["public"]["Enums"]["LogLevel"];
          message: string;
          taskId: string;
          taskLogId: string;
          timestamp: string;
          userId: string;
        };
        Insert: {
          logLevel: Database["public"]["Enums"]["LogLevel"];
          message: string;
          taskId?: string;
          taskLogId?: string;
          timestamp: string;
          userId?: string;
        };
        Update: {
          logLevel?: Database["public"]["Enums"]["LogLevel"];
          message?: string;
          taskId?: string;
          taskLogId?: string;
          timestamp?: string;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "taskLogs_taskId_fkey";
            columns: ["taskId"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["taskId"];
          },
        ];
      };
      tasks: {
        Row: {
          completedAt: string | null;
          creditsConsumed: number | null;
          inputs: Json | null;
          name: string;
          node: Json;
          outputs: Json | null;
          phase: number;
          startedAt: string | null;
          status: Database["public"]["Enums"]["TaskStatus"];
          taskId: string;
          userId: string;
          workflowExecutionId: string | null;
        };
        Insert: {
          completedAt?: string | null;
          creditsConsumed?: number | null;
          inputs?: Json | null;
          name: string;
          node: Json;
          outputs?: Json | null;
          phase: number;
          startedAt?: string | null;
          status: Database["public"]["Enums"]["TaskStatus"];
          taskId?: string;
          userId?: string;
          workflowExecutionId?: string | null;
        };
        Update: {
          completedAt?: string | null;
          creditsConsumed?: number | null;
          inputs?: Json | null;
          name?: string;
          node?: Json;
          outputs?: Json | null;
          phase?: number;
          startedAt?: string | null;
          status?: Database["public"]["Enums"]["TaskStatus"];
          taskId?: string;
          userId?: string;
          workflowExecutionId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_workflowExecutionId_fkey";
            columns: ["workflowExecutionId"];
            isOneToOne: false;
            referencedRelation: "workflowExecutions";
            referencedColumns: ["workflowExecutionId"];
          },
        ];
      };
      userCredits: {
        Row: {
          availableCredits: number;
          reservedCredits: number;
          userId: string;
        };
        Insert: {
          availableCredits?: number;
          reservedCredits?: number;
          userId?: string;
        };
        Update: {
          availableCredits?: number;
          reservedCredits?: number;
          userId?: string;
        };
        Relationships: [
          {
            foreignKeyName: "userCredits_userId_fkey";
            columns: ["userId"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["userId"];
          },
        ];
      };
      userPurchases: {
        Row: {
          amount: number;
          createdAt: string;
          currency: string;
          description: string;
          stripeId: string;
          userId: string;
          userPurchaseId: string;
        };
        Insert: {
          amount: number;
          createdAt?: string;
          currency: string;
          description: string;
          stripeId: string;
          userId: string;
          userPurchaseId?: string;
        };
        Update: {
          amount?: number;
          createdAt?: string;
          currency?: string;
          description?: string;
          stripeId?: string;
          userId?: string;
          userPurchaseId?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          avatarUrl: string | null;
          email: string;
          firstName: string | null;
          lastName: string | null;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          avatarUrl?: string | null;
          email: string;
          firstName?: string | null;
          lastName?: string | null;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          avatarUrl?: string | null;
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
          creditsConsumed: number | null;
          definition: Json;
          startedAt: string;
          status: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId: string;
          workflowExecutionId: string;
          workflowId: string | null;
        };
        Insert: {
          completedAt?: string | null;
          createdAt?: string;
          creditsConsumed?: number | null;
          definition: Json;
          startedAt: string;
          status: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId?: string;
          workflowExecutionId?: string;
          workflowId?: string | null;
        };
        Update: {
          completedAt?: string | null;
          createdAt?: string;
          creditsConsumed?: number | null;
          definition?: Json;
          startedAt?: string;
          status?: Database["public"]["Enums"]["WorkflowExecutionStatus"];
          trigger?: Database["public"]["Enums"]["WorkflowExecutionTrigger"];
          userId?: string;
          workflowExecutionId?: string;
          workflowId?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "workflowExecutions_workflowId_fkey";
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
          creditCost: number;
          cron: string | null;
          definition: Json;
          description: string | null;
          executionPlan: Json | null;
          lastExecutedAt: string | null;
          lastExecutionId: string | null;
          lastExecutionStatus:
            | Database["public"]["Enums"]["WorkflowExecutionStatus"]
            | null;
          name: string;
          nextExecutionAt: string | null;
          status: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt: string;
          userId: string;
          workflowId: string;
        };
        Insert: {
          createdAt?: string;
          creditCost?: number;
          cron?: string | null;
          definition: Json;
          description?: string | null;
          executionPlan?: Json | null;
          lastExecutedAt?: string | null;
          lastExecutionId?: string | null;
          lastExecutionStatus?:
            | Database["public"]["Enums"]["WorkflowExecutionStatus"]
            | null;
          name: string;
          nextExecutionAt?: string | null;
          status?: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt?: string;
          userId?: string;
          workflowId?: string;
        };
        Update: {
          createdAt?: string;
          creditCost?: number;
          cron?: string | null;
          definition?: Json;
          description?: string | null;
          executionPlan?: Json | null;
          lastExecutedAt?: string | null;
          lastExecutionId?: string | null;
          lastExecutionStatus?:
            | Database["public"]["Enums"]["WorkflowExecutionStatus"]
            | null;
          name?: string;
          nextExecutionAt?: string | null;
          status?: Database["public"]["Enums"]["WorkflowStatus"];
          updatedAt?: string;
          userId?: string;
          workflowId?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      finalize_user_credits: {
        Args: {
          p_user_id: string;
          p_credits_consumed: number;
          p_credits_to_refund: number;
        };
        Returns: Json;
      };
      increment_available_credits: {
        Args: {
          user_id: string;
          increment_amount: number;
        };
        Returns: Json;
      };
      reserve_credits_for_workflow_execution: {
        Args: {
          p_user_id: string;
          p_amount: number;
        };
        Returns: boolean;
      };
    };
    Enums: {
      LogLevel: "INFO" | "ERROR";
      TaskStatus: "CREATED" | "PENDING" | "EXECUTING" | "COMPLETED" | "FAILED";
      WorkflowExecutionStatus:
        | "PENDING"
        | "EXECUTING"
        | "COMPLETED"
        | "FAILED"
        | "PARTIALLY_FAILED";
      WorkflowExecutionTrigger: "MANUAL" | "CRON";
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
