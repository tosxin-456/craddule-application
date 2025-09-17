import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    User,
    Users,
    CheckCircle,
    AlertCircle,
    Upload,
    MessageSquare,
    Check,
    X,
    Flag,
    Plus,
    Loader2,
    Search,
    ChevronDown,
    Pencil,
    ArrowLeft
} from 'lucide-react';
import { API_BASE_URL } from './config/apiConfig';
import Header from './component/header';
import { useNavigate } from 'react-router-dom';


const TaskViewer = () => {
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOwner, setIsOwner] = useState(false); // Mock as owner for demonstration
    const [currentUser, setCurrentUser] = useState({ _id: 'user123', firstName: 'John', lastName: 'Doe' });
    const [searchQuery, setSearchQuery] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const startEditing = () => setIsEditing(true);
    const stopEditing = () => setIsEditing(false);

    // Mock data for demonstration
    const projectId = localStorage.getItem('nProject');
    const access_token = localStorage.getItem('access_token');

    const fetchTask = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/timeline/projects/${projectId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log(data)
                setTasks(data.timelines || []);
                setIsOwner(data.isOwner);
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to fetch tasks');
            }

        } catch (err) {
            setError(err.message || 'An error occurred while fetching tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
        }
    };
    const navigate = useNavigate()

    useEffect(() => {
        fetchTask();
    }, []);

    useEffect(() => {
        const filtered = tasks.filter(task =>
            task.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.phase.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.users?.some(user =>
                `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
        setFilteredTasks(filtered);
    }, [searchQuery, tasks]);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'in_progress':
                return <div className="w-4 h-4 rounded-full border-2 border-yellow-500 border-t-transparent animate-spin"></div>;
            case 'not_started':
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
            default:
                return <AlertCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Completed';
            case 'in_progress':
                return 'In Progress';
            case 'not_started':
                return 'Not Started';
            default:
                return 'Unknown';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800';
            case 'not_started':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getDaysRemaining = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleApproval = async (taskId, approved) => {
        if (!isOwner) return;

        setTasks(tasks.map(task =>
            task._id === taskId
                ? { ...task, approvalStatus: approved ? 'approved' : 'rejected' }
                : task
        ));

        try {
            setLoading(true);

            const response = await fetch(`${API_BASE_URL}/api/timeline/approval/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify({
                    approvalStatus: approved ? 'approved' : 'rejected'
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('Approval updated:', data);

                // Optional: sync with server response if needed
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to update approval status');
            }

        } catch (err) {
            setError(err.message || 'An error occurred while updating approval status');
            console.error('Error updating approval:', err);
        } finally {
            setLoading(false);
        }

        console.log(`Task ${taskId} ${approved ? 'approved' : 'rejected'}`);
    };


    const handleStatusUpdate = async (taskId, newStatus) => {
        const updatedTasks = tasks.map(task => {
            if (task._id === taskId) {
                const updatedTask = { ...task, status: newStatus };
                if (newStatus === 'completed') {
                    updatedTask.completedAt = new Date().toISOString();
                }
                return updatedTask;
            }
            return task;
        });

        // Optimistically update UI
        setTasks(updatedTasks);

        try {
            setLoading(true);

            const body = { status: newStatus };
            if (newStatus === 'completed') {
                body.completedAt = new Date().toISOString();
            }

            const response = await fetch(`${API_BASE_URL}/api/timeline/status/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: JSON.stringify(body)
            });

            if (response.status === 200) {
                const data = await response.json();
                console.log('Status updated:', data);

                // Optional: sync with server response
                // setTasks(prev => prev.map(task => task._id === taskId ? data.task : task));
            } else {
                const result = await response.json();
                setError(result.error || 'Failed to update status');
            }

        } catch (err) {
            setError(err.message || 'An error occurred while updating status');
            console.error('Error updating task status:', err);
        } finally {
            setLoading(false);
        }

        console.log(`Task ${taskId} status updated to ${newStatus}`);
    };


    const getUserAvatar = (user) => {
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U';
    };

    const getUserFullName = (user) => {
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <span className="text-gray-600">Loading tasks...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-xl font-semibold text-gray-900 mb-2">Error Loading Tasks</p>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchTask}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div
                style={{ fontFamily: "Manrope, sans-serif" }}
                className="min-h-screen bg-gray-50 p-4"
            >
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between py-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 bg-blue600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2.5 text-white rounded-full transition-colors shadow-md text-sm">
                            <ArrowLeft size={16} />
                            <span className="font-medium">Back</span>
                        </button>


                        <div className=" ">
                            {isOwner && (
                                <button
                                    onClick={() => navigate('/createTask')}
                                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    <span onClick={() => navigate('/createTask')} >New Task</span>
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center w-fit m-auto justify-between gap-4 mb-4">
                            <div>
                                <p className="text-2xl font-bold text-center text-gray-900">Task Management</p>
                                <p className="text-gray-600 text-center text-sm">
                                    {isOwner
                                        ? "Manage your team's tasks and approve completed work"
                                        : "View your assigned tasks and track progress"
                                    }
                                </p>
                            </div>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tasks, phases, or assignees..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* No Tasks Message */}
                    {filteredTasks.length === 0 ? (
                        <div className="text-center py-12">
                            <Flag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-xl font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'No Tasks Found' : 'No Tasks Available'}
                            </p>
                            <p className="text-gray-600">
                                {searchQuery
                                    ? `No tasks match "${searchQuery}"`
                                    : isOwner
                                        ? "Get started by creating your first task."
                                        : "No tasks have been assigned to you yet."
                                }
                            </p>
                        </div>
                    ) : (
                        /* Tasks */
                        <div className="space-y-3">
                            {filteredTasks.map((task) => {
                                const daysRemaining = getDaysRemaining(task.endDate);
                                const isOverdue = daysRemaining < 0;
                                const canApprove = task.status === 'completed' &&
                                    isOwner
                                const canUpdateStatus = !isOwner || task.users?.some(user => user._id === currentUser._id);

                                return (
                                    <div key={task._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                        {/* Color accent bar */}
                                        <div
                                            className="h-1"
                                            style={{ backgroundColor: task.color || '#6B7280' }}
                                        ></div>

                                        <div className="p-4">
                                            {/* Task Header */}
                                            <div className="flex items-center justify-between gap-4 mb-3">
                                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                                    {getStatusIcon(task.status)}
                                                    <p className="font-semibold md:text-4xl text--md text-gray-900 ">{task.task}</p>

                                                    {/* Status Dropdown for owners and assigned users */}
                                                    {canUpdateStatus ? (
                                                        <div className="relative">
                                                            <select
                                                                value={task.status}
                                                                onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                                                className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)} cursor-pointer`}
                                                            >
                                                                <option value="not_started">Not Started</option>
                                                                <option value="in_progress">In Progress</option>
                                                                <option value="completed">Completed</option>
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                                                            {getStatusText(task.status)}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Approval Section for Owners */}
                                                <div className="flex items-center gap-2">
                                                    {/* Show approval buttons if editing or if approval is pending */}
                                                    {(isEditing || (canApprove && task.approvalStatus === 'pending')) && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-600">Approve?</span>
                                                            <button
                                                                onClick={() => { handleApproval(task._id, false); stopEditing(); }}
                                                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                                title="Reject"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { handleApproval(task._id, true); stopEditing(); }}
                                                                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                                title="Approve"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}

                                                    {/* Show Approved Status if not editing */}
                                                    {!isEditing && task.approvalStatus === 'approved' && (
                                                        <div className="flex items-center gap-1 text-green-600">
                                                            <Check className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Approved</span>
                                                            {canApprove && (
                                                                <button
                                                                    onClick={startEditing}
                                                                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                                    title="Change Decision"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Show Rejected Status if not editing */}
                                                    {!isEditing && task.approvalStatus === 'rejected' && (
                                                        <div className="flex items-center gap-1 text-red-600">
                                                            <X className="w-4 h-4" />
                                                            <span className="text-sm font-medium">Rejected</span>
                                                            {canApprove && (
                                                                <button
                                                                    onClick={startEditing}
                                                                    className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                                                                    title="Change Decision"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            {/* Task Details - Compact Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                                                {/* Assigned Users */}
                                                <div className="flex items-center gap-2">
                                                    <Users className="w-3 h-3 text-gray-400" />
                                                    <div className="flex items-center gap-1">
                                                        <div className="flex -space-x-1">
                                                            {task.users?.slice(0, 2).map((user) => (
                                                                <div
                                                                    key={user._id}
                                                                    className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium border-2 border-white cursor-pointer"
                                                                    title={getUserFullName(user)}
                                                                >
                                                                    {getUserAvatar(user)}
                                                                </div>
                                                            ))}
                                                            {(task.users?.length || 0) > 2 && (
                                                                <div
                                                                    className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white cursor-pointer"
                                                                    title={task.users?.slice(2).map(getUserFullName).join(', ')}
                                                                >
                                                                    +{(task.users?.length || 0) - 2}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-gray-600">
                                                            {task.users?.length || 0}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Phase & Assigned By */}
                                                <div className="flex items-center gap-1">
                                                    <Flag className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-600">{task.phase}</span>
                                                </div>

                                                {/* Dates */}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3 text-gray-400" />
                                                    <span className="text-xs text-gray-600">
                                                        {new Date(task.endDate).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                {/* Time Remaining */}
                                                <div className="flex items-center gap-1">
                                                    <Clock className={`w-3 h-3 ${isOverdue ? 'text-red-500' : 'text-gray-400'}`} />
                                                    <span className={`text-xs ${isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                                                        {isOverdue
                                                            ? `${Math.abs(daysRemaining)}d overdue`
                                                            : `${daysRemaining}d left`
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Features & Assigned By */}
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    {task.setQuestion && (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                                            <MessageSquare className="w-3 h-3" />
                                                            <span>Q&A</span>
                                                        </div>
                                                    )}
                                                    {task.setUpload && (
                                                        <div className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                                                            <Upload className="w-3 h-3" />
                                                            <span>Upload</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <User className="w-3 h-3" />
                                                    <span
                                                        className="cursor-pointer hover:text-gray-700"
                                                        title={`Assigned by ${getUserFullName(task.assignedBy)}`}
                                                    >
                                                        {getUserFullName(task.assignedBy)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Completion Info */}
                                            {task.status === 'completed' && task.completedAt && (
                                                <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-800">
                                                    <div className="flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        <span>
                                                            Completed on {new Date(task.completedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default TaskViewer;