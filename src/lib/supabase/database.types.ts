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
          status: Database["public"]["Enums"]["PurchaseStatus"];
          stripeId: string;
          userId: string;
          userPurchaseId: string;
        };
        Insert: {
          amount: number;
          createdAt?: string;
          currency: string;
          description: string;
          status: Database["public"]["Enums"]["PurchaseStatus"];
          stripeId: string;
          userId: string;
          userPurchaseId?: string;
        };
        Update: {
          amount?: number;
          createdAt?: string;
          currency?: string;
          description?: string;
          status?: Database["public"]["Enums"]["PurchaseStatus"];
          stripeId?: string;
          userId?: string;
          userPurchaseId?: string;
        };
        Relationships: [];
      };
      users: {
        Row: {
          customAvatarUrl: string | null;
          email: string;
          firstName: string | null;
          lastName: string | null;
          providerAvatarUrl: string | null;
          updatedAt: string;
          userId: string;
        };
        Insert: {
          customAvatarUrl?: string | null;
          email: string;
          firstName?: string | null;
          lastName?: string | null;
          providerAvatarUrl?: string | null;
          updatedAt?: string;
          userId: string;
        };
        Update: {
          customAvatarUrl?: string | null;
          email?: string;
          firstName?: string | null;
          lastName?: string | null;
          providerAvatarUrl?: string | null;
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
        Args: { user_id: string; increment_amount: number };
        Returns: Json;
      };
      reserve_credits_for_workflow_execution: {
        Args: { p_user_id: string; p_amount: number };
        Returns: boolean;
      };
    };
    Enums: {
      LogLevel: "INFO" | "ERROR";
      PurchaseStatus: "SUCCESS" | "FAILED";
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

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      LogLevel: ["INFO", "ERROR"],
      PurchaseStatus: ["SUCCESS", "FAILED"],
      TaskStatus: ["CREATED", "PENDING", "EXECUTING", "COMPLETED", "FAILED"],
      WorkflowExecutionStatus: [
        "PENDING",
        "EXECUTING",
        "COMPLETED",
        "FAILED",
        "PARTIALLY_FAILED",
      ],
      WorkflowExecutionTrigger: ["MANUAL", "CRON"],
      WorkflowStatus: ["DRAFT", "PUBLISHED"],
    },
  },
} as const;
