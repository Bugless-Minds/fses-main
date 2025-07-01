"use client"

import { useState, useMemo } from "react"
import { Search, BookOpen, Clock, Eye, Calendar, AlertTriangle, CheckCircle, XCircle, User, LogOut, FileText, Edit, Users, Plus, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useStudents } from "../hooks/useStudents"
import { useLecturers } from "../hooks/useLecturers"
import { useNominations } from "../hooks/useNominations"
import { useDepartments } from "../hooks/useDepartments"
import LogoutButton from "../components/LogoutButton"

// Move Modal component OUTSIDE of the main component
const Modal = ({
  modalType,
  formData,
  setFormData,
  inputTexts,
  setInputTexts,
  eligibleExaminer1,
  eligibleExaminer2,
  eligibleExaminer3,
  showAddExaminer,
  setShowAddExaminer,
  newLecturer,
  setNewLecturer,
  handleSubmit,
  closeModal,
  handleAddLecturer,
  handleInputChange,
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {modalType === "title" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Research Title</label>
            <textarea
              value={formData.researchTitle}
              onChange={(e) => setFormData({ ...formData, researchTitle: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter research title"
              rows={4}
              required
            />
          </div>
        )}
        {modalType === "examiners" && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Examiner 1</label>
              <input
                list="examiner1-options"
                value={inputTexts.examiner1}
                onChange={(e) => handleInputChange("examiner1", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Search by name"
                required
              />
              <datalist id="examiner1-options">
                {eligibleExaminer1.map((e) => (
                  <option key={e.id} value={e.name} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Examiner 2</label>
              <div className="flex space-x-2 items-start">
                {!showAddExaminer ? (
                  <select
                    value={formData.examiner2}
                    onChange={(e) => setFormData({ ...formData, examiner2: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select Examiner</option>
                    {eligibleExaminer2.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="w-full space-y-2">
                    <input
                      placeholder="Name"
                      value={newLecturer.name}
                      onChange={(e) => setNewLecturer({ ...newLecturer, name: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                    <input
                      placeholder="University"
                      value={newLecturer.university}
                      onChange={(e) => setNewLecturer({ ...newLecturer, university: e.target.value })}
                      className="w-full px-2 py-1 border rounded"
                    />
                    <select
                      value={newLecturer.title}
                      onChange={(e) => setNewLecturer({ ...newLecturer, title: Number.parseInt(e.target.value) })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value={1}>Professor</option>
                      <option value={2}>Associate Professor</option>
                      <option value={3}>Doctor</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddLecturer}
                      className="bg-green-600 text-white w-full py-1 rounded"
                    >
                      Add
                    </button>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowAddExaminer(!showAddExaminer)}
                  className="p-2 rounded bg-burgundy-600 text-black hover:bg-burgundy-700"
                >
                  {showAddExaminer ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Internal Examiner 3</label>
              <input
                list="examiner3-options"
                value={inputTexts.examiner3}
                onChange={(e) => handleInputChange("examiner3", e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Search by name"
                required
              />
              <datalist id="examiner3-options">
                {eligibleExaminer3.map((e) => (
                  <option key={e.id} value={e.name} />
                ))}
              </datalist>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={closeModal}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-burgundy-700 text-white rounded-md hover:bg-burgundy-800">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)

const Supervisor = () => {
  const { user } = useAuth()
  const { students } = useStudents()
  const { lecturers, createLecturer } = useLecturers()
  const { nominations, createNomination, updateNomination } = useNominations()
  const { departments } = useDepartments()

  const [searchTerm, setSearchTerm] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [currentPage, setCurrentPage] = useState('students');
  const [formData, setFormData] = useState({
    researchTitle: "",
    examiner1: "",
    examiner2: "",
    examiner3: "",
  })
  const [showAddExaminer, setShowAddExaminer] = useState(false)
  const [newLecturer, setNewLecturer] = useState({ name: "", university: "", title: 3 })
  const [inputTexts, setInputTexts] = useState({ examiner1: "", examiner3: "" })

  const supervisorStudents = students.filter((s) => s.supervisor === user?.id)
  const filteredStudents = supervisorStudents.filter((student) => {
    const name = student.name || ""
    const programme = student.program || ""
    const dept = departments.find((dep) => dep.id === student.department)?.name || ""
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      programme.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const supervisor = lecturers.find((l) => l.staff === user?.id)

  const openModal = (type, student) => {
    setModalType(type)
    setSelectedStudent(student)
    const existingNomination = nominations.find((n) => n.student === student.id)
    const ex1 = existingNomination?.examiner1?.toString() || ""
    const ex3 = existingNomination?.examiner3?.toString() || ""
    setFormData({
      researchTitle: existingNomination?.research_title || "",
      examiner1: ex1,
      examiner2: existingNomination?.examiner2?.toString() || "",
      examiner3: ex3,
    })
    setInputTexts({
      examiner1: lecturers.find((l) => l.id.toString() === ex1)?.name || "",
      examiner3: lecturers.find((l) => l.id.toString() === ex3)?.name || "",
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedStudent(null)
    setFormData({ researchTitle: "", examiner1: "", examiner2: "", examiner3: "" })
    setInputTexts({ examiner1: "", examiner3: "" })
    setShowAddExaminer(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedStudent) return

    const payload = {
      student: selectedStudent.id,
      research_title: formData.researchTitle,
      examiner1: Number.parseInt(formData.examiner1) || null,
      examiner2: Number.parseInt(formData.examiner2) || null,
      examiner3: Number.parseInt(formData.examiner3) || null,
    }

    const existingNomination = nominations.find((n) => n.student === selectedStudent.id)

    try {
      if (existingNomination) {
        await updateNomination(existingNomination.id, payload)
      } else {
        await createNomination(payload)
      }
    } catch (err) {
      console.error(err)
    }
    closeModal()
  }

  const handleAddLecturer = async () => {
    if (!newLecturer.name || !newLecturer.university) return
    try {
      const added = await createLecturer(newLecturer)
      setFormData({ ...formData, examiner2: added.id.toString() })
      setShowAddExaminer(false)
      setNewLecturer({ name: "", university: "", title: 3 })
    } catch (err) {
      console.error("Error adding lecturer:", err)
    }
  }

  const facultyLecturers = lecturers.filter((l) => l.university === supervisor?.university)

  const eligibleExaminer1 = useMemo(
    () =>
      facultyLecturers.filter(
        (l) =>
          (supervisor?.title === 1 ? l.title === 1 : l.title <= 2) &&
          l.id.toString() !== formData.examiner2 &&
          l.id.toString() !== formData.examiner3,
      ),
    [formData, facultyLecturers, supervisor?.title],
  )

  const eligibleExaminer2 = useMemo(
    () => lecturers.filter((l) => l.id.toString() !== formData.examiner1 && l.id.toString() !== formData.examiner3),
    [formData, lecturers],
  )

  const eligibleExaminer3 = useMemo(
    () =>
      facultyLecturers.filter(
        (l) => l.title <= 3 && l.id.toString() !== formData.examiner1 && l.id.toString() !== formData.examiner2,
      ),
    [formData, facultyLecturers],
  )

  const handleInputChange = (field, value) => {
    setInputTexts((prev) => ({ ...prev, [field]: value }))
    const found = lecturers.find((l) => l.name === value)
    setFormData((prev) => ({ ...prev, [field]: found?.id?.toString() || "" }))
  }

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
              <h1 className="ml-3 text-xl font-bold text-burgundy-700">Research Supervisor Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">{user?.username || 'Dr. Smith'}</span>
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
              <span>My Students</span>
            </button>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-burgundy-700">Student Management</h2>
            <div className="text-sm text-gray-600">Supervisor: {user?.username}</div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const nomination = nominations.find((n) => n.student === student.id) || {}
                    console.log("Nomination for student:", student.id, nomination);
                    const hasNomination = Boolean(nomination)
                    return (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">{student.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{student.program}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {departments.find((d) => d.id === student.department)?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => openModal("title", student)}
                            className={nomination.is_locked ? "text-gray-400 cursor-not-allowed flex items-center" :"text-blue-600 hover:text-blue-900 flex items-center"}
                            disabled={nomination.is_locked}
                          >
                            {hasNomination ? (
                              <Edit size={16} className="mr-1" />
                            ) : (
                              <FileText size={16} className="mr-1" />
                            )}
                            {hasNomination ? "Edit Title" : "Add Title"}
                          </button>
                          {hasNomination && (
                            <button
                              onClick={() => openModal("examiners", student)}
                              className={nomination.is_locked ? "text-gray-400 cursor-not-allowed flex items-center" : "text-green-600 hover:text-green-900 flex items-center"}
                              disabled={nomination.is_locked}
                            >
                              <Users size={16} className="mr-1" />
                              Nominate
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showModal && (
        <Modal
          modalType={modalType}
          formData={formData}
          setFormData={setFormData}
          inputTexts={inputTexts}
          setInputTexts={setInputTexts}
          eligibleExaminer1={eligibleExaminer1}
          eligibleExaminer2={eligibleExaminer2}
          eligibleExaminer3={eligibleExaminer3}
          showAddExaminer={showAddExaminer}
          setShowAddExaminer={setShowAddExaminer}
          newLecturer={newLecturer}
          setNewLecturer={setNewLecturer}
          handleSubmit={handleSubmit}
          closeModal={closeModal}
          handleAddLecturer={handleAddLecturer}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
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
  .focus\\:ring-burgundy-500:focus {
    --tw-ring-color: rgba(165, 42, 90, 0.5);
  }
`)

export default Supervisor
