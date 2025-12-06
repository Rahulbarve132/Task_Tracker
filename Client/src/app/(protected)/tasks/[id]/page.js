'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTasks, updateTaskInState, setLoading } from '@/lib/features/tasks/taskSlice';
import api from '@/lib/axios';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { StatusBadge, PriorityBadge } from '@/components/features/StatusBadge';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { CreateTaskModal } from '@/components/features/CreateTaskModal';

export default function TaskDetailsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { tasks, loading } = useSelector((state) => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (tasks.length === 0) {
      loadTasks();
    }
  }, []);

  const loadTasks = async () => {
    dispatch(setLoading(true));
    try {
      const response = await api.get('/api/tasks');
      const data = response.data;
      
      // Handle different response formats
      let tasksArray = [];
      if (Array.isArray(data)) tasksArray = data;
      else if (data.tasks && Array.isArray(data.tasks)) tasksArray = data.tasks;
      else if (data.data && Array.isArray(data.data)) tasksArray = data.data;
      
      dispatch(setTasks(tasksArray));
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    }
  };

  const task = tasks.find(t => t.id === params.id || t.id === parseInt(params.id) || t.id === String(params.id));

  const handleModalSubmit = async (taskData) => {
    try {
      const response = await api.put(`/api/tasks/${task.id}`, taskData);
      dispatch(updateTaskInState(response.data));
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  if (loading && !task) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200 mb-8" />
          <div className="h-64 animate-pulse rounded-xl bg-gray-200" />
        </main>
      </div>
    );
  }

  if (!task && !loading && tasks.length > 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Task not found</h1>
          <Link href="/dashboard">
            <Button variant="ghost" className="mt-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <Link href="/dashboard" className="mb-8 inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        {task && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                  <span className="text-sm text-gray-500">ID: {task.id}</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
              </div>
              <Button onClick={() => setIsModalOpen(true)}>
                Edit Task
              </Button>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <div className="mt-2 prose prose-sm max-w-none text-gray-900">
                  <p className="whitespace-pre-wrap">{task.description || "No description provided."}</p>
                </div>
              </div>
              
              <div className="space-y-6 rounded-lg bg-gray-50 p-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Details</h3>
                  <dl className="mt-2 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>Created: {new Date().toLocaleDateString()}</span> 
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>Updated: {new Date().toLocaleDateString()}</span>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {isModalOpen && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskToEdit={task}
          onSubmit={handleModalSubmit}
        />
      )}
    </div>
  );
}
