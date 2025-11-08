import { useQuery } from '@apollo/client';
import { GET_CONVERSATION } from '../../../graphql/queries/conversation';
import type { ChatMessage } from '../types';

interface ConversationQueryResult {
  conversation: {
    id: string;
    messages: ChatMessage[];
  } | null;
}

export const useConversation = (conversationId: string) => {
  return useQuery<ConversationQueryResult>(GET_CONVERSATION, {
    variables: { id: conversationId },
    pollInterval: 2500,
    fetchPolicy: 'cache-and-network'
  });
};
