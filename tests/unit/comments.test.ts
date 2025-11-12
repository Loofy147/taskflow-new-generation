import { describe, it, expect, beforeEach } from 'vitest';
import { createComment, getComments, updateComment, deleteComment } from '@/features/comments';

describe('Comments System', () => {
  let taskId: bigint;
  let userId: bigint;

  beforeEach(() => {
    taskId = BigInt(1);
    userId = BigInt(1);
  });

  it('should create a comment', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'Test comment',
    });

    expect(comment.id).toBeDefined();
    expect(comment.content).toBe('Test comment');
  });

  it('should detect @mentions', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'Hey @john, can you review this?',
    });

    expect(comment.mentions).toContain('john');
  });

  it('should support emoji reactions', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'Great work!',
    });

    const reaction = await addReaction(comment.id, userId, '👍');
    expect(reaction.emoji).toBe('👍');
  });

  it('should support file attachments', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'Check this file',
      attachmentUrls: ['https://example.com/file.pdf'],
    });

    expect(comment.attachments).toHaveLength(1);
  });

  it('should paginate comments', async () => {
    const comments = await getComments(taskId, { limit: 10, offset: 0 });
    expect(Array.isArray(comments)).toBe(true);
  });

  it('should update comments', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'Original',
    });

    const updated = await updateComment(comment.id, userId, 'Updated');
    expect(updated.content).toBe('Updated');
    expect(updated.editedAt).toBeDefined();
  });

  it('should soft delete comments', async () => {
    const comment = await createComment({
      taskId,
      userId,
      content: 'To delete',
    });

    await deleteComment(comment.id, userId);
    const deleted = await getComments(taskId);
    expect(deleted.find(c => c.id === comment.id)).toBeUndefined();
  });
});
