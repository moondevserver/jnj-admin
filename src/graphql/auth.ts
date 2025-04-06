import { gql } from '@apollo/client';

// 로그인 mutation
const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      refresh_token
      user {
        id
        email
        first_name
        last_name
        is_active
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
          site {
            id
            domain
            name
          }
        }
      }
    }
  }
`;

// 회원가입 mutation
const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        first_name
        last_name
        is_active
      }
    }
  }
`;

// 비밀번호 찾기 mutation
const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: PasswordResetInput!) {
    forgotPassword(input: $input) {
      success
      message
    }
  }
`;

// 현재 사용자 조회 query
const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      email
      first_name
      last_name
      is_active
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

// 로그아웃 mutation
const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

// 토큰 갱신 mutation
const REFRESH_TOKEN = gql`
  mutation RefreshToken($refresh_token: String!) {
    refreshToken(refresh_token: $refresh_token) {
      token
      refresh_token
      user {
        id
        email
        first_name
        last_name
        is_active
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
          site {
            id
            domain
            name
          }
        }
      }
    }
  }
`;

export { LOGIN, REGISTER, FORGOT_PASSWORD, GET_CURRENT_USER, LOGOUT, REFRESH_TOKEN };