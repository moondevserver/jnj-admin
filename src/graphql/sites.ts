import { gql } from '@apollo/client';

export const GET_SITES = gql`
  query GetSites($skip: Int, $take: Int, $search: String) {
    sites(skip: $skip, take: $take, search: $search) {
      id
      name
      domain
      description
      is_active
      settings
      created_at
    }
  }
`;

export const GET_SITE = gql`
  query GetSite($id: ID!) {
    site(id: $id) {
      id
      name
      domain
      description
      is_active
      settings
      created_at
    }
  }
`;

export const CREATE_SITE = gql`
  mutation CreateSite($input: SiteInput!) {
    createSite(input: $input) {
      id
      name
      domain
      description
      is_active
      settings
      created_at
    }
  }
`;

export const UPDATE_SITE = gql`
  mutation UpdateSite($id: ID!, $input: SiteInput!) {
    updateSite(id: $id, input: $input) {
      id
      name
      domain
      description
      is_active
      settings
      created_at
    }
  }
`;

export const DELETE_SITE = gql`
  mutation DeleteSite($id: ID!) {
    deleteSite(id: $id) {
      id
    }
  }
`; 