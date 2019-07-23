import {request} from '../utils/http.js'
import {apiUrl} from '../config/api.js'


function like(behavior, artID, category,formId){
    let url = behavior == 'like' ? apiUrl.ClassicLike : apiUrl.ClassicUnLike
    request({
        url: url,
        method: 'POST',
        data: {
            art_id: artID,
            type: category,
            formId: formId
        }
    })
}

function getClassicLikeStatus(artID, category){
    return new Promise(function (resolve, reject) {
        request({
            url: apiUrl.ClassicLikeStatus + category + '/' + artID + '/favor'
        }).then((res)=>{
            resolve(res)
        }).catch((err) => {
            reject(err)
        })
    })

}


export {
    like,
    getClassicLikeStatus
}