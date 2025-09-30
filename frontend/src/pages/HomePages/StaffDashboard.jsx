import React, { useState, useEffect } from 'react';
import { User, Shield, Calendar, CheckCircle, AlertTriangle, UserCheck, UserX, Clock, Edit, Trash2, PlusCircle, Save } from 'lucide-react';
import axios from 'axios';

// --- Utility Components & Functions ---

// Global Message/Alert Modal Component (copied for completeness of the Staff Dashboard UI)
const AlertModal = ({ message, type, onClose }) => {
    if (!message) return null;

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-500' : 'bg-red-500';
    const Icon = isSuccess ? CheckCircle : AlertTriangle;
    const title = isSuccess ? 'Success' : 'Error';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className={`p-6 max-w-sm w-full rounded-xl shadow-2xl ${bgColor} text-white space-y-4`}>
                <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-xl font-bold">{title}</h3>
                </div>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="w-full py-2 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

// --- Mock Data ---

const MOCK_CLASSES = [
    {
        _id: "cls_101",
        name: "Yoga Fundamentals",
        time: "5:00 PM",
        day: "Wednesday",
        instructor: "Jane D.",
        capacity: 20,
        bookedStudents: [
            { id: 'STD_001', name: 'Alice Smith' },
            { id: 'STD_002', name: 'Bob Johnson' },
            { id: 'STD_003', name: 'Charlie Brown' },
            { id: 'STD_004', name: 'Diana Prince' },
        ],
        checkedInStudents: ['STD_001', 'STD_003'], // Only IDs
    },
    {
        _id: "cls_102",
        name: "Spin Class",
        time: "6:00 PM",
        day: "Thursday",
        instructor: "Mike T.",
        capacity: 25,
        bookedStudents: [
            { id: 'STD_005', name: 'Eve Adams' },
            { id: 'STD_006', name: 'Frank Miller' },
        ],
        checkedInStudents: [],
    },
];

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

// --- Staff Dashboard Sub-Components ---

// Form Modal for Creating/Updating Classes
const ClassFormModal = ({ mode, initialData, onClose, onSubmit, showAlert }) => {
    const isEdit = mode === 'edit';
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        time: initialData?.time || '6:00 AM',
        day: initialData?.day || daysOfWeek[0],
        instructor: initialData?.instructor || '',
        capacity: initialData?.capacity || 20,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'capacity' ? parseInt(value, 10) : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.instructor) {
            showAlert("Please fill in all required fields.", 'error');
            return;
        }
        // Safety check to prevent reducing capacity below current bookings
        if (formData.capacity < (initialData?.bookedStudents.length || 0)) {
            showAlert("Capacity cannot be less than the current number of booked students.", 'error');
            return;
        }

        onSubmit(isEdit ? { ...initialData, ...formData } : {
            ...formData,
            _id: 'cls_' + Date.now(), // Mock ID generation
            bookedStudents: [],
            checkedInStudents: []
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white p-8 max-w-lg w-full rounded-xl shadow-2xl">
                <h3 className="text-2xl font-bold text-purple-700 mb-6 border-b pb-2 flex items-center">
                    {isEdit ? <Edit className='w-5 h-5 mr-2' /> : <PlusCircle className='w-5 h-5 mr-2' />}
                    {isEdit ? `Edit Class: ${initialData.name}` : 'Create New Class'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Class Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Day</label>
                            <select
                                name="day"
                                value={formData.day}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            >
                                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Time</label>
                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Instructor</label>
                            <input
                                type="text"
                                name="instructor"
                                value={formData.instructor}
                                onChange={handleChange}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Capacity</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                min={initialData?.bookedStudents.length || 1}
                                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            <Save className='w-4 h-4 mr-2' />
                            {isEdit ? 'Save Changes' : 'Create Class'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Attendance Manager UI
const AttendanceManager = ({ classes, selectedClassId, setSelectedClassId, handleCheckIn, handleCheckOut, totalOccupancy }) => {
    const selectedClass = classes.find(c => c._id === selectedClassId);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-purple-700 flex items-center">
                <UserCheck className="w-6 h-6 mr-2" /> Attendance Manager
            </h2>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
                    <p className="text-sm font-medium text-purple-600">Total Checked In</p>
                    <p className="text-4xl font-extrabold text-purple-800">{totalOccupancy}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
                    <p className="text-sm font-medium text-purple-600">Total Booked Today</p>
                    <p className="text-4xl font-extrabold text-purple-800">
                        {classes.reduce((sum, cls) => sum + cls.bookedStudents.length, 0)}
                    </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
                    <p className="text-sm font-medium text-purple-600">Active Classes</p>
                    <p className="text-4xl font-extrabold text-purple-800">{classes.length}</p>
                </div>
            </div>

            {/* Class Selection and Roster View */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                
                {/* Class List (Col 1) */}
                <div className="lg:col-span-1 bg-gray-50 p-4 rounded-xl shadow-inner border border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2" /> Today's Classes</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {classes.map(cls => (
                            <button
                                key={cls._id}
                                onClick={() => setSelectedClassId(cls._id)}
                                className={`w-full text-left p-3 rounded-lg transition-colors border ${
                                    cls._id === selectedClassId
                                        ? 'bg-purple-500 text-white shadow-md'
                                        : 'bg-white text-gray-800 hover:bg-purple-100'
                                }`}
                            >
                                <p className="font-bold">{cls.name}</p>
                                <p className="text-xs flex items-center">
                                    <Clock className="w-3 h-3 mr-1"/> {cls.time} ({cls.checkedInStudents.length}/{cls.capacity})
                                </p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Roster Details (Col 2 & 3) */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg border border-purple-100">
                    {selectedClass ? (
                        <div className='space-y-4'>
                            <h3 className="text-2xl font-bold text-purple-600 border-b pb-2 mb-4">{selectedClass.name} Roster</h3>
                            
                            {/* Summary Bar */}
                            <div className='flex flex-wrap justify-between p-3 bg-purple-50 rounded-lg font-medium text-purple-800 text-sm'>
                                <span>Booked: {selectedClass.bookedStudents.length}</span>
                                <span>Checked In: {selectedClass.checkedInStudents.length}</span>
                                <span>Available Spots: {selectedClass.capacity - selectedClass.bookedStudents.length}</span>
                            </div>
                            
                            {/* Student List */}
                            <div className="max-h-96 overflow-y-auto space-y-2">
                                {selectedClass.bookedStudents.length === 0 ? (
                                    <p className="text-center text-gray-500 py-10">No students currently booked for this class.</p>
                                ) : (
                                    selectedClass.bookedStudents.map(student => {
                                        const isCheckedIn = selectedClass.checkedInStudents.includes(student.id);
                                        return (
                                            <div 
                                                key={student.id} 
                                                className={`flex justify-between items-center p-3 rounded-lg transition-colors ${
                                                    isCheckedIn ? 'bg-green-50' : 'bg-red-50'
                                                }`}
                                            >
                                                <div className='flex items-center space-x-3'>
                                                    {isCheckedIn 
                                                        ? <UserCheck className='w-5 h-5 text-green-600'/> 
                                                        : <User className='w-5 h-5 text-gray-500'/>
                                                    }
                                                    <div>
                                                        <p className="font-medium text-gray-900">{student.name}</p>
                                                        <p className="text-xs text-gray-500">ID: {student.id}</p>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                {isCheckedIn ? (
                                                    <button
                                                        onClick={() => handleCheckOut(selectedClass._id, student.id)}
                                                        className="flex items-center text-sm px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        <UserX className='w-4 h-4 mr-1'/> Check Out
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleCheckIn(selectedClass._id, student.id)}
                                                        className="flex items-center text-sm px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
                                                    >
                                                        <UserCheck className='w-4 h-4 mr-1'/> Check In
                                                    </button>
                                                )}
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 py-10">Select a class from the list to view the roster.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

// Class Manager UI
const ClassManager = ({ classes, handleOpenModal, handleDeleteClass }) => (
    <div className="space-y-6">
        <h2 className="text-3xl font-bold text-purple-700 flex items-center">
            <Shield className="w-6 h-6 mr-2" /> Class Management
        </h2>
        <button
            onClick={() => handleOpenModal('create', null)}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-md"
        >
            <PlusCircle className='w-5 h-5 mr-2' /> Create New Class
        </button>

        <div className="space-y-3">
            {classes.map(cls => (
                <div key={cls._id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex-grow min-w-0">
                        <p className="font-bold text-lg text-gray-800 truncate">{cls.name}</p>
                        <p className="text-sm text-gray-500">{cls.instructor} | {cls.day} at {cls.time}</p>
                        <p className="text-xs text-purple-600 mt-1">
                            Capacity: {cls.capacity} | Booked: {cls.bookedStudents.length}
                        </p>
                    </div>
                    <div className="flex space-x-2 flex-shrink-0 ml-4">
                        <button
                            onClick={() => handleOpenModal('edit', cls)}
                            className="p-2 text-purple-600 hover:text-purple-800 transition-colors rounded-full bg-purple-50 hover:bg-purple-100"
                            title="Edit Class"
                        >
                            <Edit className='w-5 h-5' />
                        </button>
                        <button
                            onClick={() => handleDeleteClass(cls._id)}
                            className="p-2 text-red-600 hover:text-red-800 transition-colors rounded-full bg-red-50 hover:bg-red-100"
                            title="Delete Class"
                        >
                            <Trash2 className='w-5 h-5' />
                        </button>
                    </div>
                </div>
            ))}
            {classes.length === 0 && (
                <p className="text-center text-gray-500 py-10 bg-white rounded-xl">No classes found. Use the button above to create one.</p>
            )}
        </div>
    </div>
);

// --- Staff Dashboard Main Component ---

const API_URL = "http://localhost:5000/api";

const StaffDashboard = () => {
    // Note: We use a function to initialize state so MOCK_CLASSES is used fresh, not the same object reference
    const [classes, setClasses] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(classes[0]?._id || null);
    
    // UI State for toggling views and modals
    const [viewMode, setViewMode] = useState('attendance'); // 'attendance' or 'management'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [editingClassData, setEditingClassData] = useState(null);
    const [alertState, setAlertState] = useState({ message, type: 'success' }); // State for custom alerts

    // Custom alert handler (replaces usage of external prop)
    const showAlert = (message, type = 'success') => {
        setAlertState({ message, type });
    };
    const closeAlert = () => {
        setAlertState({ message: '', type: 'success' });
    };

    useEffect(() => {
        // Fetch classes from backend
        axios.get(`${API_URL}/classes`)
            .then(res => setClasses(res.data.classes || []))
            .catch(() => setClasses([]));
    }, []);

    // --- Attendance/Check-in/Check-out Logic ---

    const handleCheckIn = (classId, studentId) => {
        setClasses(prevClasses => prevClasses.map(cls => {
            if (cls._id === classId) {
                if (cls.checkedInStudents.includes(studentId)) {
                    showAlert(`Student ${studentId} is already checked in to ${cls.name}.`, 'error');
                    return cls;
                }
                if (!cls.bookedStudents.map(s => s.id).includes(studentId)) {
                    showAlert(`Student ${studentId} is not booked for ${cls.name}.`, 'error');
                    return cls;
                }
                showAlert(`Student ${studentId} checked IN to ${cls.name}.`, 'success');
                return { ...cls, checkedInStudents: [...cls.checkedInStudents, studentId] };
            }
            return cls;
        }));
    };

    const handleCheckOut = (classId, studentId) => {
        setClasses(prevClasses => prevClasses.map(cls => {
            if (cls._id === classId) {
                const index = cls.checkedInStudents.indexOf(studentId);
                if (index === -1) {
                    showAlert(`Student ${studentId} is not checked in to ${cls.name}.`, 'error');
                    return cls;
                }
                showAlert(`Student ${studentId} checked OUT of ${cls.name}.`, 'success');
                return { ...cls, checkedInStudents: cls.checkedInStudents.filter(id => id !== studentId) };
            }
            return cls;
        }));
    };
    
    // --- Class Management CRUD Logic ---
    
    const handleOpenModal = (mode, data = null) => {
        setModalMode(mode);
        setEditingClassData(data);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClassData(null);
    };

    const handleClassSubmit = (classData) => {
        if (modalMode === 'create') {
            setClasses(prev => [...prev, classData]);
            showAlert(`Class '${classData.name}' created successfully.`, 'success');
        } else {
            setClasses(prev => prev.map(cls => 
                cls._id === classData._id ? classData : cls
            ));
            showAlert(`Class '${classData.name}' updated successfully.`, 'success');
        }
    };
    
    const handleDeleteClass = (classId) => {
        setClasses(prev => prev.filter(cls => cls._id !== classId));
        showAlert(`Class ID ${classId} deleted successfully.`, 'success');
    };

    const totalOccupancy = classes.reduce((sum, cls) => sum + cls.checkedInStudents.length, 0);

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl space-y-6 p-6">
            <h1 className="text-4xl font-extrabold text-violet-800 border-b pb-3">Staff Operations Dashboard</h1>
            
            {/* View Toggle */}
            <div className="flex justify-end space-x-2">
                <button
                    onClick={() => setViewMode('attendance')}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        viewMode === 'attendance' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <UserCheck className='w-5 h-5 mr-2' /> Attendance
                </button>
                <button
                    onClick={() => setViewMode('management')}
                    className={`flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                        viewMode === 'management' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <Shield className='w-5 h-5 mr-2' /> Class Management
                </button>
            </div>

            <div className="mt-4">
                {viewMode === 'attendance' ? (
                    <AttendanceManager 
                        classes={classes} 
                        selectedClassId={selectedClassId}
                        setSelectedClassId={setSelectedClassId}
                        handleCheckIn={handleCheckIn}
                        handleCheckOut={handleCheckOut}
                        totalOccupancy={totalOccupancy}
                    />
                ) : (
                    <ClassManager
                        classes={classes}
                        handleOpenModal={handleOpenModal}
                        handleDeleteClass={handleDeleteClass}
                    />
                )}
            </div>
            
            {/* Class Creation/Edit Modal */}
            {isModalOpen && (
                <ClassFormModal 
                    mode={modalMode}
                    initialData={editingClassData}
                    onClose={handleCloseModal}
                    onSubmit={handleClassSubmit}
                    showAlert={showAlert}
                />
            )}
        </div>
        
        {/* Custom Alert Modal (for display purposes) */}
        <AlertModal 
            message={alertState.message} 
            type={alertState.type} 
            onClose={closeAlert} 
        />
      </div>
    );
};

export default StaffDashboard;
