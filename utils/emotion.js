export class Trie {
  constructor() {
    this.words = 0;
    this.empty = 1;
    this.index = 0;
    this.children = {};
  }

  insert(str, pos, idx) {
    if (str.length === 0) {
      return;
    }
    let T = this;
    let k;
    let child;

    if (pos === undefined) {
      pos = 0;
    }
    if (pos === str.length) {
      T.index = idx;
      return;
    }
    k = str[pos];
    if (T.children[k] === undefined) {
      T.children[k] = new Trie();
      T.empty = 0;
      T.children[k].words = this.words + 1;
    }
    child = T.children[k];

    child.insert(str, pos + 1, idx);
  }

  build(arr) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
      this.insert(arr[i], 0, i);
    }
  }

  searchOne(str, pos) {
    if (pos === undefined) {
      pos = 0;
    }
    let result = {};
    if (str.length === 0) return result;
    let T = this;
    let child;
    let k;
    result.arr = [];
    k = str[pos];
    child = T.children[k];
    if (child !== undefined && pos < str.length) {
      return child.searchOne(str, pos + 1);
    }
    if (child === undefined && T.empty === 0) return result;
    if (T.empty == 1) {
      result.arr[0] = pos - T.words;
      result.arr[1] = T.index;
      result.words = T.words;
      return result;
    }
    return result;
  }

  search(str) {
    if (this.empty == 1) return [];
    let len = str.length;
    let searchResult = [];
    let tmp;
    for (let i = 0; i < len - 1; i++) {
      tmp = this.searchOne(str, i);

      if (typeof tmp.arr !== 'undefined' && tmp.arr.length > 0) {
        //console.info('tmp:' + tmp.arr[1])
        searchResult.push(tmp.arr);
        i = i + tmp.words - 1;
      }
    }
    return searchResult;
  }
}

export class Emotion {
  constructor() {
    this.emotion_map = {
      "[微笑]": "0", "[撇嘴]": "1", "[色]": "2", "[发呆]": "3", "[得意]": "4",
      "[流泪]": "5", "[害羞]": "6", "[闭嘴]": "7", "[睡]": "8", "[大哭]": "9",
      "[尴尬]": "10", "[发怒]": "11", "[调皮]": "12", "[呲牙]": "13", "[惊讶]": "14",
      "[难过]": "15", "[酷]": "16", "[冷汗]": "17", "[抓狂]": "18", "[吐]": "19",
      "[偷笑]": "20", "[愉快]": "21", "[白眼]": "22", "[傲慢]": "23", "[饥饿]": "24",
      "[困]": "25", "[惊恐]": "26", "[流汗]": "27", "[憨笑]": "28", "[悠闲]": "29",
      "[奋斗]": "30", "[咒骂]": "31", "[疑问]": "32", "[嘘]": "33", "[晕]": "34",
      "[疯了]": "35", "[哀]": "36", "[骷髅]": "37", "[敲打]": "38", "[再见]": "39",
      "[擦汗]": "40", "[抠鼻]": "41", "[鼓掌]": "42", "[糗大了]": "43", "[坏笑]": "44",
      "[左哼哼]": "45", "[右哼哼]": "46", "[哈欠]": "47", "[鄙视]": "48", "[委屈]": "49",
      "[快哭了]": "50", "[阴险]": "51", "[亲亲]": "52", "[吓]": "53", "[可怜]": "54",
      "[菜刀]": "55", "[西瓜]": "56", "[啤酒]": "57", "[篮球]": "58", "[乒乓]": "59",
      "[咖啡]": "60", "[饭]": "61", "[猪头]": "62", "[玫瑰]": "63", "[凋谢]": "64",
      "[嘴唇]": "65", "[爱心]": "66", "[心碎]": "67", "[蛋糕]": "68", "[闪电]": "69",
      "[炸弹]": "70", "[刀]": "71", "[足球]": "72", "[瓢虫]": "73", "[便便]": "74",
      "[月亮]": "75", "[太阳]": "76", "[礼物]": "77", "[拥抱]": "78", "[强]": "79",
      "[弱]": "80", "[握手]": "81", "[胜利]": "82", "[抱拳]": "83", "[勾引]": "84",
      "[拳头]": "85", "[差劲]": "86", "[爱你]": "87", "[NO]": "88", "[OK]": "89",
      "[爱情]": "90", "[飞吻]": "91", "[跳跳]": "92", "[发抖]": "93", "[怄火]": "94",
      "[转圈]": "95", "[磕头]": "96", "[回头]": "97", "[跳绳]": "98", "[投降]": "99",
      "[激动]": "100", "[乱舞]": "101", "[献吻]": "102", "[左太极]": "103", "[右太极]": "104"
    };
    this.emotion_list = [];
    this.trie = null;
    this.build();
  }

  build() {
    this.emotion_list = this.keys(this.emotion_map);
    this.trie = new Trie();
    this.trie.build(this.emotion_list);
  }

  parser(str) {
    const indices = this.trie.search(str);
    indices.reverse().map(idx => {
      const pos = idx[0];
      const emotion = this.emotion_list[idx[1]]
      const img = '<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/' + this.emotion_map[emotion] + '.gif" alt="' + emotion + ' " style="margin-top: 30rpx;" />';
      str = this.splice(str, pos, emotion.length, img);
    });
    //return '<p>' + str + '</p>';
    return str
  }

  splice(str, index, count, add) {
    return str.slice(0, index) + add + str.slice(index + count);
  }

  keys(map) {
    let list = [];
    for (let k in map) {
      if (map.hasOwnProperty(k)) list.push(k);
    }
    return list;
  }
}

const emotionParser = (text) => {
  //let parser = wx.getStorageSync('motionParser');
  /*let emotion = null
  if (emotion == null) {
    emotion = new Emotion();
    //wx.setStorageSync('motionParser', parser);
  }*/
  return new Emotion().parser(text);
}
export default {
  emotionParser
}