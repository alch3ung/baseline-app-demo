import { createTask, deleteTask, getAllTasks, updateTask } from "@baseline/client-api/task";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useRef } from "react";
import { Trash2 } from "lucide-react"

import { getRequestHandler } from "@baseline/client-api/request-handler";
import type { Task } from "@baseline/types/task";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover"

const TOAST_POSITION = cn('top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4')

export function Tasks() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast()

  const { data: tasks = [], refetch: refreshTaskList } = useTaskList();
  const { mutateAsync: addTask } = useAddTask({
    onSuccess: () => {
      refreshTaskList();
      inputRef.current.value = '';
      toast({
        title: 'Task added',
        className: TOAST_POSITION,
      });
    },
  });
  const { mutateAsync: deleteTask } = useDeleteTask({
    onSuccess: () => {
      refreshTaskList();
      toast({
        title: 'Task deleted',
        className: TOAST_POSITION,
      });
    },
  });
  const { mutateAsync: updateTask } = useUpdateTask({
    onSuccess: () => {
      refreshTaskList();
      toast({
        title: 'Task updated',
        className: TOAST_POSITION,
      });
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask({ content: inputRef?.current.value || '', completed: false });
    }
  }

  return (
    <div className="flex flex-col flex-grow max-w-5xl	 p-4 pt-16 pl-10 gap-4">
      <h1 className="text-3xl font-bold">Task list</h1>
      <section className="flex flex-col gap-4">
        <Input ref={inputRef} className="flex" onKeyDown={handleKeyDown} />
        <Button type="button" className="flex self-start" onClick={() => addTask({ content: inputRef?.current.value || '', completed: false })}>Add</Button>
      </section>

      <div className="divider" />

      <ul className="flex flex-col list-disc divide-y rounded-lg">
        {tasks.map(t => (
          <li key={t.taskId} className="flex items-center gap-4 hover:bg-accent p-2">
            <Checkbox checked={t.completed} onClick={() => updateTask({ taskId: t.taskId, completed: !t.completed })} />
            <p className={cn(t.completed && "line-through", 'mr-auto')}>{t.content}</p>
            <Popover>
              <PopoverTrigger>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-sm">Are you sure you want to delete this task?</p>
                <div className="flex gap-4 justify-end">
                  <Button variant="destructive" size="sm" onClick={() => deleteTask(t.taskId)}>Yes</Button>
                  <PopoverClose className="PopoverClose" aria-label="Close">
                    <Button variant="ghost" size="sm">No</Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          </li>
        ))}
      </ul>
    </div>
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
    mutationFn: (data: Partial<Task>) => createTask(getRequestHandler(), data),
    ...opts,
  })
}

export function useDeleteTask(opts = {}) {
  return useMutation({
    mutationFn: (taskId: string) => deleteTask(getRequestHandler(), taskId),
    ...opts,
  })
}

export function useUpdateTask(opts = {}) {
  return useMutation({
    mutationFn: (data: Partial<Task>) => updateTask(getRequestHandler(), data),
    ...opts,
  })
}