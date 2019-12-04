### 数据文档


作业
```typescript
  {
      id: number;
      name: string;
      type: number;                               // 作业类型
      difficulty: number;                         // 作业难度
      state: number;                              // 状态 0：老师已布置，学生未完成 1.（学生）已提交 2 （老师）已批改 3. 学生正在作答 4 正在批改 5 已过期
      lessonId: number;                           // 课程id
      studentId: number;                          // 学生id
      questionAmount: number;                     // 题目数量
      questionAmountNoSub: number;                // 题目数量（不含子题目）
      totalScore: number;                         // 本作业总分数
      stuGetScore: number;                        // 学生得分
      costTime: string;                           // 学生做题话费时间（单位：毫秒）
  }
```

题目
 ```typescript
  {
      id: number;
      title: string;                               // 题干
      titleImgUrl?: string;                        // 题干的图片
      questionType: allSelect | 'multiSelect' | 'subjectiveSelect' | 'trueOrFalse' | 'completionSelect' | 'textMatchText' | 'textMatchImg' | 'typeSelect';
      state: number;                               // 0 未做 1 已做未提交 2 已提交为批改 3 已该结果正确 4 已批改结果错误
      analysis?: string;                           // 作业解析
      classList?: any[];                           // 分类题 类别列表
      optionList?: Option[];                       // 选择题列表
      correctAnswer: string;                       // 正确答案
      stuAnswer: string;                           // 实际答案
      score: number;                               // 本体分数
      stuGetScore?: number;                        // 题目学生得分，已批改才有
  }
```
