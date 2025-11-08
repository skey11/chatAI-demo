import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '../../../graphql/mutations/sendMessage';
import { GET_CONVERSATION } from '../../../graphql/queries/conversation';

export const useSendMessage = () => {
  const [sendMessageMutation, state] = useMutation(SEND_MESSAGE, {
    refetchQueries: [GET_CONVERSATION]
  });

  const sendMessage = async (conversationId: string, content: string) => {
    if (!content.trim()) return;
    await sendMessageMutation({
      variables: { conversationId, content }
    });
  };

  return { sendMessage, ...state };
};
