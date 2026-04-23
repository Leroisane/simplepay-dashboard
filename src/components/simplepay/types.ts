export interface Profile {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  details: string | null;
  created_at: string;
}

export interface Schedule {
  id: string;
  recipient: string;
  amount: number;
  frequency: string;
  next_date: string;
  status: string;
}

export const formatIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });