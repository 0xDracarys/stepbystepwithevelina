export const dynamic = 'force-dynamic'

import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"

// Lithuanian ↔ English Language Learning Courses
const sampleCourses = {
  "1": {
    _id: "1",
    title: "English to Lithuanian: Complete Beginner Course",
    description: "Master Lithuanian from English with this comprehensive course designed for absolute beginners. Learn essential vocabulary, grammar, and conversational skills through interactive lessons and real-world practice scenarios. Perfect for English speakers who want to connect with Lithuanian culture and heritage.",
    shortDescription: "Transform from English to Lithuanian speaker with structured, engaging lessons.",
    teacherName: "Marta Kazlauskienė",
    category: "lithuanian",
    difficulty: "beginner",
    estimatedDuration: 80,
    enrolledStudents: 1247,
    rating: 4.9,
    totalRatings: 189,
    tags: ["english-to-lithuanian", "beginner", "conversation", "grammar", "vocabulary", "culture"],
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop",
    createdAt: "2024-01-15T10:00:00Z",
    lessons: [
      {
        _id: "l1",
        title: "Lithuanian Alphabet & Pronunciation",
        type: "text",
        content: "Master the Lithuanian alphabet with its 32 letters and unique pronunciation rules. Learn about the special characters (ą, č, ę, ė, į, š, ų, ū, ž) and how they differ from English sounds. This foundation is crucial for proper Lithuanian pronunciation.",
        duration: 25,
        order: 1
      },
      {
        _id: "l2",
        title: "Essential Greetings & Introductions",
        type: "video",
        content: "https://example.com/video/lithuanian-greetings-intro",
        duration: 30,
        order: 2
      },
      {
        _id: "l3",
        title: "Basic Vocabulary & Numbers",
        type: "quiz",
        content: JSON.stringify({
          questions: [
            {
              question: "How do you say 'hello' in Lithuanian?",
              options: ["Labas", "Ačiū", "Prašom", "Atsiprašau"],
              correctAnswer: 0
            },
            {
              question: "What is the Lithuanian word for 'thank you'?",
              options: ["Labas", "Ačiū", "Prašom", "Atsiprašau"],
              correctAnswer: 1
            },
            {
              question: "How do you say 'good morning' in Lithuanian?",
              options: ["Labas rytas", "Labas vakaras", "Labanakt", "Viso gero"],
              correctAnswer: 0
            }
          ]
        }),
        duration: 35,
        order: 3
      },
      {
        _id: "l4",
        title: "Family & Relationships Vocabulary",
        type: "text",
        content: "Learn essential family vocabulary in Lithuanian. Practice describing your family members (šeima, tėvas, motina, brolis, sesuo) and relationships. This lesson includes cultural context about Lithuanian family values and traditions.",
        duration: 30,
        order: 4
      },
      {
        _id: "l5",
        title: "Lithuanian Grammar Basics - Cases Introduction",
        type: "video",
        content: "https://example.com/video/lithuanian-cases-intro",
        duration: 40,
        order: 5
      },
      {
        _id: "l6",
        title: "Common Verbs & Present Tense",
        type: "text",
        content: "Master essential Lithuanian verbs and their conjugation in present tense. Learn verbs like 'būti' (to be), 'turėti' (to have), 'eiti' (to go), and 'dirbti' (to work) with practical examples.",
        duration: 35,
        order: 6
      }
    ]
  },
  "2": {
    _id: "2",
    title: "Lithuanian to English: Conversational Mastery",
    description: "Develop fluent English conversation skills from Lithuanian. Perfect for Lithuanian speakers who want to master real-world English through interactive conversations, role-plays, and cultural immersion. Focus on practical communication for work, travel, and daily life.",
    shortDescription: "Speak English confidently with native-like fluency and cultural understanding.",
    teacherName: "Jonas Petras",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 70,
    enrolledStudents: 892,
    rating: 4.8,
    totalRatings: 156,
    tags: ["lithuanian-to-english", "conversation", "intermediate", "speaking", "culture"],
    thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    createdAt: "2024-01-20T10:00:00Z",
    lessons: [
      {
        _id: "l7",
        title: "English Pronunciation for Lithuanian Speakers",
        type: "text",
        content: "Master English pronunciation focusing on sounds that are challenging for Lithuanian speakers. Learn about English vowel sounds, consonant clusters, and stress patterns that differ from Lithuanian.",
        duration: 35,
        order: 1
      },
      {
        _id: "l8",
        title: "Everyday Conversations & Small Talk",
        type: "video",
        content: "https://example.com/video/english-conversations-lithuanian",
        duration: 40,
        order: 2
      },
      {
        _id: "l9",
        title: "English Grammar - Articles & Prepositions",
        type: "text",
        content: "Master English articles (a, an, the) and prepositions, which don't exist in Lithuanian. Learn when and how to use them correctly with practical examples and common mistakes to avoid.",
        duration: 30,
        order: 3
      },
      {
        _id: "l10",
        title: "Business English & Professional Communication",
        type: "video",
        content: "https://example.com/video/business-english-lithuanian",
        duration: 45,
        order: 4
      },
      {
        _id: "l11",
        title: "English Idioms & Expressions",
        type: "quiz",
        content: JSON.stringify({
          questions: [
            {
              question: "What does 'It's raining cats and dogs' mean?",
              options: ["It's raining heavily", "Animals are falling from the sky", "It's a beautiful day", "It's snowing"],
              correctAnswer: 0
            },
            {
              question: "How do you say 'break the ice' in Lithuanian context?",
              options: ["Sulaužyti ledą", "Pradėti pokalbį", "Pabėgti", "Atsisėsti"],
              correctAnswer: 1
            }
          ]
        }),
        duration: 35,
        order: 5
      }
    ]
  },
  "3": {
    _id: "3",
    title: "Lithuanian Grammar Mastery for English Speakers",
    description: "Master the complex Lithuanian grammar system from English. Learn the seven cases, verb conjugations, and sentence structure through systematic, easy-to-understand lessons. Perfect for English speakers who want to understand Lithuanian grammar deeply.",
    shortDescription: "Conquer Lithuanian grammar with clear explanations and practical exercises.",
    teacherName: "Dr. Rasa Jankauskienė",
    category: "lithuanian",
    difficulty: "intermediate",
    estimatedDuration: 90,
    enrolledStudents: 634,
    rating: 4.7,
    totalRatings: 98,
    tags: ["english-to-lithuanian", "grammar", "intermediate", "cases", "conjugation"],
    thumbnail: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop",
    createdAt: "2024-01-25T10:00:00Z",
    lessons: [
      {
        _id: "l12",
        title: "Lithuanian Cases: Nominative, Genitive, Dative",
        type: "text",
        content: "Understand the first three Lithuanian cases and how they affect nouns, adjectives, and pronouns. Learn when to use each case with clear examples and practice exercises. This is fundamental for Lithuanian sentence structure.",
        duration: 45,
        order: 1
      },
      {
        _id: "l13",
        title: "Accusative, Instrumental, Locative, Vocative Cases",
        type: "video",
        content: "https://example.com/video/lithuanian-cases-advanced",
        duration: 50,
        order: 2
      },
      {
        _id: "l14",
        title: "Verb Conjugation - Present Tense",
        type: "text",
        content: "Master Lithuanian verb conjugation in present tense. Learn the three conjugation groups and practice with common verbs. Understand how Lithuanian verbs differ from English in terms of person and number.",
        duration: 40,
        order: 3
      },
      {
        _id: "l15",
        title: "Past and Future Tense Conjugation",
        type: "quiz",
        content: JSON.stringify({
          questions: [
            {
              question: "What is the past tense ending for first person singular?",
              options: ["-au", "-ai", "-o", "-ė"],
              correctAnswer: 0
            },
            {
              question: "Which case is used for direct objects in Lithuanian?",
              options: ["Nominative", "Accusative", "Genitive", "Dative"],
              correctAnswer: 1
            }
          ]
        }),
        duration: 35,
        order: 4
      },
      {
        _id: "l16",
        title: "Adjective Declension & Agreement",
        type: "text",
        content: "Learn how Lithuanian adjectives agree with nouns in gender, number, and case. Master the declension patterns and practice with various adjective types. This is crucial for proper Lithuanian sentence construction.",
        duration: 40,
        order: 5
      }
    ]
  },
  "4": {
    _id: "4",
    title: "English Grammar for Lithuanian Speakers",
    description: "Master English grammar from a Lithuanian perspective. Learn English tenses, articles, prepositions, and sentence structure through lessons specifically designed for Lithuanian speakers. Focus on areas where English differs significantly from Lithuanian.",
    shortDescription: "Master English grammar with Lithuanian-specific explanations and examples.",
    teacherName: "Dr. Paulius Rimkus",
    category: "english",
    difficulty: "intermediate",
    estimatedDuration: 75,
    enrolledStudents: 1123,
    rating: 4.8,
    totalRatings: 201,
    tags: ["lithuanian-to-english", "grammar", "intermediate", "tenses", "articles"],
    thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop",
    createdAt: "2024-02-01T10:00:00Z",
    lessons: [
      {
        _id: "l17",
        title: "English Tenses - Present, Past, Future",
        type: "video",
        content: "https://example.com/video/english-tenses-lithuanian",
        duration: 50,
        order: 1
      },
      {
        _id: "l18",
        title: "Articles: A, An, The - When to Use",
        type: "text",
        content: "Master English articles, which don't exist in Lithuanian. Learn when to use 'a', 'an', 'the', and when to omit articles. Practice with common mistakes Lithuanian speakers make and how to avoid them.",
        duration: 40,
        order: 2
      },
      {
        _id: "l19",
        title: "Prepositions & Phrasal Verbs",
        type: "text",
        content: "Learn English prepositions and phrasal verbs, which are challenging for Lithuanian speakers. Understand the logic behind preposition usage and practice with common phrasal verbs used in daily conversation.",
        duration: 45,
        order: 3
      },
      {
        _id: "l20",
        title: "Conditional Sentences & Subjunctive",
        type: "quiz",
        content: JSON.stringify({
          questions: [
            {
              question: "Which conditional is used for real situations?",
              options: ["Zero conditional", "First conditional", "Second conditional", "Third conditional"],
              correctAnswer: 1
            },
            {
              question: "What is the correct form: 'If I were you...' or 'If I was you...'?",
              options: ["If I were you", "If I was you", "Both are correct", "Neither is correct"],
              correctAnswer: 0
            }
          ]
        }),
        duration: 35,
        order: 4
      }
    ]
  },
  "5": {
    _id: "5",
    title: "Lithuanian Culture & Language Immersion",
    description: "Immerse yourself in Lithuanian culture while learning the language. Explore Lithuanian traditions, customs, history, and modern life through language learning. Perfect for understanding the cultural context behind Lithuanian expressions and behaviors.",
    shortDescription: "Discover Lithuanian culture through language and authentic materials.",
    teacherName: "Prof. Vilma Vaičiūnienė",
    category: "lithuanian",
    difficulty: "intermediate",
    estimatedDuration: 60,
    enrolledStudents: 756,
    rating: 4.9,
    totalRatings: 134,
    tags: ["lithuanian-culture", "intermediate", "traditions", "history", "immersion"],
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&h=300&fit=crop",
    createdAt: "2024-02-05T10:00:00Z",
    lessons: [
      {
        _id: "l21",
        title: "Lithuanian Traditions & Festivals",
        type: "video",
        content: "https://example.com/video/lithuanian-traditions",
        duration: 40,
        order: 1
      },
      {
        _id: "l22",
        title: "Lithuanian History & Language Evolution",
        type: "text",
        content: "Explore the rich history of Lithuania and how it shaped the Lithuanian language. Learn about the Baltic origins, medieval period, and modern developments that influenced Lithuanian culture and language.",
        duration: 35,
        order: 2
      },
      {
        _id: "l23",
        title: "Modern Lithuanian Society & Lifestyle",
        type: "text",
        content: "Understand contemporary Lithuanian society, lifestyle, and social norms. Learn about work culture, family life, education system, and daily routines that will help you communicate effectively with Lithuanians.",
        duration: 30,
        order: 3
      },
      {
        _id: "l24",
        title: "Lithuanian Literature & Arts",
        type: "quiz",
        content: JSON.stringify({
          questions: [
            {
              question: "Who wrote the Lithuanian national anthem?",
              options: ["Vincas Kudirka", "Maironis", "Salomėja Nėris", "Justinas Marcinkevičius"],
              correctAnswer: 0
            },
            {
              question: "What is the traditional Lithuanian Christmas dish?",
              options: ["Kūčiukai", "Cepelinai", "Šaltibarščiai", "Vėdarai"],
              correctAnswer: 0
            }
          ]
        }),
        duration: 25,
        order: 4
      }
    ]
  }
}

async function getCourseHandler(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params

  // Return sample data for now
  const course = sampleCourses[courseId as keyof typeof sampleCourses]

  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  return successResponse({
    course: course
  })
}

export const GET = withErrorHandling(getCourseHandler)