import { useState, useEffect } from 'react';
import { User, Users, BookOpen, Settings, Download, Lock, BarChart3, Calendar, Edit3, Check, X, Search, CheckCircle, Clock, XCircle } from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import { useAuth } from '../contexts/AuthContext';
import { useStudents } from '../hooks/useStudents';
import { useLecturers } from '../hooks/useLecturers';
import { useNominations } from '../hooks/useNominations';

const ProgramCoordinator = () => {
  const [currentPage, setCurrentPage] = useState('students');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingStudent, setEditingStudent] = useState(null);
  const [lockedStatus, setLockedStatus] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const { user } = useAuth();

  // Use hooks to get data from backend
  const { students, loading: studentsLoading, error: studentsError, updateStudent } = useStudents();
  const { lecturers } = useLecturers();
  const { nominations, updateNomination } = useNominations();


  const handleLockNomination = async (nominationId, locked) => {
    const nomination = nominations.find(n => n.id === nominationId);

    const nominationPayload = {
      student: nomination.student,
      examiner1: nomination.examiner1,
      examiner2: nomination.examiner2,
      examiner3: nomination.examiner3,
      research_title: nomination.research_title,
      chairperson: nomination.chairperson,
      is_locked: !locked,
    };
    const result = await updateNomination(nominationId, nominationPayload);

    if (result.success) {
      alert('Nomination locked successfully.');
    } else {
      alert('Failed to lock nomination: ' + result.error);
    }
  };

  // Available chairpersons - Based on real data from Excel
  const eligibleChairpersons = lecturers.filter((lect) => {
    if (!editingStudent) return false;

    const supervisor = editingStudent.supervisor;
    const coSupervisor = editingStudent.co_supervisor;
    const nomination = nominations.find(n => n.student === editingStudent.id);
    if (!nomination) return false;

    const examiner1 = nomination.examiner1;
    const examiner2 = nomination.examiner2;
    const examiner3 = nomination.examiner3;

    const isLecturerProfessor = lect.title === 1;
    const isLecturerAssociateOrAbove = lect.title <= 2;

    // Rule: Must be at least Associate Professor
    if (!isLecturerAssociateOrAbove) return false;

    // Rule: If supervisor or any examiner is Professor, chair must be Professor
    const supervisorIsProfessor = lecturers.find(l => l.id === supervisor)?.title === 1;
    const examiner1IsProfessor = lecturers.find(l => l.id === examiner1)?.title === 1;
    const examiner2IsProfessor = lecturers.find(l => l.id === examiner2)?.title === 1;
    const examiner3IsProfessor = lecturers.find(l => l.id === examiner3)?.title === 1;
    const mustBeProfessor = supervisorIsProfessor || examiner1IsProfessor || examiner2IsProfessor || examiner3IsProfessor;

    if (mustBeProfessor && !isLecturerProfessor) return false;

    // Rule: Cannot be supervisor, co-supervisor, or examiner
    if (
      lect.id === supervisor ||
      lect.id === coSupervisor ||
      lect.id === examiner1 ||
      lect.id === examiner2 ||
      lect.id === examiner3
    ) {
      return false;
    }

    // Rule: Max 4 sessions per department (count nominations with same chairperson in same dept)
    const chairedCount = nominations.filter(n => {
      const student = students.find(s => s.id === n.student_id);
      return n.chairperson === lect.id && student?.department === editingStudent.department;
    }).length;

    return chairedCount < 4;
  });

  // Enrich students data with nomination information
  const enrichedStudents = students.map(student => {
    const nomination = nominations.find(nom => nom.student && nom.student.id === student.id);
    
    const supervisorName = typeof student.supervisor === 'object' 
      ? student.supervisor.name 
      : lecturers.find(l => l.id === student.supervisor)?.name || student.supervisor || '';
    
    const coSupervisorName = typeof student.co_supervisor === 'object'
      ? student.co_supervisor?.name || ''
      : lecturers.find(l => l.id === student.co_supervisor)?.name || '';
    
    return {
      ...student,
      name: student.name || '',
      program: student.program || '',
      semester: student.semester || 1,
      evaluationType: student.evaluation_type === 'FIRST_EVALUATION' ? 'First Evaluation' : 'Re-Evaluation',
      mainSupervisor: supervisorName,
      coSupervisor: coSupervisorName,
      researchTitle: student.research_title || '',
      examiner1: nomination?.examiner1?.name || nomination?.examiner1_name || '',
      examiner2: nomination?.examiner2?.name || nomination?.examiner2_name || '',
      examiner3: nomination?.examiner3?.name || nomination?.examiner3_name || '',
      chairperson: nomination?.chairperson || '',
      status: nomination ? (nomination.chairperson ? 'Chair Assigned' : 'Pending Chair Assignment') : 'Pending Examiner Nomination'
    };
  });

  // Filter students based on search and filters
  const filteredStudents = enrichedStudents.filter(student => {
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mainSupervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.coSupervisor && student.coSupervisor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      student.examiner1.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.examiner2.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.examiner3.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.chairperson && student.chairperson.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const nomination = nominations.find(n => n.student === student.id);

    let derivedStatus = 'Pending Examiner Nomination';
    if (nomination?.examiner1 && nomination?.examiner2 && nomination?.examiner3) {
      derivedStatus = nomination.chairperson ? 'Chair Assigned' : 'Pending Chair Assignment';
    }

    const matchesStatus = filterStatus === 'all' || derivedStatus === filterStatus;
    const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const chairStats = filteredStudents.reduce(
    (acc, student) => {
      const nomination = nominations.find(n => n.student === student.id);
      const examinersReady = nomination?.examiner1 && nomination?.examiner2 && nomination?.examiner3;

      if (examinersReady && nomination?.chairperson) {
        acc.assigned++;
      } else if (nomination) {
        acc.pending++;
      }

      return acc;
    },
    { assigned: 0, pending: 0 }
  );

  const stats = {
    total: filteredStudents.length,
    pending: filteredStudents.filter(s => s.status === 'Pending Chair Assignment').length,
    assigned: filteredStudents.filter(s => s.status === 'Chair Assigned').length,
    postponed: 0
  };

  const StudentsList = () => (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Bar */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                placeholder="Search by name, title, supervisor, or examiner..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
            >
              <option value="all">All Status</option>
              <option value="Pending Examiner Nomination">Pending Examiner Nomination</option>
              <option value="Pending Chair Assignment">Pending Chair Assignment</option>
              <option value="Chair Assigned">Chair Assigned</option>
            </select>
          </div>

          {/* Program Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program
            </label>
            <select
              value={filterProgram}
              onChange={(e) => setFilterProgram(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
            >
              <option value="all">All Programs</option>
              <option value="PHD">PhD</option>
              <option value="MPHIL">MPhil</option>
              <option value="DSE">DSE</option>
            </select>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">
            {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleDownloadReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
          >
            <Download size={16} />
            <span>Download Report</span>
          </button>
          <button
            onClick={handleLockNominations}
            disabled={lockedStatus}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              lockedStatus 
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <Lock size={16} />
            <span>{lockedStatus ? 'Nominations Locked' : 'Lock Nominations'}</span>
          </button>
        </div>
      </div>

      {/* Results */}
      {studentsLoading ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-500">Loading students...</div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <div className="text-gray-500">
            <Search size={48} className="mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
            <p className="text-sm">Try adjusting your search terms or filters</p>
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats for Filtered Results */}
          {(searchTerm || filterStatus !== 'all' || filterProgram !== 'all') && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <div className="text-sm text-gray-600">Filtered Results</div>
                <div className="text-2xl font-bold text-gray-900">{filteredStudents.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
                <div className="text-sm text-gray-600">Chair Assigned</div>
                <div className="text-2xl font-bold text-gray-900">{chairStats.assigned}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
                <div className="text-sm text-gray-600">Pending</div>
                <div className="text-2xl font-bold text-gray-900">{chairStats.pending}</div>
              </div>
            </div>
          )}

          {/* Students Cards Layout */}
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                  
                  {/* Student Info */}
                  <div className="lg:col-span-2">
                    <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                    <div className="text-xs text-gray-600">{student.program} - Sem {student.semester}</div>
                    <div className="text-xs text-blue-600">{student.evaluationType}</div>
                  </div>

                  {/* Research Info */}
                  <div className="lg:col-span-4">
                    <div className="text-sm text-gray-900 font-medium mb-1 line-clamp-2">{student.researchTitle}</div>
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">Supervisor:</span> {student.mainSupervisor}
                      {student.coSupervisor && (
                        <span className="block">
                          <span className="font-medium">Co-Supervisor:</span> {student.coSupervisor}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Examiners */}
                  <div className="lg:col-span-3">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center">
                        {(() => {
                          const nomination = nominations.find(n => n.student === student.id);
                          const isAssigned = !!nomination?.examiner1;
                          return (
                            <CheckCircle
                              size={12}
                              className={`${isAssigned ? "text-green-500" : "text-gray-300"} mr-1`}
                            />
                          );
                        })()}
                        <span className={student.examiner1 ? "text-gray-700" : "text-gray-400"}>
                          {(() => {
                            const nomination = nominations.find(n => n.student === student.id);
                            const examiner1 = lecturers.find(l => l.id === nomination?.examiner1);
                            return examiner1?.name || "Pending Examiner 1";
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {(() => {
                          const nomination = nominations.find(n => n.student === student.id);
                          const isAssigned = !!nomination?.examiner2;
                          return (
                            <CheckCircle
                              size={12}
                              className={`${isAssigned ? "text-green-500" : "text-gray-300"} mr-1`}
                            />
                          );
                        })()}
                        <span className={student.examiner2 ? "text-gray-700" : "text-gray-400"}>
                          {(() => {
                            const nomination = nominations.find(n => n.student === student.id);
                            const examiner2 = lecturers.find(l => l.id === nomination?.examiner2);
                            return examiner2?.name || "Pending Examiner 2";
                          })()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {(() => {
                          const nomination = nominations.find(n => n.student === student.id);
                          const isAssigned = !!nomination?.examiner3;
                          return (
                            <CheckCircle
                              size={12}
                              className={`${isAssigned ? "text-green-500" : "text-gray-300"} mr-1`}
                            />
                          );
                        })()}
                        <span className={student.examiner3 ? "text-gray-700" : "text-gray-400"}>
                          {(() => {
                            const nomination = nominations.find(n => n.student === student.id);
                            const examiner3 = lecturers.find(l => l.id === nomination?.examiner3);
                            return examiner3?.name || "Pending Examiner 3";
                          })()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const nomination = nominations.find(n => n.student === student.id);
                    const chairAssigned = nomination?.chairperson != null;
                    let statusLabel = 'Pending Examiner Nomination';
                    let nominationExists = !!nomination;

                    if (nomination) {
                      const { examiner1, examiner2, examiner3, chairperson } = nomination;

                      const allExaminersAssigned = examiner1 && examiner2 && examiner3;

                      if (!allExaminersAssigned) {
                        statusLabel = 'Pending Examiner Nomination';
                        nominationExists = false;
                      } else if (!chairperson) {
                        statusLabel = 'Pending Chair Assignment';
                      } else {
                        statusLabel = 'Chair Assigned';
                      }
                    }
                    const statusColor = !nominationExists
                      ? 'bg-red-100 text-red-800'
                      : chairAssigned
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800';

                    return (
                      <>
                        {/* Chairperson & Status */}
                        <div className="lg:col-span-2">
                          <div className="text-xs mb-2">
                            <span className="font-medium">Chairperson:</span>
                            <span className={`block ${chairAssigned ? "text-gray-700" : "text-gray-400"}`}>
                              {chairAssigned
                                ? lecturers.find(l => l.id === nomination?.chairperson)?.name || 'Unknown'
                                : 'Not Assigned'}
                            </span>
                          </div>
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${statusColor}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 flex flex-col justify-end">
                          {nominationExists && (
                            <button
                              onClick={() => openModal('assign', student)}
                              className={`px-3 py-1 rounded mb-2 text-xs ${
                                chairAssigned
                                  ? 'text-burgundy-700 border border-burgundy-700 hover:bg-burgundy-50'
                                  : 'bg-burgundy-700 text-white hover:bg-burgundy-800'
                              }`}
                            >
                              {chairAssigned ? 'Edit Chair' : 'Assign Chair'}
                            </button>
                          )}
                          {nominationExists && chairAssigned && (
                            <button
                              onClick={() => handleLockNomination(nomination.id, nomination.is_locked)}
                              className="text-xs px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              {nomination.is_locked ? 'Unlock Nomination' : 'Lock Nomination'}
                            </button>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  const StatisticsView = () => {
    const allStudents = enrichedStudents;
    const stats = nominations.reduce(
      (acc, nom) => {
        const hasAllExaminers = nom.examiner1 && nom.examiner2 && nom.examiner3;
        if (!hasAllExaminers) {
          acc.pendingExaminers++;
        } else if (!nom.chairperson) {
          acc.pendingChair++;
        } else {
          acc.chairAssigned++;
        }
        return acc;
      },
      { chairAssigned: 0, pendingChair: 0, pendingExaminers: 0 }
    );
    
    return (
      <div className="space-y-6">
        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{allStudents.length}</div>
                <div className="text-sm text-gray-500">Total Students</div>
              </div>
              <BookOpen className="h-8 w-8 text-burgundy-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.chairAssigned}
                </div>
                <div className="text-sm text-gray-500">Chair Assigned</div>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.pendingChair}
                </div>
                <div className="text-sm text-gray-500">Pending Chair</div>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {stats.pendingExaminers}
                </div>
                <div className="text-sm text-gray-500">Pending Examiners</div>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Program Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Students by Program</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {allStudents.filter(s => s.program === 'PHD').length}
              </div>
              <div className="text-sm text-gray-500">PhD</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {allStudents.filter(s => s.program === 'MPHIL').length}
              </div>
              <div className="text-sm text-gray-500">MPhil</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {allStudents.filter(s => s.program === 'DSE').length}
              </div>
              <div className="text-sm text-gray-500">DSE</div>
            </div>
          </div>
        </div>

        {/* Evaluation Type Breakdown */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluation Types</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">First Evaluation</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${(allStudents.filter(s => s.evaluationType === 'First Evaluation').length / allStudents.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {allStudents.filter(s => s.evaluationType === 'First Evaluation').length}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Re-Evaluation</span>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${(allStudents.filter(s => s.evaluationType === 'Re-Evaluation').length / allStudents.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {allStudents.filter(s => s.evaluationType === 'Re-Evaluation').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal handlers
  const openModal = (type, student) => {
    setModalType(type);
    setEditingStudent(student);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStudent(null);
  };

  const handleAssignChairperson = async () => {
    if (!editingStudent) return;

    console.log('Student:', editingStudent);
    console.log(nominations);
    const nomination = nominations.find(nom => nom.student === editingStudent.id);
    console.log(nomination);
    if (nomination) {
      const result = await updateNomination(nomination.id, {
        ...nomination,
        chairperson: editingStudent.chairperson
      });

      if (result.success) {
        closeModal();
      } else {
        alert(`Failed to assign chairperson: ${result.error}`);
      }
    } else {
      alert('No nomination found for this student. Please ensure examiners are nominated first.');
    }
  };

  const handleLockNominations = () => {
    setLockedStatus(true);
    alert('Nominations have been locked. Supervisors can no longer make changes.');
  };

  const handleDownloadReport = () => {
    // Create CSV content
    const csvContent = generateCSVReport();
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `First_Stage_Evaluation_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCSVReport = () => {
    const headers = [
      'Student Name',
      'Program',
      'Semester',
      'Evaluation Type',
      'Main Supervisor',
      'Co-Supervisor',
      'Research Title',
      'Examiner 1',
      'Examiner 2', 
      'Examiner 3',
      'Chairperson',
      'Status'
    ];

    const csvRows = [headers.join(',')];

    enrichedStudents.forEach(student => {
      const row = [
        `"${student.name}"`,
        student.program,
        student.semester,
        `"${student.evaluationType}"`,
        `"${student.mainSupervisor}"`,
        `"${student.coSupervisor || ''}"`,
        `"${student.researchTitle}"`,
        `"${student.examiner1 || ''}"`,
        `"${student.examiner2 || ''}"`,
        `"${student.examiner3 || ''}"`,
        `"${student.chairperson || ''}"`,
        `"${student.status}"`
      ];
      csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
  };

  // Modal for assigning chairperson
  const renderModal = () => (
    showModal && modalType === 'assign' && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Assign Chairperson - {editingStudent?.name}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Chairperson
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                value={editingStudent?.chairperson || ''}
                onChange={(e) => setEditingStudent({...editingStudent, chairperson: e.target.value})}
              >
                <option value="">Select a chairperson</option>
                {eligibleChairpersons.map(chair => (
                  <option key={chair.id} value={chair.id}>
                    {chair.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignChairperson}
              className="px-4 py-2 bg-burgundy-700 text-white rounded-md hover:bg-burgundy-800"
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-burgundy-700 flex items-center justify-center">
                <div className="text-yellow-400 text-sm font-bold">UTM</div>
              </div>
              <h1 className="ml-3 text-xl font-bold text-burgundy-700">Program Coordinator Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.username || 'Coordinator'}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setCurrentPage('students')}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                currentPage === 'students'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BookOpen size={16} />
              <span>Student Evaluations</span>
            </button>
            <button
              onClick={() => setCurrentPage('statistics')}
              className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                currentPage === 'statistics'
                  ? 'border-burgundy-500 text-burgundy-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} />
              <span>Statistics</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'students' && <StudentsList />}
        {currentPage === 'statistics' && <StatisticsView />}
      </div>

      {/* Modals */}
      {renderModal()}
    </div>
  );
};

// Custom styles for UTM burgundy color
const style = document.createElement('style');
document.head.appendChild(style);
style.sheet.insertRule(`
  .text-burgundy-700 {
    color: #8E2246;
  }
`);
style.sheet.insertRule(`
  .bg-burgundy-700 {
    background-color: #8E2246;
  }
`);
style.sheet.insertRule(`
  .border-burgundy-500 {
    border-color: #A52A5A;
  }
`);
style.sheet.insertRule(`
  .text-burgundy-600 {
    color: #A52A5A;
  }
`);
style.sheet.insertRule(`
  .focus\\:ring-burgundy-500:focus {
    --tw-ring-color: rgba(165, 42, 90, 0.5);
  }
`);
style.sheet.insertRule(`
  .bg-burgundy-100 {
    background-color: #fdf2f8;
  }
`);
style.sheet.insertRule(`
  .hover\\:bg-burgundy-200:hover {
    background-color: #fce7f3;
  }
`);
style.sheet.insertRule(`
  .hover\\:bg-burgundy-800:hover {
    background-color: #7D1D3F;
  }
`);
style.sheet.insertRule(`
  .bg-burgundy-800 {
    background-color: #7D1D3F;
  }
`);
style.sheet.insertRule(`
  .hover\\:bg-burgundy-50:hover {
    background-color: #fef2f2;
  }
`);

export default ProgramCoordinator;