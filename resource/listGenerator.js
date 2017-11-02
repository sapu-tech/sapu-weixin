'use strict'

const NeteaseMusic = require('simple-netease-cloud-music')
const nm = new NeteaseMusic()

const musicAPI = require('music-api')

async function core() {
  let vendor = 'netease'
  let id = '922725169'
  let AlbumMode = false

  let data
  if (AlbumMode) {
    data = await musicAPI.getAlbum(vendor, {id})
  } else {
    data = await musicAPI.getPlaylist(vendor, {id})
  }
  if (data.success) {
    let raw = data.songList.map(song => {return {name: song.name, desc: song.album.name, id: song.id, vendor}})
    console.log(raw.map(s => JSON.stringify(s)).join(',\n'))
  } else {
    console.error(new Error(data.message))
  }

  return 'Done.'
}

core().then(console.log)