import Mock from 'mockjs';

const result = {
  code: '0',
  message: '埋点成功'
};

Mock.mock(/http:\/\/user-behavior-log.zmlearn.com\/log\//, 'post', {
  ...result
});

