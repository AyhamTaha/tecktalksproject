"use client";
import { Plus, X, Clock, CheckSquare, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  priority: Priority;
  time: string;
  completed: boolean;
}

const priorityColors: Record<Priority, string> = {
  high:   "bg-red-100 text-red-700",
  medium: "bg-yellow-100 text-yellow-700",
  low:    "bg-green-100 text-green-700",
};

// ── Reusable task row ─────────────────────────────────────────────────────────
function TaskRow({
  task,
  onToggle,
  onDelete,
}: {
  task: Task;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 p-3 border bg-gray-50 rounded-lg hover:bg-gray-100 border-gray-100 group">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <h4 className={`font-medium text-sm ${task.completed ? "line-through text-gray-400" : "text-gray-900"}`}>
          {task.title}
        </h4>
        <div className="flex items-center gap-2 mt-1.5">
          <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[task.priority]} capitalize font-medium`}>
            {task.priority}
          </span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {task.time}
          </span>
        </div>
      </div>
      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded-lg"
          aria-label="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      )}
    </div>
  );
}

// ── Add Task Modal ────────────────────────────────────────────────────────────
function AddTaskModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (task: Omit<Task, "id" | "completed">) => void;
}) {
  const [title,    setTitle]    = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [time,     setTime]     = useState("12:00");
  const [error,    setError]    = useState("");

  function handleSubmit() {
    if (!title.trim()) { setError("Please enter a task title."); return; }
    onAdd({ title: title.trim(), priority, time });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Add New Task</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Task Title *</label>
            <input
              autoFocus
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(""); }}
              onKeyDown={e => e.key === "Enter" && handleSubmit()}
              placeholder="e.g. Study for final exam"
              className={`w-full text-sm border rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow ${
                error ? "border-red-400 bg-red-50" : "border-gray-200"
              }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {(["high","medium","low"] as Priority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                    priority === p
                      ? p === "high"   ? "border-red-400 bg-red-50 text-red-700"
                      : p === "medium" ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      :                  "border-green-400 bg-green-50 text-green-700"
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Due Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-xl px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View All Modal ────────────────────────────────────────────────────────────
function ViewAllModal({
  tasks,
  onClose,
  onToggle,
  onDelete,
}: {
  tasks: Task[];
  onClose: () => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  const filtered = tasks.filter(t =>
    filter === "all"       ? true :
    filter === "pending"   ? !t.completed :
    t.completed
  );

  const completed = tasks.filter(t => t.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg z-10 flex flex-col max-h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Today's Tasks</h2>
              <p className="text-xs text-gray-500">{completed} of {tasks.length} completed</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-3 flex-shrink-0">
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: tasks.length ? `${(completed / tasks.length) * 100}%` : "0%" }}
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="px-6 pb-3 flex gap-2 flex-shrink-0">
          {(["all","pending","completed"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {f} {f === "all" ? `(${tasks.length})` : f === "pending" ? `(${tasks.filter(t=>!t.completed).length})` : `(${completed})`}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="overflow-y-auto flex-1 px-6 pb-6">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm font-medium text-gray-600">
                {filter === "completed" ? "No completed tasks yet" : "No pending tasks — you're all done!"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(task => (
                <TaskRow key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function TodaysTasks() {
  const [tasks, setTasks] = useState<Task[]>([
    { id:"1", title:"Complete Data Structures Assignment", priority:"high",   time:"11:59 PM", completed:false },
    { id:"2", title:"Study Calculus Chapter 5",            priority:"medium", time:"6:00 PM",  completed:true  },
    { id:"3", title:"Review React Hooks",                  priority:"low",    time:"3:00 PM",  completed:false },
  ]);

  const [showAdd,     setShowAdd]     = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);

  function addTask(data: Omit<Task, "id" | "completed">) {
    setTasks(prev => [
      ...prev,
      { ...data, id: Date.now().toString(), completed: false },
    ]);
  }

  function toggleTask(id: string) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
  }

  // Show max 4 tasks in the card preview
  const preview = tasks.slice(0, 4);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Today's Tasks</CardTitle>
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="Add new task"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {preview.map(task => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} />
            ))}
            {tasks.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-2xl mb-2">✅</p>
                <p className="text-sm text-gray-500">No tasks yet. Click <strong>+</strong> to add one!</p>
              </div>
            )}
          </div>
        </CardContent>

        <button
          onClick={() => setShowViewAll(true)}
          className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-700 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors rounded-b-xl"
        >
          View All Tasks {tasks.length > 4 && `(+${tasks.length - 4} more)`}
        </button>
      </Card>

      {/* Modals */}
      {showAdd && (
        <AddTaskModal onClose={() => setShowAdd(false)} onAdd={addTask} />
      )}
      {showViewAll && (
        <ViewAllModal
          tasks={tasks}
          onClose={() => setShowViewAll(false)}
          onToggle={toggleTask}
          onDelete={deleteTask}
        />
      )}
    </>
  );
}