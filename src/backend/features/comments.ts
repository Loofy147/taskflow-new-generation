// In-memory store for comments, reactions, and attachments.
class InMemoryCommentStore {
  private comments: Map<bigint, any> = new Map();
  private reactions: Map<bigint, any[]> = new Map();
  private nextId = BigInt(1);

  async createComment(data: {
    taskId: bigint;
    userId: bigint;
    content: string;
    attachmentUrls?: string[];
  }) {
    const newComment = {
      id: this.nextId++,
      ...data,
      mentions:
        data.content.match(/@(\w+)/g)?.map((m: string) => m.substring(1)) || [],
      attachments: (data.attachmentUrls || []).map((url) => ({
        id: this.nextId++,
        url,
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      isDeleted: false,
    };
    this.comments.set(newComment.id, newComment);
    return newComment;
  }

  async getComments(
    taskId: bigint,
    options: { limit?: number; offset?: number } = { limit: 10, offset: 0 }
  ) {
    const allComments = Array.from(this.comments.values());
    const taskComments = allComments
      .filter((c) => c.taskId === taskId && !c.isDeleted)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    return taskComments.slice(
      options.offset,
      options.offset + options.limit
    );
  }

  async updateComment(commentId: bigint, userId: bigint, content: string) {
    const comment = this.comments.get(commentId);
    if (!comment || comment.userId !== userId) {
      throw new Error('Comment not found or permission denied');
    }
    comment.content = content;
    comment.editedAt = new Date();
    this.comments.set(commentId, comment);
    return comment;
  }

  async deleteComment(commentId: bigint, userId: bigint) {
    const comment = this.comments.get(commentId);
    if (!comment || comment.userId !== userId) {
      throw new Error('Comment not found or permission denied');
    }
    comment.isDeleted = true;
    this.comments.set(commentId, comment);
  }

  async addReaction(commentId: bigint, userId: bigint, emoji: string) {
    if (!this.comments.has(commentId)) {
      throw new Error('Comment not found');
    }
    const newReaction = {
      id: this.nextId++,
      userId,
      emoji,
    };
    const commentReactions = this.reactions.get(commentId) || [];
    commentReactions.push(newReaction);
    this.reactions.set(commentId, commentReactions);
    return newReaction;
  }
}

const commentStore = new InMemoryCommentStore();

export const createComment = commentStore.createComment.bind(commentStore);
export const getComments = commentStore.getComments.bind(commentStore);
export const updateComment = commentStore.updateComment.bind(commentStore);
export const deleteComment = commentStore.deleteComment.bind(commentStore);
export const addReaction = commentStore.addReaction.bind(commentStore);
