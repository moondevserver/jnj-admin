import { gql } from '@apollo/client';

// 사용자 목록 조회 query
const GET_USERS = gql`
  query GetUsers($skip: Int, $take: Int) {
    users(skip: $skip, take: $take) {
      id
      email
      firstName
      lastName
      profileImage
      isActive
      createdAt
      updatedAt
      userRoles {
        role {
          id
          name
        }
        site {
          id
          domain
          name
        }
      }
    }
  }
`;

// 단일 사용자 조회 query
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      profileImage
      isActive
      createdAt
      updatedAt
      userRoles {
        role {
          id
          name
        }
        site {
          id
          domain
          name
        }
      }
    }
  }
`;

// 사용자 생성 mutation
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      email
      firstName
      lastName
      profileImage
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 사용자 정보 수정 mutation
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserUpdateInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      firstName
      lastName
      profileImage
      isActive
      createdAt
      updatedAt
    }
  }
`;

// 비밀번호 변경 mutation
const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($input: UserPasswordUpdateInput!) {
    updatePassword(input: $input)
  }
`;

// 사용자 삭제 mutation
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// 역할 목록 조회 query
const GET_ROLES = gql`
  query GetRoles($site_id: ID) {
    roles(site_id: $site_id) {
      id
      name
      description
      site {
        id
        domain
        name
      }
      permissions {
        id
        code
        name
      }
    }
  }
`;

// 사용자 역할 할당 mutation
const ASSIGN_USER_ROLE = gql`
  mutation AssignUserRole($input: UserRoleInput!) {
    assignUserRole(input: $input) {
      user {
        id
        email
      }
      role {
        id
        name
      }
      site {
        id
        domain
        name
      }
    }
  }
`;

// 사용자 역할 제거 mutation
const REMOVE_USER_ROLE = gql`
  mutation RemoveUserRole($userId: ID!, $roleId: ID!, $site_id: ID) {
    removeUserRole(userId: $userId, roleId: $roleId, site_id: $site_id)
  }
`;

// 감사 로그 조회 query
const GET_AUDIT_LOGS = gql`
  query GetAuditLogs($userId: ID, $action: String, $skip: Int, $take: Int) {
    auditLogs(userId: $userId, action: $action, skip: $skip, take: $take) {
      id
      action
      timestamp
      ipAddress
      details
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export {
  GET_USERS,
  GET_USER,
  CREATE_USER,
  UPDATE_USER,
  UPDATE_PASSWORD,
  DELETE_USER,
  GET_ROLES,
  ASSIGN_USER_ROLE,
  REMOVE_USER_ROLE,
  GET_AUDIT_LOGS
}; 