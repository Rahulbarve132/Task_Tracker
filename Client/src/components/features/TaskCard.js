import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { Button } from '@/components/ui/Button';
import { Trash2, Edit2 } from 'lucide-react';

export function TaskCard({ task, onDelete, onEdit }) {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-gray-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-medium line-clamp-1">
            <Link href={`/tasks/${task._id || task.id}`} className="hover:underline">
              {task.title}
            </Link>
          </CardTitle>
          <div className="flex gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 line-clamp-2">
          {task.description || "No description provided."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          <Edit2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => onDelete(task._id || task.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
