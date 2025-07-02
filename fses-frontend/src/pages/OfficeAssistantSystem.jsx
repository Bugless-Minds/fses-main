"use client"

import { useState, useMemo, useCallback } from "react"
import { Plus, Edit, Trash2, Search, Users, GraduationCap } from "lucide-react"
import { useStudents } from "../hooks/useStudents"
import { useLecturers } from "../hooks/useLecturers"
import { useDepartments } from "../hooks/useDepartments"
import { useAuth } from "../contexts/AuthContext"
import LogoutButton from "../components/LogoutButton"

// Move Modal component OUTSIDE of the main component
const Modal = ({
  showModal,
  modalType,
  selectedStudent,
  formData,
  handleInputChange,
  handleSubmit,
  closeModal,
  departments,
  lecturers,
  programs,
  evaluationTypes,
  lecturerTitles,
  availableCoSupervisors,
}) => (
  <div
    className={`fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 ${
      showModal ? "block" : "hidden"
    }`}
  >
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {modalType === "student"
          ? selectedStudent
            ? "Edit Student"
            : "Add Student"
          : selectedStudent
            ? "Edit Lecturer"
            : "Add Lecturer"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
              required
            />
          </div>
          {modalType === "student" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Main Supervisor</label>
                <select
                  name="supervisor"
                  value={formData.supervisor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Supervisor</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Co-Supervisor (Optional)</label>
                <select
                  name="co_supervisor"
                  value={formData.co_supervisor}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                >
                  <option value="">Select Co-Supervisor</option>
                  {availableCoSupervisors.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Program</label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Program</option>
                  {programs.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Evaluation Type</label>
                <select
                  name="evaluation_type"
                  value={formData.evaluation_type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Evaluation Type</option>
                  {evaluationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type === "FIRST_EVALUATION" ? "First Evaluation" : "Re-Evaluation"}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <select
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Title</option>
                  {lecturerTitles.map((title) => (
                    <option key={title.value} value={title.value}>
                      {title.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">University</label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="UTM"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-burgundy-500 focus:border-burgundy-500"
                />
              </div>
            </>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-md hover:bg-burgundy-800">
            {selectedStudent ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  </div>
)

// Move StudentManagement component OUTSIDE to prevent re-renders
const StudentManagement = ({
  searchTerm,
  setSearchTerm,
  filteredStudents,
  studentsLoading,
  studentsError,
  departments,
  lecturers,
  openModal,
  handleDelete,
}) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-burgundy-700">Student Management</h2>
      <button
        onClick={() => openModal("student")}
        className="bg-burgundy-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-burgundy-800"
      >
        <Plus size={20} />
        <span>Add Student</span>
      </button>
    </div>

    {studentsError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Error: {studentsError}</div>
    )}

    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-burgundy-500"
          />
        </div>
      </div>

      {studentsLoading ? (
        <div className="p-8 text-center">Loading students...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Evaluation Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {departments.find((dep) => dep.id === student.department)?.name || student.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lecturers.find((lect) => lect.id === student.supervisor)?.name || student.supervisor}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{student.program}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.evaluation_type === "FIRST_EVALUATION" ? "First Evaluation" : "Re-Evaluation"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal("student", student)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(student.id, "student")}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)

// Move LecturerManagement component OUTSIDE to prevent re-renders
const LecturerManagement = ({
  searchTerm,
  setSearchTerm,
  filteredLecturers,
  lecturersLoading,
  lecturersError,
  departments,
  lecturerTitles,
  openModal,
  handleDelete,
}) => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-burgundy-700">Lecturer Management</h2>
      <button
        onClick={() => openModal("lecturer")}
        className="bg-burgundy-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-burgundy-800"
      >
        <Plus size={20} />
        <span>Add Lecturer</span>
      </button>
    </div>

    {lecturersError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">Error: {lecturersError}</div>
    )}

    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lecturers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:border-burgundy-500"
          />
        </div>
      </div>

      {lecturersLoading ? (
        <div className="p-8 text-center">Loading lecturers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  University
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLecturers.map((lecturer) => (
                <tr key={lecturer.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{lecturer.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lecturerTitles.find((t) => t.value === lecturer.title)?.label || lecturer.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {typeof lecturer.department === "object"
                      ? lecturer.department?.name || "N/A"
                      : departments.find((d) => d.id === lecturer.department)?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{lecturer.university || "UTM"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openModal("lecturer", lecturer)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(lecturer.id, "lecturer")}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)

const OfficeAssistantSystem = () => {
  const [currentTab, setCurrentTab] = useState("students")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const {
    students,
    loading: studentsLoading,
    error: studentsError,
    createStudent,
    updateStudent,
    deleteStudent,
  } = useStudents()

  const {
    lecturers,
    loading: lecturersLoading,
    error: lecturersError,
    createLecturer,
    updateLecturer,
    deleteLecturer,
  } = useLecturers()

  const { departments, loading: departmentsLoading } = useDepartments()
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    supervisor: "",
    co_supervisor: "",
    program: "",
    evaluation_type: "",
    university: "",
  })

  // Memoize static arrays to prevent re-renders
  const programs = useMemo(() => ["PHD", "MPHIL", "DSE"], [])
  const evaluationTypes = useMemo(() => ["FIRST_EVALUATION", "RE_EVALUATION"], [])
  const lecturerTitles = useMemo(
    () => [
      { value: 1, label: "Professor" },
      { value: 2, label: "Associate Professor" },
      { value: 3, label: "Doctor" },
    ],
    [],
  )

  // Memoize available co-supervisors to prevent re-renders
  const availableCoSupervisors = useMemo(
    () => lecturers.filter((lecturer) => lecturer.id !== Number.parseInt(formData.supervisor)),
    [lecturers, formData.supervisor],
  )

  // Memoize handler functions to prevent re-renders
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }, [])

  const closeModal = useCallback(() => {
    setShowModal(false)
    setModalType("")
    setSelectedStudent(null)
  }, [])

  const openModal = useCallback((type, item = null) => {
    setModalType(type)
    setSelectedStudent(item)
    if (item) {
      setFormData({
        name: item.name || "",
        department: item.department || "",
        supervisor: item.supervisor || "",
        co_supervisor: item.co_supervisor || "",
        program: item.program || "",
        evaluation_type: item.evaluation_type || "",
        university: item.university || "",
        title: item.title || "",
      })
    } else {
      setFormData({
        name: "",
        department: "",
        supervisor: "",
        co_supervisor: "",
        program: "",
        evaluation_type: "",
        university: "",
        title: "",
      })
    }
    setShowModal(true)
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()
      let result

      if (modalType === "student") {
        if (selectedStudent) {
          result = await updateStudent(selectedStudent.id, formData)
        } else {
          result = await createStudent(formData)
        }
      } else if (modalType === "lecturer") {
        const lecturerData = {
          name: formData.name,
          title: formData.title,
          department: formData.department,
          university: formData.university || "UTM",
        }
        if (selectedStudent) {
          result = await updateLecturer(selectedStudent.id, lecturerData)
        } else {
          result = await createLecturer(lecturerData)
        }
      }

      if (result && result.success) {
        closeModal()
      } else {
        alert(result ? result.error : "An error occurred")
      }
    },
    [modalType, selectedStudent, formData, updateStudent, createStudent, updateLecturer, createLecturer, closeModal],
  )

  const handleDelete = useCallback(
    async (id, type) => {
      if (window.confirm("Are you sure you want to delete this record?")) {
        let result
        if (type === "student") {
          result = await deleteStudent(id)
        } else if (type === "lecturer") {
          result = await deleteLecturer(id)
        }
        if (!result.success) {
          alert(result.error)
        }
      }
    },
    [deleteStudent, deleteLecturer],
  )

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const lowerSearch = searchTerm.toLowerCase()
      const departmentName = departments.find((dept) => dept.id === student.department)?.name?.toLowerCase()
      const supervisorName = lecturers.find((sup) => sup.id === student.supervisor)?.name?.toLowerCase()

      return (
        student.name?.toLowerCase().includes(lowerSearch) ||
        departmentName?.includes(lowerSearch) ||
        supervisorName?.includes(lowerSearch)
      )
    })
  }, [students, departments, lecturers, searchTerm])

  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const lowerSearch = searchTerm.toLowerCase()
      const nameMatch = lecturer.name?.toLowerCase().includes(lowerSearch)
      const departmentName = departments.find((dep) => dep.id === lecturer.department)?.name || ""
      const departmentMatch = departmentName.toLowerCase().includes(lowerSearch)
      const universityMatch =
        typeof lecturer.university === "string" && lecturer.university.toLowerCase().includes(lowerSearch)

      return nameMatch || departmentMatch || universityMatch
    })
  }, [lecturers, departments, searchTerm])

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-burgundy-700 flex items-center justify-center">
                  <div className="text-yellow-400 text-sm font-bold">UTM</div>
                </div>
                <h1 className="ml-3 text-xl font-bold text-burgundy-700">Office Assistant Portal</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">{user?.username || "Office Assistant"}</span>
                <LogoutButton />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setCurrentTab("students")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentTab === "students"
                    ? "border-burgundy-500 text-burgundy-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <GraduationCap size={16} />
                <span>Students</span>
              </button>
              <button
                onClick={() => setCurrentTab("lecturers")}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  currentTab === "lecturers"
                    ? "border-burgundy-500 text-burgundy-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Users size={16} />
                <span>Lecturers</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {currentTab === "students" && (
            <StudentManagement
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredStudents={filteredStudents}
              studentsLoading={studentsLoading}
              studentsError={studentsError}
              departments={departments}
              lecturers={lecturers}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          )}
          {currentTab === "lecturers" && (
            <LecturerManagement
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filteredLecturers={filteredLecturers}
              lecturersLoading={lecturersLoading}
              lecturersError={lecturersError}
              departments={departments}
              lecturerTitles={lecturerTitles}
              openModal={openModal}
              handleDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Modal - Always render but control visibility */}
      <Modal
        showModal={showModal}
        modalType={modalType}
        selectedStudent={selectedStudent}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        closeModal={closeModal}
        departments={departments}
        lecturers={lecturers}
        programs={programs}
        evaluationTypes={evaluationTypes}
        lecturerTitles={lecturerTitles}
        availableCoSupervisors={availableCoSupervisors}
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
style.sheet.insertRule(`
  .hover\\:bg-burgundy-800:hover {
    background-color: #7D1D3F;
  }
`)
style.sheet.insertRule(`
  .bg-burgundy-800 {
    background-color: #7D1D3F;
  }
`)

export default OfficeAssistantSystem
