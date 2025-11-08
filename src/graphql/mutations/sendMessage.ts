import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, content: $content) {
      id
      role
      content
      createdAt
    }
  }
`;
