import { ApolloClient, InMemoryCache, createHttpLink, ApolloLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";

// HTTP 링크 설정
const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || 'http://localhost:4001/graphql',
});

// 에러 처리 링크
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.log('[GraphQL Error]:', {
        message,
        locations,
        path,
        extensions
      });
    });
  }
  if (networkError) {
    console.log('[Network Error]:', networkError);
  }
  console.log('Failed Operation:', {
    name: operation.operationName,
    variables: operation.variables,
    query: operation.query
  });
});

// 요청/응답 로깅 링크
const loggingLink = new ApolloLink((operation, forward) => {
  console.log(`Starting Operation ${operation.operationName}:`, {
    variables: operation.variables,
    query: operation.query,
  });

  return forward(operation).map((result) => {
    console.log(`Finished Operation ${operation.operationName}:`, {
      data: result.data,
      errors: result.errors,
    });
    return result;
  });
});

// 인증 헤더 설정
const authLink = setContext((_, { headers }) => {
  // 클라이언트 사이드에서만 localStorage에 접근
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  // 디버깅을 위한 로그
  console.log('Request Headers:', {
    ...headers,
    authorization: token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  });
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    }
  };
});

// Apollo 클라이언트 생성
const client = new ApolloClient({
  link: ApolloLink.from([errorLink, loggingLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client; 