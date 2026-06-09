// Welfare Management System API client
// Configure base URL via VITE_WMS_API_BASE in env, falls back to provided default.

export const WMS_API_BASE =
  (import.meta.env.VITE_WMS_API_BASE as string | undefined) ??
  "https://ubdhljxyleqsixrewtto.supabase.co/functions/v1";

export interface WmsConfig {
  registration_fee: number;
  currency?: string;
  eligibility?: string[];
  retirement_date_requirement?: string;
  [key: string]: unknown;
}

export interface RegisterPayload {
  full_name: string;
  phone_number: string;
  department: string;
  working_location: string;
}

export interface RegisterResponse {
  registration_id: string;
  status: string;
  registration_fee: number;
}

export type RegistrationStatus =
  | "payment_pending"
  | "pending"
  | "verified"
  | "approved"
  | "rejected"
  | string;

export interface StatusResponse {
  registration_id: string;
  status: RegistrationStatus;
  message?: string;
  member_id?: string;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${WMS_API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init?.headers ?? {}),
      },
    });
  } catch (err) {
    throw new Error(
      `Unable to reach the Welfare Management System. This is usually a CORS or network issue. Verify VITE_WMS_API_BASE and that the API allows this origin. (${(err as Error).message})`,
    );
  }

  if (!res.ok) {
    let body = "";
    try {
      body = await res.text();
    } catch {}
    throw new Error(`WMS API ${res.status}: ${body || res.statusText}`);
  }

  return (await res.json()) as T;
}

export const wmsApi = {
  getConfig: () => request<WmsConfig>("/member-registration/config"),
  register: (payload: RegisterPayload) =>
    request<RegisterResponse>("/member-registration/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  initiatePayment: (data: { registration_id: string; phone_number: string }) =>
    request<{ message?: string; checkout_request_id?: string }>(
      "/member-registration/initiate-payment",
      { method: "POST", body: JSON.stringify(data) },
    ),
  getStatus: (registrationId: string) =>
    request<StatusResponse>(`/member-registration/status/${encodeURIComponent(registrationId)}`),
};
