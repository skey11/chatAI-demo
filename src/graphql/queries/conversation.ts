import { gql } from '@apollo/client';

export const GET_CONVERSATION = gql`
  query GetConversation($id: ID!) {
    conversation(id: $id) {
      id
      messages {
        id
        role
        content
        createdAt
      }
    }
  }
`;
