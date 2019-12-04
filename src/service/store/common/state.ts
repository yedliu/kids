export default {
  allowEdit: true, // true 可以做题； false 不可以做题
  currentAnswer: [], // 学生当前选择的答案 [id: 题目id ,stuAnswer: '', // 已选项: String PS:未作答时无该字段或该字段为空]
  questionsData: '', // MakeData.data
  checkBoxHidden: true, // 提交作业确认框是否隐藏
  isCurrentStuAnswerEmpty: [],
  currentIndex: 0,
};
