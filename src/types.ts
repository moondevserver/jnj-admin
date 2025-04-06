// 사용자 타입
export type User = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_roles: UserRole[];
};

// 사용자 역할 타입
export type UserRole = {
  role: Role;
};

// 역할 타입
export type Role = {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
};

// 권한 타입
export type Permission = {
  id: string;
  name: string;
  code: string;
  description?: string;
};

// 로그인 입력 타입
export type LoginInput = {
  email: string;
  password: string;
  site_domain?: string;
  page_path?: string;
};

// 회원가입 입력 타입
export type RegisterInput = {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  site_domain?: string;
  page_path?: string;
};

// 비밀번호 재설정 입력 타입
export type PasswordResetInput = {
  email: string;
};

// 사용자 생성/수정 입력 타입
export type UserInput = {
  email: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  role_ids: string[];
};

// 역할 생성/수정 입력 타입
export type RoleInput = {
  name: string;
  description?: string;
  permission_ids: string[];
  site_id?: string;
};

// 권한 생성/수정 입력 타입
export type PermissionInput = {
  code: string;
  name: string;
  description?: string;
};

// 인증 결과 타입
export type AuthResult = {
  user: User;
  token: string;
  refresh_token: string;
};

// 페이지네이션 타입
export type PaginationInput = {
  page: number;
  pageSize: number;
};

// 정렬 타입
export type SortInput = {
  field: string;
  direction: 'asc' | 'desc';
};

// 필터 타입
export type FilterInput = {
  field: string;
  value: string;
  operator: 'contains' | 'equals' | 'startsWith' | 'endsWith';
}; 