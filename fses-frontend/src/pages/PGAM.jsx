"use client"

import { useState } from "react"
import { BarChart3, BookOpen, Users, Calendar, Eye, Download, Search, Edit, X, Save } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import LogoutButton from "../components/LogoutButton"
import { useStudents } from "../hooks/useStudents"
import { useLecturers } from "../hooks/useLecturers"
import { useNominations } from "../hooks/useNominations"
import { useDepartments } from "../hooks/useDepartments"

// EditModal component defined outside of PGAM to prevent re-renders
const EditModal = ({
  showModal,
  editingStudent,
  modalType,
  availableExaminers,
  eligibleChairpersons,
  lecturers,
  nominations,
  onClose,
  onSave,
}) => {
  const [localStudent, setLocalStudent] = useState(editingStudent || {})

  // Update local state when editingStudent changes
  useState(() => {
    if (editingStudent) {
      setLocalStudent(editingStudent)
    }
  }, [editingStudent])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalStudent((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSave = () => {
    onSave(localStudent)
  }

  if (!showModal || !editingStudent) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {modalType === "examiners" ? "Edit Examiners" : "Edit Chairperson"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Student: {localStudent.name}</p>
          <p className="text-sm text-gray-600 mb-4">Research: {localStudent.researchTitle}</p>
        </div>

        {modalType === "examiners" ? (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner 1</label>
              <select
                name="examiner1"
                value={localStudent.examiner1 || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Examiner 1</option>
                {availableExaminers.map((examiner) => (
                  <option key={`ex1-${examiner}`} value={examiner}>
                    {examiner}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner 2</label>
              <select
                name="examiner2"
                value={localStudent.examiner2 || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Examiner 2</option>
                {availableExaminers.map((examiner) => (
                  <option key={`ex2-${examiner}`} value={examiner}>
                    {examiner}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner 3</label>
              <select
                name="examiner3"
                value={localStudent.examiner3 || ""}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              >
                <option value="">Select Examiner 3</option>
                {availableExaminers.map((examiner) => (
                  <option key={`ex3-${examiner}`} value={examiner}>
                    {examiner}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chairperson</label>
            <select
              name="chairperson"
              value={
                lecturers.find((l) => l.id === nominations.find((n) => n.student === localStudent.id)?.chairperson)
                  ?.name || ""
              }
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
            >
              <option value="">Select Chairperson</option>
              {eligibleChairpersons.map((chair) => (
                <option key={chair.id} value={chair.name}>
                  {chair.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-burgundy-700 text-white rounded-md hover:bg-burgundy-800 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Page components defined outside of PGAM to prevent re-renders
const OverviewPage = ({ stats, departments }) => (
  <div className="space-y-6">
    {/* Summary Cards */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Students</div>
          </div>
          <BookOpen className="h-8 w-8 text-burgundy-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-green-600">{stats.byStatus["Chair Assigned"]}</div>
            <div className="text-sm text-gray-500">Chair Assigned</div>
          </div>
          <Users className="h-8 w-8 text-green-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-yellow-600">{stats.byStatus["Pending Chair Assignment"]}</div>
            <div className="text-sm text-gray-500">Pending Chair</div>
          </div>
          <Calendar className="h-8 w-8 text-yellow-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-red-600">{stats.byStatus["Pending Examiner Nomination"]}</div>
            <div className="text-sm text-gray-500">No Examiners</div>
          </div>
          <Eye className="h-8 w-8 text-red-600" />
        </div>
      </div>
    </div>

    {/* Department Statistics */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Students by Department</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats.byDepartment).map(([dept, count]) => (
          <div key={dept} className="text-center">
            <div className="text-2xl font-bold text-burgundy-600">{count}</div>
            <div className="text-sm text-gray-500">{dept}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Program Distribution */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Program Distribution</h3>
      <div className="space-y-3">
        {Object.entries(stats.byProgram).map(([program, count]) => (
          <div key={program} className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">{program}</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                <div
                  className="bg-burgundy-700 h-2 rounded-full"
                  style={{ width: `${(count / stats.total) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">{count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

const StudentsPage = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  departments,
  filteredStudents,
  nominations,
  lecturers,
  handleDownloadReport,
  openEditModal,
}) => (
  <div className="space-y-6">
    {/* Filters */}
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-burgundy-500"
              placeholder="Search students, research titles..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-burgundy-500"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleDownloadReport}
            className="bg-burgundy-700 text-white px-4 py-2 rounded-md hover:bg-burgundy-800 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>

    {/* Students Table */}
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Supervisor
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Research Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Examiners
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chairperson
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Program Coordinator
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">{student.name}</div>
                  <div className="text-sm text-gray-500">
                    {student.program} - Semester {student.semester}
                  </div>
                  <div className="text-xs text-blue-600">{student.evaluationType}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">{student.department}</span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{student.mainSupervisor}</div>
                {student.coSupervisor && <div className="text-xs text-gray-500">Co: {student.coSupervisor}</div>}
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 line-clamp-2">
                  {nominations.find((n) => n.student === student.id)?.research_title || "N/A"}
                </div>
              </td>
              <td className="px-1 py-4 whitespace-nowrap">
                <div className="text-xs space-y-1">
                  <div>
                    1.{" "}
                    {lecturers.find((l) => l.id === nominations.find((n) => n.student === student.id)?.examiner1)
                      ?.name || <span className="text-gray-400">Pending</span>}
                  </div>
                  <div>
                    2.{" "}
                    {lecturers.find((l) => l.id === nominations.find((n) => n.student === student.id)?.examiner2)
                      ?.name || <span className="text-gray-400">Pending</span>}
                  </div>
                  <div>
                    3.{" "}
                    {lecturers.find((l) => l.id === nominations.find((n) => n.student === student.id)?.examiner3)
                      ?.name || <span className="text-gray-400">Pending</span>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {lecturers.find((l) => l.id === nominations.find((n) => n.student === student.id)?.chairperson)
                    ?.name || <span className="text-gray-400">Not Assigned</span>}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {(() => {
                  const nomination = nominations.find((n) => n.student === student.id)
                  const chairAssigned = nomination?.chairperson != null
                  let statusLabel = "Pending Examiner Nomination"
                  let nominationExists = !!nomination

                  if (nomination) {
                    const { examiner1, examiner2, examiner3, chairperson } = nomination
                    const allExaminersAssigned = examiner1 && examiner2 && examiner3
                    if (!allExaminersAssigned) {
                      statusLabel = "Pending Examiner Nomination"
                      nominationExists = false
                    } else if (!chairperson) {
                      statusLabel = "Pending Chair Assignment"
                    } else {
                      statusLabel = "Chair Assigned"
                    }
                  }

                  const statusColor = !nominationExists
                    ? "bg-red-100 text-red-800"
                    : chairAssigned
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"

                  return (
                    <>
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </>
                  )
                })()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.coordinator}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex flex-col space-y-3">
                <button
                  onClick={() => openEditModal(student, "examiners")}
                  className={`mr-2 flex items-center space-x-2  ${
                    nominations.find((n) => n.student === student.id)
                      ? "text-green-600 hover:text-green-800 cursor-pointer"
                      : "text-gray-400 hover:text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={nominations.find((n) => n.student === student.id) == null}
                >
                  <Edit size={16} />
                  <span>Edit Examiners</span>
                </button>
                <button
                  onClick={() => openEditModal(student, "chairperson")}
                  className={`flex items-center space-x-2 ${
                    nominations.find((n) => n.student === student.id)
                      ? "text-indigo-500 hover:text-indigo-900 cursor-pointer"
                      : "text-gray-400 hover:text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={nominations.find((n) => n.student === student.id) == null}
                >
                  <Edit size={16} />
                  <span>Edit Chairperson</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)

const WorkloadPage = ({ examinerWorkload, chairpersonWorkload }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Examiner Workload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Examiner Workload</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(examinerWorkload)
            .sort(([, a], [, b]) => b - a)
            .map(([examiner, count]) => (
              <div key={examiner} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700 truncate">{examiner}</span>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full ml-2">
                  {count} session{count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Chairperson Workload */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Chairperson Workload</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {Object.entries(chairpersonWorkload)
            .sort(([, a], [, b]) => b - a)
            .map(([chairperson, count]) => (
              <div key={chairperson} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700 truncate">{chairperson}</span>
                <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full ml-2">
                  {count} session{count !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>

    {/* Summary Statistics */}
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Workload Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{Object.keys(examinerWorkload).length}</div>
          <div className="text-sm text-gray-500">Total Examiners Assigned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{Object.keys(chairpersonWorkload).length}</div>
          <div className="text-sm text-gray-500">Total Chairpersons Assigned</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">
            {Math.round(
              (Object.values(examinerWorkload).reduce((a, b) => a + b, 0) /
                Math.max(Object.keys(examinerWorkload).length, 1)) *
                100,
            ) / 100}
          </div>
          <div className="text-sm text-gray-500">Avg. Sessions per Examiner</div>
        </div>
      </div>
    </div>
  </div>
)

const PGAM = () => {
  const [currentPage, setCurrentPage] = useState("overview")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()
  const [editingStudent, setEditingStudent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")

  // Use hooks to get data from backend
  const { students, loading: studentsLoading } = useStudents()
  const { lecturers } = useLecturers()
  const { nominations, updateNomination } = useNominations()
  const { departments } = useDepartments()

  // Available examiners and chairpersons
  const availableExaminers = lecturers
    .filter((l) => {
      if (!editingStudent) return false
      const nomination = nominations.find((n) => n.student === editingStudent.id)
      const supervisor = editingStudent.supervisor
      const coSupervisor = editingStudent.co_supervisor

      if (!nomination) {
        if (l.id === supervisor || l.id === coSupervisor) {
          return false
        } else {
          return true
        }
      }

      if (l.university !== "UTM") return false

      const examiner1 = nomination.examiner1
      const examiner2 = nomination.examiner2
      const examiner3 = nomination.examiner3

      if (l.id === examiner1 || l.id === examiner2 || l.id === examiner3) {
        return false
      }

      return l
    })
    .map((l) => l.name.toUpperCase())

  const availableChairpersons = lecturers
    .filter((l) => l.university === "UTM" && l.title === 1)
    .map((l) => l.name.toUpperCase())

  const eligibleChairpersons = lecturers.filter((lect) => {
    if (!editingStudent) return false

    const supervisor = editingStudent.supervisor
    const coSupervisor = editingStudent.co_supervisor
    const nomination = nominations.find((n) => n.student === editingStudent.id)

    if (lect.university !== "UTM") return false
    if (!nomination) return false

    const examiner1 = nomination.examiner1
    const examiner2 = nomination.examiner2
    const examiner3 = nomination.examiner3

    const isLecturerProfessor = lect.title === 1
    const isLecturerAssociateOrAbove = lect.title <= 2

    // Rule: Must be at least Associate Professor
    if (!isLecturerAssociateOrAbove) return false

    // Rule: If supervisor or any examiner is Professor, chair must be Professor
    const supervisorIsProfessor = lecturers.find((l) => l.id === supervisor)?.title === 1
    const examiner1IsProfessor = lecturers.find((l) => l.id === examiner1)?.title === 1
    const examiner2IsProfessor = lecturers.find((l) => l.id === examiner2)?.title === 1
    const examiner3IsProfessor = lecturers.find((l) => l.id === examiner3)?.title === 1

    const mustBeProfessor =
      supervisorIsProfessor || examiner1IsProfessor || examiner2IsProfessor || examiner3IsProfessor

    if (mustBeProfessor && !isLecturerProfessor) return false

    // Rule: Cannot be supervisor, co-supervisor, or examiner
    if (
      lect.id === supervisor ||
      lect.id === coSupervisor ||
      lect.id === examiner1 ||
      lect.id === examiner2 ||
      lect.id === examiner3
    ) {
      return false
    }

    // Rule: Max 4 sessions per department (count nominations with same chairperson in same dept)
    const chairedCount = nominations.filter((n) => {
      const student = students.find((s) => s.id === n.student_id)
      return n.chairperson === lect.id && student?.department === editingStudent.department
    }).length

    return chairedCount < 4
  })

  // Process students data with nominations
  const allStudents = students.map((student) => {
    const nomination = nominations.find((nom) => nom.student === student.id)

    const supervisorName =
      typeof student.supervisor === "object"
        ? student.supervisor.name
        : lecturers.find((l) => l.id === student.supervisor)?.name || ""

    const coSupervisorName =
      typeof student.co_supervisor === "object"
        ? student.co_supervisor?.name || ""
        : lecturers.find((l) => l.id === student.co_supervisor)?.name || ""

    const departmentInfo =
      typeof student.department === "object"
        ? student.department
        : departments.find((d) => d.id === student.department) || {}

    return {
      id: student.id,
      name: student.name?.toUpperCase() || "",
      matrikNo: student.matrik_no || `STD${student.id}`,
      program: student.program || "",
      department: departmentInfo.name || departmentInfo.code || "N/A",
      evaluationType: student.evaluation_type === "FIRST_EVALUATION" ? "First Evaluation" : "Re-Evaluation",
      semester: student.semester || 1,
      mainSupervisor: supervisorName.toUpperCase(),
      coSupervisor: coSupervisorName.toUpperCase(),
      researchTitle: nomination?.research_title?.toUpperCase() || "",
      examiner1: nomination?.examiner1?.name?.toUpperCase() || "",
      examiner2: nomination?.examiner2?.name?.toUpperCase() || "",
      examiner3: nomination?.examiner3?.name?.toUpperCase() || "",
      chairperson: lecturers.find((l) => l.id == nomination?.chairperson)?.name.toUpperCase() || "",
      status: nomination
        ? nomination.chairperson
          ? "Chair Assigned"
          : "Pending Chair Assignment"
        : "Pending Examiner Nomination",
      coordinator: "PROGRAM COORDINATOR", // This could be enhanced to show actual coordinator
      supervisor: student.supervisor,
      co_supervisor: student.co_supervisor,
    }
  })

  const newStats = nominations.reduce(
    (acc, nom) => {
      const hasAllExaminers = nom.examiner1 && nom.examiner2 && nom.examiner3
      if (!hasAllExaminers) {
        acc.pendingExaminers++
      } else if (!nom.chairperson) {
        acc.pendingChair++
      } else {
        acc.chairAssigned++
      }
      return acc
    },
    { chairAssigned: 0, pendingChair: 0, pendingExaminers: 0 },
  )

  // Calculate comprehensive statistics
  const stats = {
    total: allStudents.length,
    byDepartment: departments.reduce((acc, dept) => {
      acc[dept.name] = allStudents.filter((s) => s.department === dept.name).length
      return acc
    }, {}),
    byStatus: {
      "Chair Assigned": newStats.chairAssigned,
      "Pending Chair Assignment": newStats.pendingChair,
      "Pending Examiner Nomination": newStats.pendingExaminers,
    },
    byProgram: {
      PHD: allStudents.filter((s) => s.program === "PHD").length,
      MPHIL: allStudents.filter((s) => s.program === "MPHIL").length,
      DSE: allStudents.filter((s) => s.program === "DSE").length,
    },
  }

  // Examiner workload analysis
  const examinerWorkload = {}
  nominations.forEach((nomination) => {
    const examiner1_name = lecturers.find((l) => l.id === nomination.examiner1)?.name
    const examiner2_name = lecturers.find((l) => l.id === nomination.examiner2)?.name
    const examiner3_name = lecturers.find((l) => l.id === nomination.examiner3)?.name
    ;[examiner1_name, examiner2_name, examiner3_name].forEach((examiner) => {
      if (examiner && examiner.trim()) {
        examinerWorkload[examiner] = (examinerWorkload[examiner] || 0) + 1
      }
    })
  })

  // Chairperson workload analysis
  const chairpersonWorkload = {}
  allStudents.forEach((student) => {
    if (student.chairperson && student.chairperson.trim()) {
      chairpersonWorkload[student.chairperson] = (chairpersonWorkload[student.chairperson] || 0) + 1
    }
  })

  // Filter students based on search and department
  const filteredStudents = allStudents.filter((student) => {
    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.researchTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.mainSupervisor.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDepartment && matchesSearch
  })

  // Modal handlers for editing
  const openEditModal = (student, type) => {
    setEditingStudent({ ...student })
    setModalType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingStudent(null)
  }

  const handleSaveChanges = async (updatedStudent) => {
    const nomination = nominations.find((nom) => nom.student === updatedStudent.id)

    if (nomination) {
      const examiner1 = lecturers.find((l) => l.name.toUpperCase() === updatedStudent.examiner1)
      const examiner2 = lecturers.find((l) => l.name.toUpperCase() === updatedStudent.examiner2)
      const examiner3 = lecturers.find((l) => l.name.toUpperCase() === updatedStudent.examiner3)

      const updateData = {
        ...nomination,
        examiner1: examiner1?.id || nomination.examiner1,
        examiner2: examiner2?.id || nomination.examiner2,
        examiner3: examiner3?.id || nomination.examiner3,
        chairperson: lecturers.find((l) => l.name === updatedStudent.chairperson)?.id || nomination.chairperson,
      }

      const result = await updateNomination(nomination.id, updateData)

      if (result.success) {
        closeModal()
      } else {
        alert("Failed to update: " + result.error)
      }
    }
  }

  const handleDownloadReport = () => {
    // Create CSV content
    const csvContent = generateCSVReport()

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `First_Stage_Evaluation_Report_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const generateCSVReport = () => {
    const headers = [
      "Student Name",
      "Department",
      "Program",
      "Semester",
      "Evaluation Type",
      "Main Supervisor",
      "Co-Supervisor",
      "Research Title",
      "Examiner 1",
      "Examiner 2",
      "Examiner 3",
      "Chairperson",
      "Status",
    ]

    const csvRows = [headers.join(",")]

    allStudents.forEach((student) => {
      const nomination = nominations.find((nom) => nom.student === student.id) || {}
      const row = [
        `"${student.name}"`,
        `"${student.department}"`,
        `"${student.program}"`,
        `"${student.semester}"`,
        `"${student.evaluationType}"`,
        `"${student.mainSupervisor}"`,
        `"${student.coSupervisor || ""}"`,
        `"${student.researchTitle}"`,
        `"${lecturers.find((l) => l.id == nomination.examiner1)?.name || "N/A"}"`,
        `"${lecturers.find((l) => l.id == nomination.examiner2)?.name || "N/A"}"`,
        `"${lecturers.find((l) => l.id == nomination.examiner3)?.name || "N/A"}"`,
        `"${student.chairperson || ""}"`,
        `"${student.status}"`,
      ]
      csvRows.push(row.join(","))
    })

    return csvRows.join("\n")
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-burgundy-700 flex items-center justify-center">
                  <div className="text-yellow-400 text-sm font-bold">UTM</div>
                </div>
                <h1 className="ml-3 text-xl font-bold text-burgundy-700">PGAM Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.username || "PGAM Admin"}</span>
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
                onClick={() => setCurrentPage("overview")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentPage === "overview"
                    ? "border-burgundy-500 text-burgundy-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BarChart3 size={16} />
                <span>Overview</span>
              </button>
              <button
                onClick={() => setCurrentPage("students")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentPage === "students"
                    ? "border-burgundy-500 text-burgundy-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <BookOpen size={16} />
                <span>All Students</span>
              </button>
              <button
                onClick={() => setCurrentPage("workload")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentPage === "workload"
                    ? "border-burgundy-500 text-burgundy-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users size={16} />
                <span>Workload Analysis</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {studentsLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading data...</div>
            </div>
          ) : (
            <>
              {currentPage === "overview" && <OverviewPage stats={stats} departments={departments} />}
              {currentPage === "students" && (
                <StudentsPage
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterDepartment={filterDepartment}
                  setFilterDepartment={setFilterDepartment}
                  departments={departments}
                  filteredStudents={filteredStudents}
                  nominations={nominations}
                  lecturers={lecturers}
                  handleDownloadReport={handleDownloadReport}
                  openEditModal={openEditModal}
                />
              )}
              {currentPage === "workload" && (
                <WorkloadPage examinerWorkload={examinerWorkload} chairpersonWorkload={chairpersonWorkload} />
              )}
            </>
          )}
        </div>
      </div>

      {/* Edit Modal - Now outside the main component but in the same file */}
      <EditModal
        showModal={showModal}
        editingStudent={editingStudent}
        modalType={modalType}
        availableExaminers={availableExaminers}
        eligibleChairpersons={eligibleChairpersons}
        lecturers={lecturers}
        nominations={nominations}
        onClose={closeModal}
        onSave={handleSaveChanges}
      />
    </>
  )
}

// Custom styles for UTM burgundy color
const style = document.createElement("style")
document.head.appendChild(style)
style.sheet.insertRule(`
  .text-burgundy-700 {
    color: #8E2246;
  }
`)
style.sheet.insertRule(`
  .bg-burgundy-700 {
    background-color: #8E2246;
  }
`)
style.sheet.insertRule(`
  .bg-burgundy-800 {
    background-color: #7D1D3F;
  }
`)
style.sheet.insertRule(`
  .hover\\:bg-burgundy-800:hover {
    background-color: #7D1D3F;
  }
`)
style.sheet.insertRule(`
  .border-burgundy-500 {
    border-color: #A52A5A;
  }
`)
style.sheet.insertRule(`
  .text-burgundy-600 {
    color: #A52A5A;
  }
`)
style.sheet.insertRule(`
  .focus\\:ring-burgundy-500:focus {
    --tw-ring-color: rgba(165, 42, 90, 0.5);
  }
`)

export default PGAM
