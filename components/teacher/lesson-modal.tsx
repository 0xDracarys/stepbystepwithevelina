"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, Trash2 } from "lucide-react"

interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface Lesson {
  _id: string
  title: string
  type: "text" | "quiz" | "video"
  order: number
  content: {
    text?: string
    questions?: QuizQuestion[]
    videoUrl?: string
  }
}

interface LessonModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (lesson: Lesson) => void
  courseId: string
  lesson?: Lesson | null
  token: string | null
}

export function LessonModal({ isOpen, onClose, onSave, courseId, lesson, token }: LessonModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    type: "text" as "text" | "quiz" | "video",
    content: {
      text: "",
      questions: [] as QuizQuestion[],
      videoUrl: "",
    },
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title,
        type: lesson.type,
        content: {
          text: lesson.content.text || "",
          questions: lesson.content.questions || [],
          videoUrl: lesson.content.videoUrl || "",
        },
      })
    } else {
      setFormData({
        title: "",
        type: "text",
        content: {
          text: "",
          questions: [],
          videoUrl: "",
        },
      })
    }
    setError("")
  }, [lesson, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const url = lesson ? `/api/courses/${courseId}/lessons/${lesson._id}` : `/api/courses/${courseId}/lessons`

      const method = lesson ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to save lesson")
      }

      // Create the lesson object to return
      const savedLesson: Lesson = {
        _id: lesson?._id || data.lessonId,
        title: formData.title,
        type: formData.type,
        order: lesson?.order || 1,
        content: formData.content,
      }

      onSave(savedLesson)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        questions: [
          ...prev.content.questions,
          {
            question: "",
            options: ["", "", "", ""],
            correctAnswer: 0,
            explanation: "",
          },
        ],
      },
    }))
  }

  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.map((q, i) => (i === index ? { ...q, [field]: value } : q)),
      },
    }))
  }

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.map((q, i) =>
          i === questionIndex
            ? {
                ...q,
                options: q.options.map((opt, j) => (j === optionIndex ? value : opt)),
              }
            : q,
        ),
      },
    }))
  }

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        questions: prev.content.questions.filter((_, i) => i !== index),
      },
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
          <DialogDescription>
            {lesson ? "Update your lesson content" : "Create a new lesson for your course"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Enter lesson title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Lesson Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "text" | "quiz" | "video") => setFormData((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Lesson</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content based on type */}
          {formData.type === "text" && (
            <div className="space-y-2">
              <Label htmlFor="text-content">Lesson Content</Label>
              <Textarea
                id="text-content"
                value={formData.content.text}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, text: e.target.value },
                  }))
                }
                placeholder="Enter your lesson content here..."
                rows={8}
                required
              />
            </div>
          )}

          {formData.type === "video" && (
            <div className="space-y-2">
              <Label htmlFor="video-url">Video URL</Label>
              <Input
                id="video-url"
                value={formData.content.videoUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    content: { ...prev.content, videoUrl: e.target.value },
                  }))
                }
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                type="url"
                required
              />
            </div>
          )}

          {formData.type === "quiz" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Quiz Questions</Label>
                <Button type="button" onClick={addQuestion} variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {formData.content.questions.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-600 mb-4">No questions added yet</p>
                    <Button type="button" onClick={addQuestion} variant="outline">
                      Add Your First Question
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {formData.content.questions.map((question, questionIndex) => (
                    <Card key={questionIndex}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Question {questionIndex + 1}</CardTitle>
                          <Button
                            type="button"
                            onClick={() => removeQuestion(questionIndex)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>Question</Label>
                          <Input
                            value={question.question}
                            onChange={(e) => updateQuestion(questionIndex, "question", e.target.value)}
                            placeholder="Enter your question"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Answer Options</Label>
                          {question.options.map((option, optionIndex) => (
                            <div key={optionIndex} className="flex items-center gap-2">
                              <Input
                                value={option}
                                onChange={(e) => updateQuestionOption(questionIndex, optionIndex, e.target.value)}
                                placeholder={`Option ${optionIndex + 1}`}
                                required
                              />
                              <Button
                                type="button"
                                variant={question.correctAnswer === optionIndex ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateQuestion(questionIndex, "correctAnswer", optionIndex)}
                              >
                                {question.correctAnswer === optionIndex ? "Correct" : "Mark Correct"}
                              </Button>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                          <Label>Explanation (Optional)</Label>
                          <Textarea
                            value={question.explanation || ""}
                            onChange={(e) => updateQuestion(questionIndex, "explanation", e.target.value)}
                            placeholder="Explain why this is the correct answer"
                            rows={2}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : lesson ? "Update Lesson" : "Create Lesson"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
