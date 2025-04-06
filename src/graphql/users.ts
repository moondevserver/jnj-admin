import { gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers($skip: Int, $take: Int, $search: String) {
    users(skip: $skip, take: $take, search: $search) {
      id
      email
      first_name
      last_name
      is_active
      created_at
      updated_at
      user_roles {
        role {
          id
          name
        }
      }
    }
    userCount
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      first_name
      last_name
      is_active
      created_at
      updated_at
      user_roles {
        role {
          id
          name
          permissions {
            id
            name
            code
            description
          }
        }
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      email
      first_name
      last_name
      is_active
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      email
      first_name
      last_name
      is_active
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
    }
  }
`;

export { GET_USERS, GET_USER, CREATE_USER, UPDATE_USER, DELETE_USER }; 