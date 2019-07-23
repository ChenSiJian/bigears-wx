import {Base64} from 'base64.js'
var classicModel = require('../models/classic.js')


export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            classicModel.getLyric(this.mid).then((res) => {
                if (res.status === 200) {
                    this.lyric = Base64.decode(res.data.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyric')
                }
            })
        })
    }
}

export function createSong(musicData) {
    return new Song({
        id: musicData.id,
        mid: musicData.id,
        singer: '',
        name: musicData.title,
        album: '',
        duration: '',
        image: musicData.imageUrl,
        url: musicData.mediaUrl
    })
}
module.exports = {
    createSong: createSong
}

