
export default {
  set_current_answer({commit}: {commit: any}, currentSubject: any) {
    commit('SET_CURRENTANSWER', currentSubject);
  },
  set_allow_edit({commit}: {commit: any}, stateNumber: any) {
    commit('SET_ALLOWEDIT', stateNumber);
  },
  set_questions_data({commit}: {commit: any}, currentSubject: any) {
    commit('SET_QUESTIONSDATA', currentSubject);
  },
  set_select_box_hide({commit}: {commit: any}, isHide: boolean) {
    commit('SET_CHECKBOXHIDDEN',  isHide);
  },
};

