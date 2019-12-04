/* tslint:disable:no-unused-expression */
import {expect} from 'chai';
import {mount, Wrapper} from '@vue/test-utils';
import AnswerSheet from 'components/answer-sheet.vue';

describe('AnswerSheet', () => {
  const wrapper: Wrapper<any> = mount(AnswerSheet, {
    propsData: {
      title: '答题表',
      text: '正确10题，错误5题，未作答0题'
    },
    slots: {
      footer: '<button>提交</button>'
    }
  });
  it('title', () => expect(wrapper.find('.pad-answer-sheet__title').html()).contain('答题表'));
  it('text', () => expect(wrapper.find('.pad-answer-sheet__text').html()).contain('正确10题，错误5题，未作答0题'));
  it('footer slot', () => expect(wrapper.find('.pad-answer-sheet__footer').html()).contain('<button>提交</button>'));
  it('dataSource', () => {
    wrapper.setProps({
      dataSource: [
        {status: 'done'},
        {status: 'correct'},
        {status: 'incorrect'},
        {status: 'undo'}
      ]
    });
    const elements: any = wrapper.findAll('.pad-answer-sheet__item');
    expect(elements.at(0).classes()).contain('pad-answer-sheet__item--done');
    expect(elements.at(1).classes()).contain('pad-answer-sheet__item--correct');
    expect(elements.at(2).classes()).contain('pad-answer-sheet__item--incorrect');
    expect(elements.at(3).classes()).to.have.length(1);
  });
  it('visible', () => {
    expect(wrapper.isVisible()).to.be.false;
    wrapper.setProps({value: true});
    expect(wrapper.isVisible()).to.be.true;
    wrapper.vm.$emit('input', false);
    expect(wrapper.emitted().input[0]).contain(false);
  });
});
