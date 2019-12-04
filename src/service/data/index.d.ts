declare interface Option {
  index: string;
  text: string;
}

declare interface Question {
  id: number;
  questionType: 'singleSelect' | 'multiSelect' | 'subjectiveSelect' | 'trueOrFalse' | 'completionSelect' | 'textMatchText' | 'textMatchImg' | 'typeSelect';
  state: number; // 0 未做 1 已做未提交 2 已提交为批改 3 已该结果正确 4 已批改结果错误
  analysis: string;
  optionList?: Option[]; // 选择题列表
  analysisImgUrl?: string; // 图文判断题
  correctAnswer: string;
  stuAnswer: string;
  score: number;
  stuGetScore?: number; // 题目学生得分，已批改才有
}

interface Homework {
  id: number;
  name: string;
  type: number;
  difficulty: number;
  state: number;
  lessonId: number;
  stuUserId: number;
  questionAmount: number;
  questionAmountNoSub: number;
  totalScore: number;
  stuGetScore: number;
  costTime: string;
  homeworkLessonQuestionDTOList: Question[];
}
