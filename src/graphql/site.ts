import { gql } from '@apollo/client';

// 사이트 목록 조회 query
const GET_SITES = gql`
  query GetSites($skip: Int, $take: Int) {
    sites(skip: $skip, take: $take) {
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
      }
    }
  }
`;

// 단일 사이트 조회 query
const GET_SITE = gql`
  query GetSite($domain: String) {
    site(domain: $domain) {
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

// 사이트 생성 mutation
const CREATE_SITE = gql`
  mutation CreateSite($input: SiteInput!) {
    createSite(input: $input) {
      id
      domain
      name
      description
      is_active
      settings
      created_at
    }
  }
`;

// 사이트 수정 mutation
const UPDATE_SITE = gql`
  mutation UpdateSite($id: ID!, $input: SiteInput!) {
    updateSite(id: $id, input: $input) {
      id
      domain
      name
      description
      is_active
      settings
      created_at
    }
  }
`;

// 사이트 삭제 mutation
const DELETE_SITE = gql`
  mutation DeleteSite($id: ID!) {
    deleteSite(id: $id)
  }
`;

// 페이지 목록 조회 query
const GET_PAGES = gql`
  query GetPages($site_id: ID!) {
    pages(site_id: $site_id) {
      id
      path
      name
      description
      metadata
      site {
        id
        domain
        name
      }
    }
  }
`;

// 단일 페이지 조회 query
const GET_PAGE = gql`
  query GetPage($id: ID!) {
    page(id: $id) {
      id
      path
      name
      description
      metadata
      site {
        id
        domain
        name
      }
    }
  }
`;

// 페이지 생성 mutation
const CREATE_PAGE = gql`
  mutation CreatePage($input: PageInput!) {
    createPage(input: $input) {
      id
      path
      name
      description
      metadata
      site {
        id
        domain
        name
      }
    }
  }
`;

// 페이지 수정 mutation
const UPDATE_PAGE = gql`
  mutation UpdatePage($id: ID!, $input: PageInput!) {
    updatePage(id: $id, input: $input) {
      id
      path
      name
      description
      metadata
      site {
        id
        domain
        name
      }
    }
  }
`;

// 페이지 삭제 mutation
const DELETE_PAGE = gql`
  mutation DeletePage($id: ID!) {
    deletePage(id: $id)
  }
`;

export {
  GET_SITES,
  GET_SITE,
  CREATE_SITE,
  UPDATE_SITE,
  DELETE_SITE,
  GET_PAGES,
  GET_PAGE,
  CREATE_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE
}; 