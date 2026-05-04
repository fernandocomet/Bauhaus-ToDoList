/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Columns3, 
  History, 
  Plus, 
  ArrowLeft, 
  Settings, 
  Bell, 
  User, 
  Search,
  Check,
  MoreVertical,
  X,
  ChevronRight,
  ChevronLeft,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type View = 'DASHBOARD' | 'WEEKLY' | 'MONTHLY' | 'CREATE' | 'EDIT';

interface Task {
  id: string;
  title: string;
  category: string;
  status: 'PENDING' | 'COMPLETED';
  due: string;
  priority: 'LOW' | 'MID' | 'HIGH';
}

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Structure Wireframes', category: 'DESIGN_OPS', status: 'PENDING', due: '14_OCT_2023', priority: 'MID' },
  { id: '2', title: 'System Calibration', category: 'MAINTENANCE', status: 'COMPLETED', due: '12_OCT_2023', priority: 'LOW' },
  { id: '3', title: 'Typography Audit', category: 'VISUALS', status: 'PENDING', due: '15_OCT_2023', priority: 'HIGH' },
];

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === 'NO_DATE') return 'NO_DATE';
  if (dateStr.includes('_')) return dateStr; // Already formatted
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = String(date.getDate()).padStart(2, '0');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}_${month}_${year}`;
};

const deformatDate = (formattedStr: string) => {
  if (!formattedStr || formattedStr === 'NO_DATE' || !formattedStr.includes('_')) return '';
  const [day, monthStr, year] = formattedStr.split('_');
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthIndex = months.indexOf(monthStr);
  if (monthIndex === -1) return '';
  const month = String(monthIndex + 1).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');
  const [previousView, setPreviousView] = useState<View>('DASHBOARD');
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('BAUHAUS_TASKS');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED'>('ALL');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const changeView = (view: View) => {
    if (view !== 'CREATE' && view !== 'EDIT') {
      setPreviousView(view);
    } else {
      setPreviousView(currentView);
    }
    setCurrentView(view);
  };

  useEffect(() => {
    localStorage.setItem('BAUHAUS_TASKS', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'PENDING' ? 'COMPLETED' : 'PENDING' } : t));
  };

  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { ...task, id: Math.random().toString(36).substr(2, 9) };
    setTasks([...tasks, newTask]);
    setCurrentView(previousView);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setEditingTask(null);
    setCurrentView(previousView);
  };

  const startEdit = (task: Task) => {
    setEditingTask(task);
    changeView('EDIT');
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         task.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'ALL' || 
                         (filter === 'PENDING' && task.status === 'PENDING') ||
                         (filter === 'COMPLETED' && task.status === 'COMPLETED');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed left-0 top-0 bottom-0 p-6 pt-12 flex flex-col gap-4 bg-white border-r-4 border-black z-50">
        <div className="mb-8">
          <div className="inline-block bg-black text-white px-2 py-1 italic font-black text-xl border-4 border-black font-sans uppercase tracking-tighter">
            COMET!
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] mt-2 opacity-60">KEEP MOVING!</p>
        </div>



        <nav className="flex flex-col gap-2">
          <NavItem 
            active={currentView === 'DASHBOARD'} 
            onClick={() => changeView('DASHBOARD')}
            icon={<LayoutGrid size={18} aria-hidden="true" />}
            label="All Tasks"
            activeColor="bg-bauhaus-yellow"
          />
          <NavItem 
            active={currentView === 'WEEKLY'} 
            onClick={() => changeView('WEEKLY')}
            icon={<Columns3 size={18} aria-hidden="true" />}
            label="Weekly"
            activeColor="bg-bauhaus-blue"
            activeTextColor="text-white"
          />
          <NavItem 
            active={currentView === 'MONTHLY'} 
            onClick={() => changeView('MONTHLY')}
            icon={<Calendar size={18} aria-hidden="true" />}
            label="Monthly"
            activeColor="bg-bauhaus-red"
            activeTextColor="text-white"
          />
          <NavItem 
            active={false} 
            onClick={() => {}}
            icon={<History size={18} aria-hidden="true" />}
            label="Archive"
          />
        </nav>

        <div className="mt-auto">
          <button 
            onClick={() => {
              setEditingTask(null);
              changeView('CREATE');
            }}
            aria-label="Create new task"
            className="w-full bg-bauhaus-red text-white border-4 border-black p-4 text-[10px] font-bold uppercase tracking-widest bauhaus-shadow-sm active-press hover:bg-black transition-colors focus-visible:ring-4 focus-visible:ring-bauhaus-yellow focus-visible:outline-none"
          >
            CREATE_NEW
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 flex-1">
        {/* Top Header */}
        <header className="h-20 sticky top-0 bg-white border-b-4 border-black px-8 flex justify-between items-center z-40">
          <div className="flex items-center gap-4">
            <span className="text-bauhaus-red font-bold text-xs uppercase tracking-tighter">BAUHAUS.TODOLIST</span>
            <div className="w-[2px] h-6 bg-black" />
            <h1 className="text-lg font-black uppercase">{currentView}_01</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <label htmlFor="search-tasks" className="sr-only">Search Tasks</label>
              <input 
                id="search-tasks"
                type="text" 
                placeholder="SEARCH_TASKS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-100 border-2 border-black px-4 py-1 text-[10px] font-bold uppercase w-48 focus:w-64 focus:bg-white transition-all outline-none focus-visible:ring-2 focus-visible:ring-bauhaus-red"
              />
              <Search className="absolute right-2 top-1.5 w-4 h-4" aria-hidden="true" />
            </div>
            <div className="flex gap-2">
              <button aria-label="Notifications" className="p-1 hover:border-2 hover:border-black active-click focus-visible:ring-2 focus-visible:ring-black"><Bell size={20} aria-hidden="true" /></button>
              <button aria-label="Settings" className="p-1 hover:border-2 hover:border-black active-click focus-visible:ring-2 focus-visible:ring-black"><Settings size={20} aria-hidden="true" /></button>
              <button aria-label="User Profile" className="p-1 hover:border-2 hover:border-black active-click focus-visible:ring-2 focus-visible:ring-black"><User size={20} aria-hidden="true" /></button>
            </div>
          </div>
        </header>

        {/* View Transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="p-8 max-w-7xl mx-auto"
          >
            {currentView === 'DASHBOARD' && (
              <Dashboard 
                tasks={filteredTasks} 
                allTasksCount={tasks.length}
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onEdit={startEdit}
                filter={filter}
                setFilter={setFilter}
              />
            )}
            {currentView === 'WEEKLY' && <WeeklyView tasks={tasks} onEdit={startEdit} />}
            {currentView === 'MONTHLY' && <MonthlyView tasks={tasks} onEdit={startEdit} />}
            {(currentView === 'CREATE' || currentView === 'EDIT') && (
              <CreateTaskView 
                task={editingTask}
                onSave={editingTask ? updateTask : addTask}
                onBack={() => {
                  setEditingTask(null);
                  setCurrentView(previousView);
                }} 
                previousView={previousView}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Action Button */}
      {currentView !== 'CREATE' && currentView !== 'EDIT' && (
        <button 
          onClick={() => {
            setEditingTask(null);
            changeView('CREATE');
          }}
          aria-label="Create new task"
          className="fixed bottom-8 right-8 w-16 h-16 bg-bauhaus-red text-white border-4 border-black flex items-center justify-center bauhaus-shadow active-press hover:bg-bauhaus-yellow hover:text-black transition-colors z-50 focus-visible:ring-8 focus-visible:ring-black focus-visible:outline-none"
        >
          <Plus size={32} strokeWidth={3} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

function NavItem({ active, onClick, icon, label, activeColor = 'bg-black', activeTextColor = 'text-black' }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, activeColor?: string, activeTextColor?: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 p-3 text-[10px] uppercase font-bold tracking-widest transition-all active-press border-2 ${active ? `${activeColor} ${activeTextColor} border-black` : 'border-transparent hover:border-black'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Dashboard({ tasks, allTasksCount, onToggle, onDelete, onEdit, filter, setFilter }: { tasks: Task[], allTasksCount: number, onToggle: (id: string) => void, onDelete: (id: string) => void, onEdit: (task: Task) => void, filter: string, setFilter: (f: any) => void }) {
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;
  const percent = Math.round((completedCount / (tasks.length || 1)) * 100);

  return (
    <div className="grid grid-cols-12 gap-8">
      {/* Left Column: Stats */}
      <div className="col-span-12 lg:col-span-4 space-y-8">
        <div className="bg-white border-4 border-black p-6 bauhaus-shadow">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-2xl font-black uppercase leading-none">EFFICIENCY<br/>REPORT</h3>
            <div className="w-12 h-12 bg-bauhaus-red border-2 border-black flex items-center justify-center">
              <span className="text-white font-bold text-lg">{percent}%</span>
            </div>
          </div>
          <div className="relative aspect-square border-4 border-black bg-zinc-50 flex items-center justify-center">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-40 h-40 rounded-full border-[20px] border-black opacity-10" />
                <div 
                   className="w-40 h-40 rounded-full border-[20px] border-bauhaus-red absolute" 
                   style={{ clipPath: `conic-gradient(from 0deg, transparent 0% ${100 - percent}%, black ${100 - percent}% 100%)` }}
                />
             </div>
             <span className="text-4xl font-black relative z-10">{completedCount}/{tasks.length}</span>
          </div>
          <p className="mt-4 text-[10px] font-bold uppercase text-zinc-400 tracking-widest">Tasks Completed in View</p>
        </div>

        <div className="bg-bauhaus-blue border-4 border-black p-6 bauhaus-shadow text-white">
          <h3 className="text-lg font-black uppercase mb-4 tracking-tighter">CRITICAL_TASKS</h3>
          <div className="space-y-4">
            <CriticalCard title="Final Layout Review" deadline="DUE_TODAY" color="text-bauhaus-red" />
            <CriticalCard title="Client Protocol Sync" deadline="DUE_IN_2H" color="text-bauhaus-blue" />
          </div>
        </div>
      </div>

      {/* Right Column: Task List */}
      <div className="col-span-12 lg:col-span-8">
        <div className="flex items-end justify-between mb-8 border-b-4 border-black pb-4">
          <div>
            <h3 className="text-4xl font-black uppercase leading-none">PRIMARY_LIST</h3>
            <div className="flex gap-4 mt-6">
              <FilterTab active={filter === 'ALL'} onClick={() => setFilter('ALL')} label="All_Tasks" />
              <FilterTab active={filter === 'PENDING'} onClick={() => setFilter('PENDING')} label="Pending" />
              <FilterTab active={filter === 'COMPLETED'} onClick={() => setFilter('COMPLETED')} label="Completed" />
            </div>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase opacity-60">TOTAL_RECORDS</p>
            <p className="text-2xl font-black uppercase text-bauhaus-red">{allTasksCount}</p>
          </div>
        </div>

        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`group bg-white border-2 border-black p-6 flex items-center justify-between hover:border-bauhaus-red transition-all bauhaus-shadow-sm ${task.status === 'COMPLETED' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => onToggle(task.id)}
                  aria-label={task.status === 'COMPLETED' ? "Mark as pending" : "Mark as completed"}
                  className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-colors focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none ${task.status === 'COMPLETED' ? 'bg-bauhaus-blue text-white' : 'bg-zinc-50 hover:bg-bauhaus-yellow'}`}
                >
                  {task.status === 'COMPLETED' ? <Check size={20} strokeWidth={4} aria-hidden="true" /> : null}
                </button>
                <div>
                  <h4 className={`text-lg font-bold uppercase transition-colors group-hover:text-bauhaus-red ${task.status === 'COMPLETED' ? 'line-through' : ''}`}>
                    {task.title}
                  </h4>
                  <div className="flex gap-4 mt-1 text-[10px] font-black">
                    <span className="px-2 border border-black bg-blue-50">{task.category}</span>
                    <span className={task.status === 'PENDING' ? 'text-bauhaus-red' : 'text-bauhaus-blue'}>STATUS: {task.status}</span>
                    <span className="text-zinc-400">DUE: {task.due}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => onEdit(task)}
                  aria-label={`Edit task: ${task.title}`}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white active-click transition-colors focus-visible:ring-4 focus-visible:ring-bauhaus-blue focus-visible:outline-none"
                >
                  <Settings size={14} aria-hidden="true" />
                </button>
                <button 
                  onClick={() => onDelete(task.id)}
                  aria-label={`Delete task: ${task.title}`}
                  className="w-10 h-10 border-2 border-black flex items-center justify-center hover:bg-bauhaus-red hover:text-white active-click transition-colors focus-visible:ring-4 focus-visible:ring-bauhaus-red focus-visible:outline-none"
                >
                  <X size={14} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 border-4 border-black bg-zinc-50 text-center">
            <div className="inline-block border-2 border-black p-4 mb-4 bg-white bauhaus-shadow-sm text-bauhaus-blue">
              <History size={32} strokeWidth={3} />
            </div>
            <h4 className="text-lg font-black uppercase tracking-tighter">END_OF_QUEUE</h4>
            <p className="text-[10px] font-bold uppercase text-zinc-400 mt-2">All primary directives have been registered.</p>
        </div>
      </div>
    </div>
  );
}

function CreateTaskView({ task, onSave, onBack, previousView }: { task: Task | null, onSave: (task: any) => void, onBack: () => void, previousView?: View }) {
  const [title, setTitle] = useState(task?.title || '');
  const [category, setCategory] = useState(task?.category || 'WORK');
  const [priority, setPriority] = useState<'LOW' | 'MID' | 'HIGH'>(task?.priority || 'MID');
  const [due, setDue] = useState(deformatDate(task?.due || ''));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    
    onSave({
      ...(task && { id: task.id }),
      title,
      category,
      priority,
      due: formatDate(due),
      status: task?.status || 'PENDING'
    });
  };

  return (
    <div className="grid grid-cols-12 gap-12">
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
        <div className="border-4 border-black p-8 bg-bauhaus-yellow relative overflow-hidden h-[300px] flex flex-col justify-end bauhaus-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 bg-bauhaus-red transform translate-x-12 -translate-y-12 rotate-45 border-4 border-black" />
          <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-bauhaus-blue border-4 border-black" />
          <h1 className="text-6xl font-black uppercase text-black leading-[0.8] mb-4">{task ? 'EDIT' : 'NEW'}<br/>TASK</h1>
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Structure creates clarity.</p>
        </div>
        <div className="border-4 border-black p-6 bg-white bauhaus-shadow">
          <h3 className="text-xl font-bold uppercase mb-4 leading-none">Philosophy</h3>
          <p className="text-sm opacity-70">Efficiency is not an accident. It is the result of structural honesty and geometric discipline.</p>
          <div className="flex gap-2 mt-6">
            <div className="w-8 h-8 bg-bauhaus-red border-2 border-black" />
            <div className="w-8 h-8 bg-bauhaus-blue border-2 border-black" />
            <div className="w-8 h-8 bg-bauhaus-yellow border-2 border-black" />
          </div>
        </div>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-bauhaus-red transition-colors"
        >
          <ArrowLeft size={16} /> Back to {previousView === 'DASHBOARD' ? 'Dashboard' : previousView === 'WEEKLY' ? 'Weekly' : 'Monthly'}
        </button>
      </div>

      <div className="col-span-12 lg:col-span-8">
        <div className="bg-white border-4 border-black p-12 relative bauhaus-shadow">
          <div className="absolute -top-1 -left-1 w-8 h-8 bg-black" />
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="task-title" className="text-[10px] font-black uppercase tracking-widest">Task Title</label>
              <input 
                id="task-title"
                autoFocus
                placeholder="ENTER TASK NAME"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border-2 border-black p-4 text-xl font-bold uppercase placeholder:text-zinc-400 outline-none focus:border-bauhaus-blue transition-colors focus-visible:ring-4 focus-visible:ring-bauhaus-yellow"
                type="text" 
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="task-desc" className="text-[10px] font-black uppercase tracking-widest">Description</label>
              <textarea 
                id="task-desc"
                placeholder="DEFINE OBJECTIVES..."
                rows={4}
                className="w-full border-2 border-black p-4 text-sm font-medium placeholder:text-zinc-400 outline-none focus:border-bauhaus-blue transition-colors resize-none focus-visible:ring-4 focus-visible:ring-bauhaus-yellow"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <label htmlFor="task-due" className="text-[10px] font-black uppercase tracking-widest">Due Date (CALENDAR)</label>
                <input 
                  id="task-due"
                  type="date"
                  value={due}
                  onChange={(e) => setDue(e.target.value)}
                  className="w-full border-2 border-black p-4 text-sm font-bold outline-none focus:border-bauhaus-blue transition-colors cursor-pointer focus-visible:ring-4 focus-visible:ring-bauhaus-yellow"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest">Priority</label>
                <div className="flex border-2 border-black h-full overflow-hidden">
                   <PriorityBtn label="LOW" active={priority === 'LOW'} onClick={() => setPriority('LOW')} />
                   <PriorityBtn label="MID" active={priority === 'MID'} onClick={() => setPriority('MID')} />
                   <PriorityBtn label="HIGH" active={priority === 'HIGH'} onClick={() => setPriority('HIGH')} />
                </div>
              </div>
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black uppercase tracking-widest block">Categorization</label>
               <div className="flex flex-wrap gap-2">
                  <CategoryChip label="WORK" active={category === 'WORK'} onClick={() => setCategory('WORK')} color="bg-bauhaus-yellow" />
                  <CategoryChip label="PERSONAL" active={category === 'PERSONAL'} onClick={() => setCategory('PERSONAL')} />
                  <CategoryChip label="URGENT" active={category === 'URGENT'} onClick={() => setCategory('URGENT')} color="bg-bauhaus-red" />
                  <CategoryChip label="DESIGN_OPS" active={category === 'DESIGN_OPS'} onClick={() => setCategory('DESIGN_OPS')} />
               </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit"
                className="w-full bg-bauhaus-red text-white p-6 border-4 border-black text-2xl font-black uppercase flex justify-between items-center group active-press hover:bg-bauhaus-blue transition-all"
              >
                <span>{task ? 'UPDATE_TASK' : 'SAVE_TASK'}</span>
                <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function WeeklyView({ tasks, onEdit }: { tasks: Task[], onEdit: (task: Task) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    start.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(currentDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const navigateWeek = (direction: number) => {
    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(next);
  };

  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">Weekly_Flow</h2>
          <p className="text-xl font-light text-bauhaus-red mt-2">
            {months[weekStart.getMonth()]} {weekStart.getDate()} — {months[weekEnd.getMonth()]} {weekEnd.getDate()} / YEAR {weekStart.getFullYear()}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-bauhaus-blue text-white p-4 border-2 border-black w-24 h-24 flex flex-col items-center justify-center bauhaus-shadow-sm">
            <span className="text-2xl font-black">
              {Math.round((tasks.filter(t => t.status === 'COMPLETED').length / (tasks.length || 1)) * 100)}%
            </span>
            <span className="text-[8px] font-bold uppercase">Global</span>
          </div>
          <div className="flex flex-col gap-2">
            <button aria-label="Previous week" onClick={() => navigateWeek(-1)} className="border-2 border-black p-1 hover:bg-bauhaus-yellow active-click focus-visible:ring-2 focus-visible:ring-black"><ChevronLeft size={20} aria-hidden="true" /></button>
            <button aria-label="Next week" onClick={() => navigateWeek(1)} className="border-2 border-black p-1 hover:bg-bauhaus-yellow active-click focus-visible:ring-2 focus-visible:ring-black"><ChevronRight size={20} aria-hidden="true" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-4 border-black bg-white overflow-hidden">
        {weekDates.map((date, i) => {
          const dateStr = formatDate(date.toISOString().split('T')[0]);
          const dayTasks = tasks.filter(t => t.due === dateStr);
          const isToday = new Date().toDateString() === date.toDateString();

          return (
            <div key={i} className={`border-r-4 last:border-r-0 border-black min-h-[500px] flex flex-col ${i >= 5 ? 'bg-zinc-50' : 'bg-white'}`}>
               <header className={`p-4 border-b-4 border-black ${isToday ? 'bg-bauhaus-yellow' : 'bg-zinc-100'}`}>
                  <h3 className={`text-[10px] font-black uppercase ${isToday ? 'text-black' : ''}`}>
                    {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}_{date.getDate()}
                  </h3>
               </header>
               <div className="p-4 space-y-4">
                  {dayTasks.map(task => (
                    <WeekTask 
                      key={task.id}
                      task={task}
                      label={task.category} 
                      title={task.title} 
                      completed={task.status === 'COMPLETED'}
                      special={task.priority === 'HIGH'}
                      onClick={() => onEdit(task)}
                    />
                  ))}
                  {dayTasks.length === 0 && i > 4 && (
                    <div className="mt-20 text-center text-[10px] font-black opacity-20 italic">REST_BLOCK</div>
                  )}
               </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-4 gap-8">
          <StatBox label="Total_Week_Tasks" value={tasks.filter(t => {
            const taskDate = new Date(deformatDate(t.due));
            return taskDate >= weekStart && taskDate <= weekEnd;
          }).length.toString()} />
          <StatBox label="Efficiency_Rate" value={`${Math.round((tasks.filter(t => t.status === 'COMPLETED').length / (tasks.length || 1)) * 100)}%`} color="bg-bauhaus-red text-white" />
          <div className="col-span-2 border-4 border-black p-6 bg-white flex items-center gap-8 bauhaus-shadow">
             <div className="w-20 h-20 border-4 border-black rounded-full relative flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-bauhaus-yellow" style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%)' }} />
                <span className="relative font-black">75%</span>
             </div>
             <div>
                <h4 className="text-[10px] font-black uppercase opacity-60 mb-1">Project_Momentum</h4>
                <p className="text-[10px] font-bold uppercase">Unit_Alpha: On Track</p>
                <p className="text-[10px] font-bold uppercase">System: Operational</p>
             </div>
          </div>
      </div>
    </div>
  );
}

function MonthlyView({ tasks, onEdit }: { tasks: Task[], onEdit: (task: Task) => void }) {
  const [viewDate, setViewDate] = useState(new Date());
  const weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const offset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday start
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const navigateMonth = (direction: number) => {
    setViewDate(new Date(year, month + direction, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const todayStr = formatDate(today.toISOString().split('T')[0]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex justify-between items-end border-b-4 border-black pb-4">
        <div>
          <h2 className="text-5xl font-black uppercase tracking-tighter">{monthNames[month]} {year}</h2>
          <p className="text-[10px] font-black uppercase text-zinc-400 mt-2">Grid Unit 10 / Productivity Metrics {Math.round((tasks.filter(t => t.status === 'COMPLETED').length / (tasks.length || 1)) * 100)}%</p>
        </div>
        <div className="flex gap-2">
          <button aria-label="Previous month" onClick={() => navigateMonth(-1)} className="border-2 border-black px-4 py-2 font-bold hover:bg-bauhaus-yellow active-press focus-visible:ring-4 focus-visible:ring-black"><ChevronLeft size={20} aria-hidden="true" /></button>
          <button aria-label="Next month" onClick={() => navigateMonth(1)} className="border-2 border-black px-4 py-2 font-bold hover:bg-bauhaus-yellow active-press focus-visible:ring-4 focus-visible:ring-black"><ChevronRight size={20} aria-hidden="true" /></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-7 border-4 border-black bg-black gap-[2px]">
            {weekDays.map(d => (
              <div key={d} className="bg-zinc-100 p-2 text-center text-[10px] font-black">{d}</div>
            ))}
            {Array.from({ length: 42 }).map((_, i) => {
              const day = i - offset + 1;
              const isCurrent = day > 0 && day <= daysInMonth;
              const dateObj = new Date(year, month, day);
              const yyyy = dateObj.getFullYear();
              const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
              const dd = String(dateObj.getDate()).padStart(2, '0');
              const dateStr = isCurrent ? formatDate(`${yyyy}-${mm}-${dd}`) : '';
              const dayTasks = tasks.filter(t => t.due === dateStr);
              const isToday = isCurrent && today.toDateString() === dateObj.toDateString();
              
              const firstTask = dayTasks[0];
              const taskColorClass = !firstTask ? 'bg-white hover:bg-zinc-50' : 
                                    firstTask.status === 'COMPLETED' ? 'bg-black text-white' :
                                    firstTask.priority === 'HIGH' ? 'bg-bauhaus-red text-white' :
                                    firstTask.priority === 'MID' ? 'bg-bauhaus-yellow text-black' :
                                    'bg-bauhaus-blue text-white';

              return (
                <button 
                  key={i} 
                  aria-label={`${isCurrent ? `${monthNames[month]} ${day}, ${dayTasks.length} tasks` : 'Empty cell'}`}
                  className={`h-24 p-3 relative transition-all cursor-pointer group border-2 border-black text-left focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-black z-20 ${!isCurrent ? 'bg-zinc-100 opacity-30 pointer-events-none' : isToday ? 'ring-4 ring-inset ring-black z-10' : ''} ${isCurrent ? taskColorClass : ''}`}
                  onClick={() => isCurrent && firstTask && onEdit(firstTask)}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-black">{isCurrent ? String(day).padStart(2, '0') : ''}</span>
                    {isToday && <span className="bg-black text-white px-1 text-[8px] font-black uppercase">TODAY</span>}
                  </div>
                  
                  {isCurrent && firstTask && (
                    <div className="mt-2">
                       <p className={`text-[8px] font-black uppercase leading-tight line-clamp-2 ${firstTask.status === 'COMPLETED' ? 'line-through' : ''}`}>
                         {firstTask.title}
                       </p>
                    </div>
                  )}

                  {dayTasks.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-white text-black border border-black px-1 text-[8px] font-black">
                      +{dayTasks.length - 1}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="border-4 border-black p-6 bg-bauhaus-blue text-white bauhaus-shadow">
            <h3 className="text-xl font-black uppercase mb-4">MONTHLY_FOCUS</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center font-black text-xl">
                {Math.round((tasks.filter(t => t.status === 'COMPLETED').length / (tasks.length || 1)) * 100)}%
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase mb-2">COMPLETION_RATE</p>
                <div className="h-4 bg-white p-0.5 border-2 border-black">
                  <div className="h-full bg-bauhaus-red" style={{ width: `${Math.min(100, (tasks.filter(t => t.status === 'COMPLETED').length / (tasks.length || 1)) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="border-4 border-black p-6 bg-white bauhaus-shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black uppercase">UPCOMING_UNITS</h3>
              <span className="bg-bauhaus-yellow px-2 py-0.5 text-[8px] font-black">ACTIVE</span>
            </div>
            <div className="space-y-4">
              {tasks.filter(t => t.status === 'PENDING').slice(0, 5).map(task => (
                <div key={task.id} onClick={() => onEdit(task)} className="cursor-pointer hover:bg-zinc-50 p-1 transition-colors">
                  <MiniTask title={task.title} sub={`${task.category} / ${task.due}`} completed={task.status === 'COMPLETED'} />
                </div>
              ))}
              {tasks.filter(t => t.status === 'PENDING').length === 0 && (
                <p className="text-[10px] font-black uppercase opacity-40">No pending tasks</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniTask({ title, sub, completed }: { title: string, sub: string, completed?: boolean }) {
  return (
    <div className="flex items-center gap-4 border-b-2 border-zinc-100 pb-3 last:border-b-0">
      <div className={`w-5 h-5 border-2 border-black flex-shrink-0 ${completed ? 'bg-black flex items-center justify-center' : ''}`}>
        {completed && <Check size={12} className="text-white" strokeWidth={4} />}
      </div>
      <div>
        <div className={`text-[10px] font-black uppercase tracking-tight ${completed ? 'line-through opacity-40' : ''}`}>{title}</div>
        <div className="text-[8px] font-bold uppercase text-zinc-400">{sub}</div>
      </div>
    </div>
  );
}

function WeekTask({ task, label, title, time, completed, special, usersCount, onClick }: { task: Task, label: string, title: string, time?: string, completed?: boolean, special?: boolean, usersCount?: number, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick} 
      aria-label={`Edit task: ${title}, Category: ${label}, Status: ${completed ? 'Completed' : 'Pending'}`}
      className={`w-full text-left border-2 border-black p-4 transition-all group active-click cursor-pointer focus-visible:ring-4 focus-visible:ring-black focus-visible:outline-none ${completed ? 'opacity-40 grayscale strike-through' : special ? 'bg-bauhaus-yellow' : 'bg-white hover:bg-blue-50'}`}
    >
       <span className={`text-[8px] font-black px-1 mb-2 inline-block ${special ? 'bg-black text-white' : 'bg-bauhaus-red text-white'}`}>{label}</span>
       <p className="text-[10px] font-black uppercase leading-tight">{title}</p>
       {(time || usersCount) && (
         <div className="mt-4 pt-2 border-t border-black flex justify-between items-center text-[8px] font-black">
           {time && <div className="flex items-center gap-1 opacity-60"><Plus size={10} />{time}</div>}
           {usersCount && (
             <div className="flex -space-x-2">
                <div className="w-5 h-5 rounded-full bg-bauhaus-red border border-black" />
                <div className="w-5 h-5 rounded-full bg-bauhaus-blue border border-black" />
             </div>
           )}
         </div>
       )}
     </button>
   );
 }

function StatBox({ label, value, color = "bg-white" }: { label: string, value: string, color?: string }) {
  return (
    <div className={`border-4 border-black p-6 flex flex-col justify-between h-40 bauhaus-shadow ${color}`}>
      <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</h4>
      <span className="text-4xl font-black">{value}</span>
    </div>
  );
}

function CriticalCard({ title, deadline, color }: { title: string, deadline: string, color: string }) {
  return (
    <div className="p-4 bg-white text-black border-2 border-black bauhaus-shadow-sm active-press cursor-pointer">
      <p className={`text-[8px] font-black uppercase mb-1 ${color}`}>{deadline}</p>
      <p className="text-sm font-bold uppercase">{title}</p>
    </div>
  );
}

function PriorityBtn({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} type="button" className={`flex-1 font-black text-[10px] uppercase transition-colors border-r last:border-r-0 border-black ${active ? 'bg-bauhaus-yellow' : 'bg-white hover:bg-zinc-100'}`}>
      {label}
    </button>
  );
}

function CategoryChip({ label, active, onClick, color = 'bg-bauhaus-blue' }: { label: string, active?: boolean, onClick: () => void, color?: string }) {
  return (
    <button onClick={onClick} type="button" className={`border-2 border-black px-4 py-2 text-[10px] font-black uppercase transition-colors ${active ? `${color} ${color === 'bg-bauhaus-yellow' ? 'text-black' : 'text-white'}` : 'bg-white hover:bg-zinc-100 text-black'}`}>
      {label}
    </button>
  );
}

function FilterTab({ label, active, onClick }: { label: string, active?: boolean, onClick: () => void }) {
  return (
    <button onClick={onClick} className={`px-6 py-2 text-[10px] font-black uppercase tracking-tighter border-2 border-black transition-colors active-press ${active ? 'bg-black text-white' : 'bg-white hover:bg-bauhaus-yellow'}`}>
      {label}
    </button>
  );
}
