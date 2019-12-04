declare interface Data {
  '1v1ClassHomework': boolean;
  'answeredAmount': number; // 0
  'answeredAmountNoSub': number;
  'autoCorrectAmount': number;
  'clazzType': number;
  'correctMode': number;
  'correctTime': string; // ISO Date String '2019-01-18T06:27:07.588Z'
  'costTime': string;
  'costTimeText': string;
  'createdTime': string; // ISO Date String '2019-01-18T06:27:07.588Z'
  'csId': number;
  'diff': number;
  'expiryDate': string; // ISO Date String '2019-01-18T06:27:07.588Z'
  'grade': string;
  'graspKnowledgeDTOList': [{
    'allAmount': number;
    'knowledgeName': string;
    'rightAmount': number;
  }];
  'homeworkLessonQuestionDTOList': [
    {
      'correctResult': number;
      'hlId': number;
      'id': number;
      'questionEsDto': {
        'Analyse': string;
        'Answer': string;
        'Cate': number;
        'CateName': string;
        'Category': number;
        'Content': string;
        'Degree': string;
        'ID': string;
        'Label': string;
        'Method': string;
        'Options': string[];
        'Subject': string;
        'ViewCount': number;
        'Year': number;
        'chapterIds': number[];
        'children': [
          {
            'analyse': string;
            'answer': string;
            'cateName': string;
            'content': string;
            'correctResult': number;
            'id': number;
            'method': string;
            'optionCount': number;
            'options': string[];
            'order': number;
            'score': number;
            'stuAnswer': string;
            'stuGetScore': number;
          }
          ];
        'errReason': string;
        'errType': number;
        'knowledgeIds': number[];
        'knowledgeName': string;
        'knowledgeNameList': string[];
        'lastModifiedDate': string; // ISO Date String '2019-01-18T06:27:07.588Z'
        'optionCount': number;
        'phaseSubject': string;
        'phaseSubjectId': number;
        'score': number;
        'starLevel': number;
        'status': number;
        'subState': number;
        'suitStage': number[];
        'useCount': number;
      };
      'questionId': string;
      'questionOutputDTO': {
        'abilityIdList': number[];
        'analysis': string;
        'answerList': string[];
        'browseCount': number;
        'chapterIdList': string[];
        'children': [
          {
            'analysis': string;
            'answerList': string;
            'correctResult': number;
            'difficulty': number;
            'examPointIdList': number[];
            'id': number;
            'knowledgeIdList': number[];
            'optionList': string;
            'questionId': number;
            'score': number;
            'stuAnswer': string;
            'stuGetScore': number;
            'subQuestionMemberList': [
              {
                'content': string;
                'id': number;
                'showOrder': number;
                'subQuestionId': number;
                'type': string;
              }
              ];
            'subStuAnsId': number;
            'title': string;
            'typeId': number;
          }
          ];
        'cityId': number;
        'comprehensiveDegreeId': number;
        'content': string;
        'coreLiteracyIdList': number;
        'correctRate': number;
        'correctResult': number;
        'costTime': number;
        'countyId': number;
        'courseSystemIdList': number[];
        'createdTime': string;
        'createdUser': number;
        'difficulty': number;
        'distinction': number;
        'editionIdList': number[]
        'errReason': string;
        'errType': number;
        'examCount': number;
        'examPointIdList': number[];
        'gradeId': number;
        'id': number;
        'keywordList': string[];
        'knowledgeIdList': number[]
        'knowledgeNameList': string[];
        'label': string;
        'layoutStyle': number;
        'optionList': string[];
        'parentTypeId': number;
        'parentTypeName': string;
        'picIndex': number;
        'picUrl': string;
        'provinceId': number;
        'questionType': string;
        'quoteCount': number;
        'rating': number;
        'recommendationIndex': number;
        'remarks': string;
        'schoolId': number;
        'score': number;
        'sourceId': number;
        'state': number;
        'storageTime': string;
        'stuAns': string;
        'stuAnsId': number;
        'stuGetScore': number;
        'sub': boolean;
        'subjectCharacteristicIdList': number[];
        'subjectId': number;
        'templateType': number;
        'termId': number;
        'title': string;
        'typeId': number;
        'updatedTime': string;
        'updatedUser': number;
        'versions': number;
        'x1': number;
        'x2': number;
        'y1': number;
        'y2': number;
        'year': number;
      };
      'questionSource': number;
      'score': number;
      'stuAnswer': string;
      'stuGetScore': number;
    }
    ];
  'id': number;
  'lessonId': number;
  'lessonType': number;
  'name': string;
  'nonObjectiveAnsweredAmount': number;
  'objectiveAmount': number;
  'objectiveRightAmount': number;
  'partRightAmount': string;
  'questionAmount': string;
  'questionAmountNoSub': number;
  'questionSource': number;
  'rightAmount': string;
  'rightKnowledgeList': string[];
  'smallClassHomework': boolean;
  'startAnswerTime': string;
  'state': number;
  'stuFinishOnTime': number;
  'stuGetScore': string;
  'stuName': string;
  'stuUserId': number;
  'stuViewFlag': boolean;
  'subject': string;
  'submitTime': string[];
  'submitedStuCount': number;
  'teaName': string;
  'teaTotalComment': string;
  'totalScore': string;
  'totalStuCount': number;
  'type': number;
  'waitCorrectAmount': number;
  'wrongAmount': string;
  'wrongKnowledgeList': string[];
}

interface Question {
  id: number;
  questionType: 'singleSelect' | 'multiSelect' | 'subjectiveSelect' | 'trueOrFalse' | 'completionSelect' | 'textMatchText' | 'textMatchImg' | 'typeSelect';
  state: number; // 0 未做 1 已做未提交 2 已提交为批改 3 已该结果正确 4 已批改结果错误
  analysis: string;
  optionList?: any[]; // 选择题列表
  analysisImgUrl?: string; // 图文判断题
  correctAnswer: string;
  stuAnswer: string;
  score: number;
  stuGetScore?: number; // 题目学生得分，已批改才有
}
declare module '*.json' {
  const value: Data;
  // @ts-ignore
  export default value;
}
