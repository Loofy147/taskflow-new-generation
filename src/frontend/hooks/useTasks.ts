/**
 * useTasks Hook
 * 
 * Custom hook for managing tasks with React Query.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../config/apiClient';
import { Task, CreateTaskInput, UpdateTaskInput } from '../../shared/types';

const TASKS_QUERY_KEY = ['tasks'];

/**
 * Fetch tasks
 */
const fetchTasks = async (skip = 0, take = 10): Promise<Task[]> => {
  const { data } = await apiClient.get('/v1/tasks', {
    params: { skip, take },
  });
  return data.data;
};

/**
 * Fetch single task
 */
const fetchTaskById = async (id: string): Promise<Task> => {
  const { data } = await apiClient.get(`/v1/tasks/${id}`);
  return data.data;
};

/**
 * Create task
 */
const createTask = async (input: CreateTaskInput): Promise<Task> => {
  const { data } = await apiClient.post('/v1/tasks', input);
  return data.data;
};

/**
 * Update task
 */
const updateTask = async (id: string, input: UpdateTaskInput): Promise<Task> => {
  const { data } = await apiClient.put(`/v1/tasks/${id}`, input);
  return data.data;
};

/**
 * Delete task
 */
const deleteTask = async (id: string): Promise<void> => {
  await apiClient.delete(`/v1/tasks/${id}`);
};

/**
 * useTasks Hook
 */
export const useTasks = (skip = 0, take = 10) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, skip, take],
    queryFn: () => fetchTasks(skip, take),
  });
};

/**
 * useTask Hook
 */
export const useTask = (id: string) => {
  return useQuery({
    queryKey: [...TASKS_QUERY_KEY, id],
    queryFn: () => fetchTaskById(id),
  });
};

/**
 * useCreateTask Hook
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

/**
 * useUpdateTask Hook
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      updateTask(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};

/**
 * useDeleteTask Hook
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    },
  });
};
