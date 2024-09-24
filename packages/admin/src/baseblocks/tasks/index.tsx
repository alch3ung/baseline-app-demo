import { getRequestHandler } from "@baseline/client-api/request-handler";
import { createTask, deleteTask, getAllTasks } from "@baseline/client-api/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";

export function Tasks() {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: tasks = [], refetch: refreshTaskList } = useTaskList();
  const { mutateAsync: addTask } = useAddTask({
    onSuccess: () => {
      refreshTaskList();
    },
  });
  const { mutateAsync: deleteTask } = useDeleteTask({
    onSuccess: () => {
      refreshTaskList();
    },
  });

  return (
    <main>
      <h5>Task list</h5>
      <section>
        <input ref={inputRef} />
        <button type="button" onClick={() => addTask({ content: inputRef?.current.value || '' })}>Add</button>
      </section>

      {tasks.map(t => (
        <div key={t.taskId}>
          <p>{t.content}</p>
          <button type="button" onClick={() => deleteTask(t.taskId)}>❌</button>
        </div>
      ))}
    </main>
  )
}

export function useTaskList() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: () => getAllTasks(getRequestHandler()),
  })
}

export function useAddTask(opts = {}) {
  return useMutation({
    mutationFn: (data: { content: string }) => createTask(getRequestHandler(), data),
    ...opts,
  })
}

export function useDeleteTask(opts = {}) {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(getRequestHandler(), taskId),
    ...opts,
  })
}