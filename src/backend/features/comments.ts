export const createComment = async (data: any) => {
  const mentions = data.content.match(/@(\w+)/g)?.map((m: string) => m.substring(1)) || [];
  const attachments = data.attachmentUrls || [];
  return { id: BigInt(1), ...data, mentions, attachments };
};
export const getComments = async (taskId: bigint, options?: any) => {
  return [];
};
export const updateComment = async (commentId: bigint, userId: bigint, content: string) => {
  return { id: commentId, content, editedAt: new Date() };
};
export const deleteComment = async (commentId: bigint, userId: bigint) => {
  return;
};
export const addReaction = async (commentId: bigint, userId: bigint, emoji: string) => {
  return { emoji };
};
