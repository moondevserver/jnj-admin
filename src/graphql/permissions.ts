import { gql } from '@apollo/client';

export const GET_PERMISSIONS = gql`
  query GetPermissions($search: String) {
    permissions(search: $search) {
      id
      code
      name
      description
    }
  }
`;

export const GET_PERMISSION = gql`
  query GetPermission($id: ID!) {
    permission(id: $id) {
      id
      code
      name
      description
    }
  }
`;

export const CREATE_PERMISSION = gql`
  mutation CreatePermission($input: PermissionInput!) {
    createPermission(input: $input) {
      id
      code
      name
      description
    }
  }
`;

export const UPDATE_PERMISSION = gql`
  mutation UpdatePermission($id: ID!, $input: PermissionInput!) {
    updatePermission(id: $id, input: $input) {
      id
      code
      name
      description
    }
  }
`;

export const DELETE_PERMISSION = gql`
  mutation DeletePermission($id: ID!) {
    deletePermission(id: $id)
  }
`; 