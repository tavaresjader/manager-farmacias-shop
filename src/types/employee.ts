export interface EmployeeMerchantDto {
  id: string;
  name?: string | null;
  checked: boolean;
}

export interface EmployeeListApiResponse {
  id: string;
  name?: string | null;
  email?: string | null;
  active: boolean;
  master: boolean;
}

export interface EmployeeDetailsApiResponse extends EmployeeListApiResponse {
  merchants?: EmployeeMerchantDto[] | null;
}

export interface EmployeePayload {
  id?: string;
  name: string;
  email: string;
  password: string | null;
  active: boolean;
  master: boolean;
  merchants: EmployeeMerchantDto[];
}

export interface EmployeeForm {
  id: string;
  name: string;
  email: string;
  active: boolean;
  master: boolean;
  merchants: EmployeeMerchantDto[];
}

export function createEmptyEmployee(): EmployeeForm {
  return {
    id: "",
    name: "",
    email: "",
    active: true,
    master: false,
    merchants: [],
  };
}

export function toEmployeeForm(employee: EmployeeDetailsApiResponse): EmployeeForm {
  return {
    id: employee.id,
    name: employee.name?.trim() || "",
    email: employee.email?.trim() || "",
    active: employee.active,
    master: employee.master,
    merchants: (employee.merchants ?? []).map((merchant) => ({
      id: merchant.id,
      name: merchant.name?.trim() || "Unidade sem nome",
      checked: merchant.checked,
    })),
  };
}

export function toEmployeePayload(employee: EmployeeForm, password: string): EmployeePayload {
  return {
    id: employee.id || undefined,
    name: employee.name.trim(),
    email: employee.email.trim(),
    password: password.trim() || null,
    active: employee.active,
    master: employee.master,
    merchants: employee.master ? [] : employee.merchants,
  };
}
