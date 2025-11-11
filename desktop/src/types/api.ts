export interface ApiKey {
  id: number;
  label: string;
  secret: string;
  createdAt: string;
}

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}
