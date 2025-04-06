import { gql } from '@apollo/client';

export const GET_SOCIAL_PROVIDERS = gql`
  query GetSocialProviders($search: String) {
    socialProviders(search: $search) {
      id
      name
      description
      is_active
      settings
      user_social_connections {
        id
        provider_user_id
        created_at
        last_used_at
        users {
          id
          email
          first_name
          last_name
        }
      }
    }
  }
`;

export const GET_SOCIAL_PROVIDER = gql`
  query GetSocialProvider($id: Int!) {
    socialProvider(id: $id) {
      id
      name
      description
      is_active
      settings
      user_social_connections {
        id
        provider_user_id
        created_at
        last_used_at
        users {
          id
          email
          first_name
          last_name
        }
      }
    }
  }
`;

export const CREATE_SOCIAL_PROVIDER = gql`
  mutation CreateSocialProvider($input: SocialProviderInput!) {
    createSocialProvider(input: $input) {
      id
      name
      description
      is_active
      settings
    }
  }
`;

export const UPDATE_SOCIAL_PROVIDER = gql`
  mutation UpdateSocialProvider($id: Int!, $input: SocialProviderInput!) {
    updateSocialProvider(id: $id, input: $input) {
      id
      name
      description
      is_active
      settings
    }
  }
`;

export const DELETE_SOCIAL_PROVIDER = gql`
  mutation DeleteSocialProvider($id: Int!) {
    deleteSocialProvider(id: $id)
  }
`; 