import {isArray} from '@/utils';
import {string2node} from 'service/data/utils';
import renderToKatex from 'service/data/utils/questionFormula';
class MakeData {
  public data: {
    id: string;
    type: string;
    name: string;
    state: number;
    diff: string;
    lessonId: string;
    stuUserId: string;
    questionAmount: number;
    questionAmountNoSub: number;
    rightAmount: number;
    wrongAmount: number;
    totalScore: number;
    stuGetScore: number;
    costTime: number;
    questions: any[];
    teacherComment?: string;
    submitTime: number;
    correctMode: number;
  };

  constructor(data: any) {
    // this.data = {};
    this.initial(data);
  }

  public initial(data: any) {
    console.log('initial data start');
    const copy: Data = Object.assign({}, data);
    console.log('this.initial(data): ', data, copy, copy.homeworkLessonQuestionDTOList);
    this.initialHomeWork(copy);
    this.data.questions = this.initialQuestionList(copy.homeworkLessonQuestionDTOList);
  }

  public initialHomeWork(data: any) {
    this.data = {
      id: data.id,
      type: data.type,
      name: data.name,
      state: data.state,
      diff: data.diff,
      lessonId: data.lessonId,
      stuUserId: data.stuUserId,
      questionAmount: data.questionAmount,
      questionAmountNoSub: data.questionAmountNoSub,
      rightAmount: data.rightAmount,
      wrongAmount: data.wrongAmount,
      totalScore: data.totalScore,
      stuGetScore: data.stuGetScore || 0,
      costTime: data.costTime,
      questions: [],
      teacherComment: '',
      submitTime: data.submitTime,
      correctMode: data.correctMode
    };
    console.log('base homework data initial success');
    // console.log('base data is');
    // console.log(this.data);
  }

  public initialQuestion(data: {
    correctResult: number;
    hlId: number;
    id: number;
    questionId: string;
    questionOutputDTO: any[];
    questionSource: number;
    score: number;
    stuAnswer: any;
    stuGetScore: number;
  }) {
    console.log('question data initial start');
    const output: any = data.questionOutputDTO;
    let question: any = {
      id: data.id,
      score: data.score,
      stuGetScore: data.stuGetScore,
      type: this.normalizeQuestionType(output.questionType, output.layoutStyle),
      // analysis: this.normalizeQuestionAnalysis(output.analysis),
      correctResult: data.correctResult,
      analysisImgUrl: output.analysis,
      knowledgeNameList: output.knowledgeNameList,
      answerList: output.answerList
    };
    if (question.type === 'reorder' && output.optionElementList && output.optionElementList[0]) {
      if (output.optionElementList[0].optionElementType === 2) {
        question.type = 'reorderText';
      }
      if (output.optionElementList[0].optionElementType === 3) {
        question.type = 'reorderImg';
      }
    }
    question = Object.assign(question, normalizeQuestionTitle({title: output.title, content: output.content, type: output.questionType}, question.type));
    console.log('question data initial success');
    // console.log('question is:');
    // console.log(question);
    const optionList: any[] = output.optionList;
    const children: any[] = output.children;
    const type: string = question.type;
    if (type === 'singleSelect') {                                                                      // 单选题
      console.log('单选题格式化开始');
      question.optionList = normalizeSelectOptionList(optionList);
      question.stuAnswer = normalizeSelectStudentAnswer(data.stuAnswer);
      question.correctAnswer = normalizeSelectCorrectAnswer(output.answerList[0]);
      question.analysis = output.analysis;
      console.log('单选题格式化完成');
    } else if (type === 'multiSelect') {                                                                // 多选题
      console.log('多选题格式化开始');
      question.optionList = normalizeSelectOptionList(optionList);
      question.stuAnswer = normalizeMultiSelectStudentAnswer(data.stuAnswer);
      question.correctAnswer = normalizeMultiSelectCorrectAnswer(output.answerList);
      question.analysis = output.analysis;
      console.log('多选题格式化完成');
    } else if (type === 'typeSelect') {                                                                 // 类型选择题
      console.log('类型选择题格式化开始');
      const option: any[] = [];
      const classList: any = children.map((classType: any) => {
        const optionItem: any[] = classType.subQuestionMemberList;
        optionItem.forEach((element: any) => {
          option.push({
            id: element.id,
            type: element.type,
            content: element.content,
            classificationId: element.subQuestionId
          });
        });
        return {
          id: classType.id,
          title: classType.title
        };
      });
      question.classList = classList;
      question.optionList = option;
      question.stuAnswer = normalizeTypeSelectStudentAnswer(data.stuAnswer);
      question.correctAnswer = normalizeTypeSelectCorrectAnswer(output.answerList);
      console.log('类型选择题格式化完成');
    } else if (type === 'trueOrFalse') {                                                                // 判断题
      question.correctAnswer = normalizeTrueOrFalseCorrectAnswer(output.answerList[0]);
      question.optionList = normalizeTrueOrFalseOptionList(optionList, question.correctAnswer);
      question.stuAnswer = normalizeTrueOrFalseStudentAnswer(data.stuAnswer);
      // question.analysis = normalizeOrFalseAnalysis(output.analysis);
      question.analysis = output.analysis;
    } else if (type === 'textMatchImg' || type === 'textMatchText') {                                   // 配对题
      console.log('配对题格式化开始');
      const firstList: any[] = [];
      const secondList: any[] = [];
      const correctList: any[] = [];
      children.forEach((element: any) => {
        const member: any[] = element.subQuestionMemberList;
        firstList.push(member[0]);
        secondList.push(member[1]);
        correctList.push({
          firstId: member[0].id,
          secondId: member[1].id
        });
      });
      question.firstList = firstList;
      question.secondList = secondList;
      question.correctAnswer = correctList;
      question.stuAnswer = JSON.parse(data.stuAnswer || '[]');
      type === 'textMatchText' && console.log(question);
      console.log('图文配对题格式化完成');
    } else if (type === 'completionSelect') {                                                           // 填空题
      console.log('填空题格式化开始');
      const contentNodeList: Node[] = string2node(output.content);
      question.optionList = output.optionList || [];
      question.correctAnswer = output.answerList;
      question.stuAnswer = normalizeCompletionSelectStudentAnswer(data.stuAnswer);
      question.analysis = output.analysis;
      console.log('填空题格式化完成');
    } else if (type === 'reorderText') {                                                           // 填空题
      console.log('文字排序题格式化开始');
      question.optionElementList = output.optionElementList || [];
      question.stuAnswer = data.stuAnswer;
      question.analysis = output.analysis;
      console.log('文字排序题格式化完成');
    } else if (type === 'reorderImg') {                                                           // 填空题
      console.log('图片排序题格式化开始');
      question.stuAnswer = data.stuAnswer;
      question.analysis = output.analysis;
      question.optionElementList = output.optionElementList || [];
      console.log('图片排序题格式化完成');
    }
    return question;
  }

  public initialQuestionList(list: any[]): any[] {
    if (!list) {
      throw new TypeError('question list is not a array');
    }
    const map: any[] = list.map((element: any) => {
      return this.initialQuestion(element);
    });
    return map;
  }

  public normalizeQuestionType(t: string, s: number): string | undefined {
    const type: Map<string, string> = new Map();
    type.set('单选题', 'singleSelect');
    type.set('多选题', 'multiSelect');
    type.set('判断题', 'trueOrFalse');
    type.set('选词填空', 'completionSelect');
    type.set('文文配对', 'textMatchText');
    type.set('图文配对', 'textMatchImg');
    type.set('分类题', 'typeSelect');
    type.set('互动排序题', 'reorder');
    if (s === 1) {
      return type.get('文文配对');
    } else if (s === 2 || (t === '配对题' && s === 3) || (t === '连线题' && s === 3)) {
      return type.get('图文配对');
    }
    return type.get(t);
  }
  public normalizeQuestionAnalysis(t: string): string {
    if (t === '' || !t) {
      return '';
    }
    let title: string = t;
    const nodeList: Node[] = string2node(t);
    title = nodeList[0].textContent || '';
    return title;
  }
}

/**
 * 初始化题目标题
 * @param t
 * @param type
 */
export function normalizeQuestionTitle(t: any, type: string): {
  title: string;
  titleImgUrl: string;
  formula: boolean;
} {
  let title: string;
  let titleImgUrl: string = '';
  let formula: boolean = false;
  const nodeList: Node[] = string2node(t.title);
  nodeList[0] && nodeList[0].insertBefore(string2node(`<span style="display: inline-block;vertical-align: top;font-weight: bold">【${t.type}】</span>`)[0], nodeList[0].childNodes[0]);
  /*tslint:disable*/
  const childNode: any[] = [];
  nodeList.forEach((node: any) => {
    childNode.push(...node.childNodes);
  });
  childNode.forEach((node: any) => {
    if (node.nodeName.toLowerCase() === 'img') {
      titleImgUrl = node.src;
    }
  });
  if (t.title.indexOf('<zmlatex') > -1) { // 有数学公式
    title = renderToKatex(nodeList.reduce((accumulator: string, node: any) => accumulator + node.outerHTML, ''));
    formula = true;
  } else {
    // title = nodeList[0].textContent || '';
    // title = nodeList.reduce((accumulator: string, node: any) => accumulator + node.textContent, '');
    console.log(nodeList);
    title = nodeList.reduce((accumulator: string, node: any) => accumulator + node.outerHTML, '');
    console.log(title);
    // title = t.title;
  }
  if (type === 'completionSelect') {
    title = '';
    const contentNodeList: Node[] = string2node(t.content, 'completionSelect');
    contentNodeList.forEach((element: any) => {
      normalizecompletionSelectContent(element);
      title += element.textContent;
    });
  }
  return {
    title,
    // content,
    formula,
    titleImgUrl
  };
}

/**
 * 格式化填空题题目，递归替换zmfill标签为__
 * @param element
 */
export function normalizecompletionSelectContent(element: any) {
  element.childNodes.forEach((node: any) => {
    const tagName: string = node.nodeName.toLowerCase();
    if (tagName === 'zmfill') {
      node.innerText = '__';
    } else if (node.childNodes.length > 0) {
      normalizecompletionSelectContent(node);
    }
  });
}

/**
 * 初始化选择题选项列表
 * @param optionList
 */
export function normalizeSelectOptionList(optionList: any[]) {
  console.log('格式化选项列表');
  // console.log('optionList is:');
  // console.log(optionList);
  if (!isArray(optionList)) {
    throw new TypeError('optionList(选项列表) is not a array');
  }
  const index: Map<string, string> = new Map([
    ['0', 'A'],
    ['1', 'B'],
    ['2', 'C'],
    ['3', 'D'],
    ['4', 'E'],
    ['5', 'F'],
  ]);
  const format: any = optionList.map((element: string, idx: number) => {
    let text: string = element;
    const nodeList: Node[] = string2node(element);
    const childNode: any[] = [];
    nodeList.forEach((node: any) => {
      childNode.push(...node.childNodes);
    });
    // text = nodeList[0].textContent || '';
    if (text.indexOf('<zmlatex') === -1) {
      // text = nodeList[0].textContent || '';
      text = nodeList.reduce((accumulator: string, node: any) => accumulator + node.textContent, '');
    }
    const option: any = {
      index: index.get(idx.toString()),
      text
    };
    // const childNode: NodeList = nodeList[0].childNodes;
    childNode.forEach((node: any) => {
      if (node.nodeName.toLowerCase() === 'img') {
        console.warn('选项图片设置');
        option.image = node.src;
      }
    });
    return option;
  });
  return format;
}

export function normalizeSelectStudentAnswer(answer: string) {
  console.log('选择题答案格式化');
  // console.log('student answer is:');
  // console.log(answer);
  if (!answer) {
    return '';
  }
  return answer;
}

export function normalizeSelectCorrectAnswer(answer: string) {
  console.log('单选题正确答案格式化');
  // console.log('correct answer is:');
  // console.log(answer);
  if (!answer) {
    throw new TypeError('single select correct answer is not a string');
  }
  return answer;
}

export function normalizeMultiSelectStudentAnswer(answer: string) {
  console.log('多选题答案格式化');
  // console.log('student answer is:');
  // console.log(answer);
  if (!answer) {
    return '';
  }
  return answer;
}

export function normalizeMultiSelectCorrectAnswer(answer: any[]) {
  console.log('多选题正确答案格式化');
  // console.log('correct answer is:');
  // console.log(answer);
  if (!answer) {
    return '';
  }
  if (!isArray(answer)) {
    throw new TypeError('multiSelect select correct answer is not a array');
  }
  return answer.join('|');
}

export function normalizeTypeSelectStudentAnswer(answer: string) {
  console.log('类型选择题答案格式化');
  // console.log('student answer is:');
  // console.log(answer);
  return JSON.parse(answer || '[]');
}

export function normalizeTypeSelectCorrectAnswer(answer: any[]) {
  console.log('类型选择题正确答案格式化');
  // console.log('correct answer is:');
  // console.log(answer);
  return answer.map((element: any) => {
    return JSON.parse(element);
  });
}

export function normalizeTrueOrFalseOptionList(optionList: any[], answer: string) {
  console.log('判断题选项列表格式化');
  // console.log('option list is:');
  // console.log(optionList);
  // console.log(answer);
  const answerMap: Map<number, string> = new Map([
    [1, 'A'],
    [2, 'B'],
  ]);
  console.log(answerMap.has(1));
  const list: any[] = optionList.map((element: any, index: number) => {
    const nodeList: Node[] = string2node(element);
    console.log(answerMap.get(index + 1));
    const yes: string[] = ['是', '对', '是的', '对', '对的', '会', '能', '可以', '正确'];
    // 是，对，是的，对的，会，能
    // return nodeList[0].textContent === '对' || nodeList[0].textContent === '是' || answerMap.get(index + 1) === answer;
    return yes.includes(nodeList[0].textContent || '');
    // return index < 1;
  });
  return list;
}

export function normalizeTrueOrFalseStudentAnswer(answer: string) {
  console.log('判断题学生答案格式化');
  // console.log('student answer is:');
  // console.log(answer);
  return answer;
}

export function normalizeTrueOrFalseCorrectAnswer(answer: string) {
  console.log('判断题正确答案格式化');
  // console.log('correct answer is:');
  // console.log(answer);
  return answer;
}

export function normalizeCompletionSelectStudentAnswer(answer: string) {
  console.log('填空题学生答案格式化');
  // console.log('student answer is:');
  // console.log(answer);
  if (answer) {
    return JSON.parse(answer);
  } else {
    return [];
  }
}
export default MakeData;
