import { gql } from '@apollo/client';

const GET_PERMISSIONS = gql`
  query GetPermissions($site_id: ID) {
    permissions(site_id: $site_id) {
      id
      name
      description
      code
    }
  }
`;

const GET_PERMISSION = gql`
  query GetPermission($id: ID!) {
    permission(id: $id) {
      id
      name
      description
      code
    }
  }
`;

const CREATE_PERMISSION = gql`
  mutation CreatePermission($input: PermissionInput!) {
    createPermission(input: $input) {
      id
      name
      description
      code
    }
  }
`;

const UPDATE_PERMISSION = gql`
  mutation UpdatePermission($id: ID!, $input: PermissionInput!) {
    updatePermission(id: $id, input: $input) {
      id
      name
      description
      code
    }
  }
`;

const DELETE_PERMISSION = gql`
  mutation DeletePermission($id: ID!) {
    deletePermission(id: $id) {
      success
      message
    }
  }
`;

export { GET_PERMISSIONS, GET_PERMISSION, CREATE_PERMISSION, UPDATE_PERMISSION, DELETE_PERMISSION }; 