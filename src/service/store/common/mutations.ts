const toggleCurrentStuAnswerState = (stuState: any, index: number) => {
  let flag = true;
  const type = typeof stuState;
  const isArray = stuState instanceof Array;
  const isObject = stuState instanceof Object;
  const isString = typeof stuState === 'string';
  const isNumber = typeof stuState === 'number';
  if (stuState) { // {} [] ".."
    if (isNumber) { flag = false; } else if (isString && stuState.replace(/ /g, '').length > 0) { flag = false; } else if (isArray && stuState.length > 0) { flag = false; } else if (isObject && !isArray && JSON.stringify(stuState) !== '{}') { flag = false; }
  }
  return flag;

};
const setCurrentStuAnswerState = (state: any, stuState: any, index: number) => {
  const flag = toggleCurrentStuAnswerState(stuState, index);
  state.isCurrentStuAnswerEmpty[index] = flag;
};

export default {
  SET_ALLOWEDIT(state: any, stateNumber: any) {
    stateNumber = parseInt(stateNumber, 10);
    state.allowEdit = !(stateNumber !== 0 && stateNumber !== 3);
  },
  SET_CURRENTANSWER(state: any, currentSubject: any) {
    const hasIt = state.questionsData.questions.findIndex((value: any, index: any, arr: any) => {

      return value.id === currentSubject.id;
    });
    console.log('hasIt', hasIt);
    if (hasIt > -1) {
      state.currentIndex = hasIt;
      const {id, type, stuAnswer} = currentSubject;
      let stuAnswerIn = state.questionsData.questions[hasIt].stuAnswer;
      let stuAnswerData = state.questionsData.questions[hasIt].stuAnswer;
      !stuAnswerIn && (stuAnswerIn = '');
      if (type === 'multiSelect') {
        if (stuAnswerIn.indexOf(stuAnswer) > -1) {
          const payload = '|' + stuAnswer;
          stuAnswerData = stuAnswerIn.replace(payload, '').replace(stuAnswer, '');
          const splitIndex = stuAnswerData.indexOf('|') === 0;
          if (splitIndex) { stuAnswerData = stuAnswerData.replace('|', ''); }
        } else if (stuAnswerIn) {
          stuAnswerData += ('|' + stuAnswer);
        } else {
          stuAnswerData = stuAnswer;
        }
      } else if (type === 'singleSelect' || type === 'trueOrFalse') {
        stuAnswerData = stuAnswer;
      } else {
        stuAnswerData = stuAnswer;
      }
      state.questionsData.questions[hasIt].stuAnswer = stuAnswerData;
      setCurrentStuAnswerState(state, state.questionsData.questions[hasIt].stuAnswer, hasIt);
    }
    console.log('state.questionsData.questions[hasIt].stuAnswer', state.questionsData.questions[hasIt].stuAnswer);

    // state.currentAnswer = Array.from(state.currentAnswer, (item: any) => {
    //   if (item.id === currentSubject.id) {
    //     item.stuAnswer = currentSubject.stuAnswer;
    //   }
    //   return item;
    // });
  },
  SET_QUESTIONSDATA(state: any, questionsData: any) {
    state.questionsData = questionsData;
  },
  SET_CHECKBOXHIDDEN(state: any, isHide: boolean) {
    state.checkBoxHidden = isHide;
  },

};
