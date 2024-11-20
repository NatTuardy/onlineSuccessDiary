export interface DayToEdit {
  dateNow?: string;
  successes1?: string;
  successes2?: string;
  successes3?: string;
  successes4?: string;
  successes5?: string;
  [key: string]: string | undefined; // Для дополнительных полей
}

export type ValidationConfig = Record<string, ValidationRule>;

export interface ValidationRule {
  [key: string]: {
    message: string;
    value?: number; // Например, для min
  };
}
