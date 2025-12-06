'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, addTask, updateTaskInState, removeTask, setLoading, setError } from '@/lib/features/tasks/taskSlice';
import api from '@/lib/axios';
import { Navbar } from '@/components/layout/Navbar';
import { TaskCard } from '@/components/features/TaskCard';
import { CreateTaskModal } from '@/components/features/CreateTaskModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tasks, loading, error } = useSelector((state) => state.tasks);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [filters, setFilters] = useState({ status: '', search: '' });
  const [searchInput, setSearchInput] = useState(''); // Separate state for input

  // Load tasks
  const loadTasks = async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get(`/api/tasks?status=${filters.status}&search=${filters.search}`);
      const data = response.data;
      
      // Handle different response formats
      let tasksArray = [];
      if (Array.isArray(data)) tasksArray = data;
      else if (data.tasks && Array.isArray(data.tasks)) tasksArray = data.tasks;
      else if (data.data && Array.isArray(data.data)) tasksArray = data.data;
      
      dispatch(setTasks(tasksArray));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to fetch tasks'));
    }
  };

  // Debounce search input - wait 500ms after user stops typing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchInput }));
    }, 500); // Optimal debounce time for search

    return () => clearTimeout(debounceTimer);
  }, [searchInput]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadTasks();
  }, [filters]);

  const handleEdit = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await api.delete(`/api/tasks/${id}`);
      dispatch(removeTask(id));
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to delete task'));
    }
  };

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (taskData) => {
    try {
      if (taskToEdit) {
        // Update existing task
        const taskId = taskToEdit._id || taskToEdit.id;
        const response = await api.put(`/api/tasks/${taskId}`, taskData);
        const updatedTask = response.data.task || response.data;
        dispatch(updateTaskInState(updatedTask));
      } else {
        // Create new task
        const response = await api.post('/api/tasks', taskData);
        const newTask = response.data.task || response.data;
        dispatch(addTask(newTask));
      }
      setIsModalOpen(false);
    } catch (err) {
      dispatch(setError(err.response?.data?.message || 'Failed to save task'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tasks</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your tasks and track progress.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <select
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-0"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {loading && tasks.length === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-gray-200" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-center text-red-500">
            {typeof error === 'string' ? error : 'Failed to load tasks'}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 py-12 text-center">
            <div className="rounded-full bg-gray-100 p-3">
              <Filter className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new task.
            </p>
            <Button variant="ghost" className="mt-4" onClick={handleCreate}>
              Create Task
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard
                key={task._id || task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskToEdit={taskToEdit}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
