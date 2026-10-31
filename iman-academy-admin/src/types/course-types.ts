/**
 * Online Course Platform — Data Models
 * Hierarchy: Course -> Module -> SubModule -> Step
 * Each level has its own Metadata shape (not shared).
 */

// ---------- Shared primitives ----------

export type EntityId = string;

export type ContentStatus = 'draft' | 'published' | 'archived';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

// ---------- Course ----------



export interface Course {
  id: EntityId;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl?: string;
  instructorIds: EntityId[];
  tags: string[];
  level: CourseLevel;
  language: string;
  price: number;
  currency: string; // e.g. 'USD'
  status: ContentStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  modulesCount?: number;
  modules: Module[];
}

// ---------- Module ----------


export interface Module {
  id: EntityId;
  courseId: EntityId;
  title: string;
  description?: string;
  order: number;
  estimatedDurationMinutes?: number;
  status: ContentStatus;
  subModules: SubModule[];
}

// ---------- SubModule ----------


export interface SubModule {
  id: EntityId;
  moduleId: EntityId;
  courseId?: EntityId;
  courseSlug?: string;
  courseTitle?: string;
  title: string;
  description?: string;
  order: number;
  estimatedDurationMinutes?: number;
  steps: Step[];
}

// ---------- Step ----------

export type StepType = 'Content' | 'Quiz' | 'Video';


interface BaseStep {
  id: EntityId;
  subModuleId: EntityId;
  title: string;
  description?: string;
  order: number;
  estimatedDurationMinutes?: number;
  isFreePreview?: boolean;
  status: ContentStatus;
}

// --- Step type-specific payloads (discriminated union on stepType) ---

export interface ContentStep extends BaseStep {
  stepType: 'Content';
  body: string; // rich text / markdown / HTML
  attachments?: StepAttachment[];
}

export interface VideoStep extends BaseStep {
  stepType: 'Video';
  videoUrl: string;
  durationSeconds: number;
  captionsUrl?: string;
  transcript?: string;
}

export interface QuizStep extends BaseStep {
  stepType: 'Quiz';
  questions: QuizQuestion[];
  passingScorePercent: number;
  allowRetake: boolean;
  timeLimitSeconds?: number;
}

export type Step = ContentStep | VideoStep | QuizStep;

// ---------- Supporting types ----------

export interface StepAttachment {
  id: EntityId;
  name: string;
  url: string;
  mimeType: string;
}

export interface QuizQuestion {
  id: EntityId;
  prompt: string;
  type: 'single-choice' | 'multi-choice' | 'true-false' | 'short-answer';
  options?: QuizOption[];
  correctOptionIds?: EntityId[];
  correctAnswer?: string; // for short-answer
  points: number;
}

export interface QuizOption {
  id: EntityId;
  text: string;
}

// ---------- Type guards ----------

export const isContentStep = (step: Step): step is ContentStep =>
  step.stepType === 'Content';

export const isVideoStep = (step: Step): step is VideoStep =>
  step.stepType === 'Video';

export const isQuizStep = (step: Step): step is QuizStep =>
  step.stepType === 'Quiz';