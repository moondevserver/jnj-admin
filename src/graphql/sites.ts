import { gql } from '@apollo/client';

export const GET_SITES = gql`
  query GetSites($skip: Int, $take: Int, $search: String) {
    sites(skip: $skip, take: $take, search: $search) {
      id
      domain
      name
      description
      is_active
      created_at
      pages {
        id
        path
        name
      }
    }
  }
`;

export const GET_SITE = gql`
  query GetSite($id: ID!) {
    site(id: $id) {
      id
      domain
      name
      description
      is_active
      settings
      created_at
      pages {
        id
        path
        name
        description
        metadata
      }
    }
  }
`;

export const CREATE_SITE = gql`
  mutation CreateSite($input: SiteInput!) {
    createSite(input: $input) {
      id
      domain
      name
      description
      is_active
    }
  }
`;

export const UPDATE_SITE = gql`
  mutation UpdateSite($id: ID!, $input: SiteInput!) {
    updateSite(id: $id, input: $input) {
      id
      domain
      name
      description
      is_active
    }
  }
`;

export const DELETE_SITE = gql`
  mutation DeleteSite($id: ID!) {
    deleteSite(id: $id)
  }
`; 