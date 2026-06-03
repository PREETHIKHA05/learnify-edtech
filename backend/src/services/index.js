import { isMemoryMode } from '../db/mode.js'
import * as mongo from './mongo.js'

// MongoDB-only — memory fallback disabled; all data lives in Atlas
function pick(fn) {
  return (...args) => {
    if (isMemoryMode()) {
      throw new Error('In-memory mode is disabled. MongoDB must be connected.')
    }
    return mongo[fn.name](...args)
  }
}

export const getDemoUser = pick(mongo.getDemoUser)
export const getClassTopics = pick(mongo.getClassTopics)
export const getAllStudents = pick(mongo.getAllStudents)
export const getStudentById = pick(mongo.getStudentById)
export const getStudentGapReport = pick(mongo.getStudentGapReport)
export const getStudentDashboard = pick(mongo.getStudentDashboard)
export const getTeacherDashboard = pick(mongo.getTeacherDashboard)
export const getNotifications = pick(mongo.getNotifications)
export const markNotificationRead = pick(mongo.markNotificationRead)
export const markAllNotificationsRead = pick(mongo.markAllNotificationsRead)
export const addFeedback = pick(mongo.addFeedback)
export const getFeedbackForStudent = pick(mongo.getFeedbackForStudent)
export const applyBulkIntervention = pick(mongo.applyBulkIntervention)
export const applyIntervention = pick(mongo.applyIntervention)
export const getInterventionsForStudent = pick(mongo.getInterventionsForStudent)
export const getQuizzes = pick(mongo.getQuizzes)
export const getQuizById = pick(mongo.getQuizById)
export const submitQuizFeedback = pick(mongo.submitQuizFeedback)
export const submitQuizAttempt = pick(mongo.submitQuizAttempt)
export const getNotes = pick(mongo.getNotes)
export const createNote = pick(mongo.createNote)
export const updateNote = pick(mongo.updateNote)
export const deleteNote = pick(mongo.deleteNote)
export const getFlashcardDeck = pick(mongo.getFlashcardDeck)
export const reviewFlashcard = pick(mongo.reviewFlashcard)
export const getStudyPlan = pick(mongo.getStudyPlan)
export const updateStudyTask = pick(mongo.updateStudyTask)
export const getFocusSessions = pick(mongo.getFocusSessions)
export const recordFocusSession = pick(mongo.recordFocusSession)
export const getAnalytics = pick(mongo.getAnalytics)
export const getTutorMessages = pick(mongo.getTutorMessages)
export const sendTutorMessage = pick(mongo.sendTutorMessage)

export async function listActiveCollections() {
  const { listCollections } = await import('../data/seedRunner.js')
  return listCollections()
}
