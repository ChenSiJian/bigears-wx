
function emojiAnalysis(arr,srcPrefix, type = "load") {
    if(srcPrefix ==null){
      srcPrefix = "../../images/qqface/"
    }
    //arr: 传入的消息数组
    //type：消息解析类型，参数：load（读取消息），input（输入消息）

    // emoji对象
    var __emojiObjs = {
      "微笑": "0", "撇嘴": "1", "色": "2", "发呆": "3", "得意": "4",
      "流泪": "5", "害羞": "6", "闭嘴": "7", "睡": "8", "大哭": "9",
      "尴尬": "10", "发怒": "11", "调皮": "12", "呲牙": "13", "惊讶": "14",
      "难过": "15", "酷": "16", "冷汗": "17", "抓狂": "18", "吐": "19",
      "偷笑": "20", "愉快": "21", "白眼": "22", "傲慢": "23", "饥饿": "24",
      "困": "25", "惊恐": "26", "流汗": "27", "憨笑": "28", "悠闲": "29",
      "奋斗": "30", "咒骂": "31", "疑问": "32", "嘘": "33", "晕": "34",
      "疯了": "35", "哀": "36", "骷髅": "37", "敲打": "38", "再见": "39",
      "擦汗": "40", "抠鼻": "41", "鼓掌": "42", "糗大了": "43", "坏笑": "44",
      "左哼哼": "45", "右哼哼": "46", "哈欠": "47", "鄙视": "48", "委屈": "49",
      "快哭了": "50", "阴险": "51", "亲亲": "52", "吓": "53", "可怜": "54",
      "菜刀": "55", "西瓜": "56", "啤酒": "57", "篮球": "58", "乒乓": "59",
      "咖啡": "60", "饭": "61", "猪头": "62", "玫瑰": "63", "凋谢": "64",
      "嘴唇": "65", "爱心": "66", "心碎": "67", "蛋糕": "68", "闪电": "69",
      "炸弹": "70", "刀": "71", "足球": "72", "瓢虫": "73", "便便": "74",
      "月亮": "75", "太阳": "76", "礼物": "77", "拥抱": "78", "强": "79",
      "弱": "80", "握手": "81", "胜利": "82", "抱拳": "83", "勾引": "84",
      "拳头": "85", "差劲": "86", "爱你": "87", "NO": "88", "OK": "89",
      "爱情": "90", "飞吻": "91", "跳跳": "92", "发抖": "93", "怄火": "94",
      "转圈": "95", "磕头": "96", "回头": "97", "跳绳": "98", "投降": "99",
      "激动": "100", "乱舞": "101", "献吻": "102", "左太极": "103", "右太极": "104"
    };

    var objList = [];

    if(isString(arr)){
      objList.push(preData(arr,srcPrefix));
    }else{
      for (var i = 0; i < arr.length; i++) {
      // if (type === 'load') {
          objList.push(preData(arr[i],srcPrefix));
      // }
      }
    }

    return objList;

    // 解析字符串 创建对象 储存 分解后的 字符串，把 ‘表情代码’ 和 ‘文本’ 分解
    function preData(str,srcPrefix) {
        // 提取表情编号 的 正则
        var reg = new RegExp(/[\'\[]?([^\[\[\]\]]*)[\'\]]?/i);
        var arr = str.split(reg);

        var emojiObj; // 分解后的 对象
        var emojiObjList = []; // 分解后对象的集合----数组形式 
        for (var i = 0; i < arr.length; i++) {
            var ele = arr[i];
            emojiObj = {};
            if (__emojiObjs[ele]) {
                emojiObj.tag = "emoji";
                emojiObj.node = 'element';
                emojiObj.baseClass = "face";
                //emojiObj.txt = __emojiObjs[ele]+'.png';
                emojiObj.txt = '<img src="'+ srcPrefix + __emojiObjs[ele]+'.png" alt="' + ele + ' " />';

            } else if(ele != ''){
                emojiObj.node = 'text';
                emojiObj.txt = ele;
            }
            if(ele != ''){
                emojiObjList.push(emojiObj);
            }

        }
        var resultStr = ''
        for(let i in emojiObjList){
            var tmp = emojiObjList[i]
            resultStr = resultStr + tmp.txt
        }
        //return emojiObjList;
        return resultStr
    }

    function isString(str){
        return (typeof str=='string')&&str.constructor==String;
    }
}

module.exports = {
    emojiAnalysis: emojiAnalysis
}