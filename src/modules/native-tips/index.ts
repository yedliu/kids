import kids from 'service/native/';

export function questionDialog(type: 'singleSelect' | 'multiSelect' | 'trueOrFalse' | 'completionSelect' | 'textMatchText' | 'textMatchImg' | 'typeSelect' | 'reorderText' | 'reorderImg', callBack: any) {
  let dataType: string = 'none';
  if (type === 'completionSelect') {
    dataType = 'completion';
  } else if (type === 'textMatchText' || type === 'textMatchImg') {
    dataType = 'match';
  } else if (type === 'typeSelect') {
    dataType = 'categorizing';
  } else if (type === 'reorderText') {
    dataType = 'reorderText';
  } else if (type === 'reorderImg') {
    dataType = 'reorderImg';
  }
  const times: string | null = localStorage.getItem(dataType);
  if (dataType !== 'none' && !times) {
    localStorage.setItem(dataType, '1');
    callBack();
    kids.show(dataType);
  }
}

export function firstTips() {
  const times: string | null = localStorage.getItem('f');
  if (!times) {
    localStorage.setItem('f', '1');
    kids.showFirst();
  }
}

export function testFirstTips(callBack: any) {
  const times: string | null = localStorage.getItem('tf');
  if (!times) {
    localStorage.setItem('tf', '1');
    callBack();
    kids.showTestFirst();
  }
}

export function showPraisePartner() {
  kids.showPraise();
}

export function exit() {
  console.log('exit');
  kids.close();
}

export function resetState() {
  localStorage.clear();
}

