// 以下是业务服务器API地址
var WxApiRoot = 'https://m.xxx.cn/bigears/api/';
var WSbasicUrl = 'wss://m.xxx.cn:xxx/ws'

const apiUrl = {
    WebsocketUrl: WSbasicUrl + '',
    IndexUrl: WxApiRoot + 'home/index', //首页数据接口
    CatalogList: WxApiRoot + 'catalog/index', //分类目录全部分类数据接口
    CatalogCurrent: WxApiRoot + 'catalog/current', //分类目录当前分类数据接口

    AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
    CheckBigearsToken: WxApiRoot + 'auth/checkToken', //服务端tocken审查
    ClassicLike: WxApiRoot + 'like',
    ClassicUnLike: WxApiRoot + 'like/cancel',
    ClassicLikeStatus: WxApiRoot + 'classic/',
    ClassicGetLatest: WxApiRoot + 'classic/latest',
    GetClassic: WxApiRoot + 'classic/',
    GetMyFavor: WxApiRoot + 'classic/favor',
    GetClassicById: WxApiRoot + 'classic/',

    GetLyric: WxApiRoot + 'classicDetail/lyric/',

    ClassicCategory: WxApiRoot + 'classic/category',
    ClassicList: WxApiRoot + 'classic/list',

    ClassicSearch: WxApiRoot + 'classic/search',

    CommentsList: WxApiRoot + 'comment/list',

    CommentZanStatus: WxApiRoot + 'comment/',

    CommentZan: WxApiRoot + 'comment/zan',
    CommentUnZan: WxApiRoot + 'comment/zan/cancel',
    AddComment: WxApiRoot + 'comment/add',
    MyCommentsList: WxApiRoot + 'comment/mylist',
    DelComment: WxApiRoot + 'comment/',

    GetUserInfo: WxApiRoot + 'user',
    UnReadMsg: WxApiRoot + 'user/getUnReadMsgList',
    SignMsg: WxApiRoot + 'user/signMsg',

    ChatFileUpload: WxApiRoot + 'storage/fileUpload',
    UpdateViewCounts: WxApiRoot + 'classic/updateViewCounts',

}
export {apiUrl}