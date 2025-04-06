import { gql } from '@apollo/client';

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
        name
        code
        description
      }
    }
  }
`;

const GET_ROLE = gql`
  query GetRole($id: ID!) {
    role(id: $id) {
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
        name
        code
        description
      }
    }
  }
`;

const CREATE_ROLE = gql`
  mutation CreateRole($input: RoleInput!) {
    createRole(input: $input) {
      id
      name
      description
    }
  }
`;

const UPDATE_ROLE = gql`
  mutation UpdateRole($id: ID!, $input: RoleInput!) {
    updateRole(id: $id, input: $input) {
      id
      name
      description
    }
  }
`;

const DELETE_ROLE = gql`
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id)
  }
`;

export { GET_ROLES, GET_ROLE, CREATE_ROLE, UPDATE_ROLE, DELETE_ROLE }; 