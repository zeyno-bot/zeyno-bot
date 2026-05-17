import fs from 'fs'
import path from 'path'
import axios from 'axios'
import sharp from 'sharp'
import {createCanvas,loadImage} from 'canvas'

const FONT_BOLD='900 118px Sans'
const FONT_NUMBER='700 50px Sans'

// font nome gruppo
const FONT_SMALL='900 52px Sans'

// font membri
const FONT_MEMBERS='700 28px Sans'

const FALLBACK='./media/default-avatar.png'

async function avatarToImage({avatar,conn,jid}){
try{
let buffer

if(Buffer.isBuffer(avatar))buffer=avatar
else if(typeof avatar==='string'&&/^https?:\/\//i.test(avatar)){
const{data}=await axios.get(avatar,{responseType:'arraybuffer'})
buffer=Buffer.from(data)
}else if(typeof avatar==='string'&&fs.existsSync(avatar)){
buffer=fs.readFileSync(avatar)
}else if(conn&&jid){
const url=await conn.profilePictureUrl(jid,'image')
const{data}=await axios.get(url,{responseType:'arraybuffer'})
buffer=Buffer.from(data)
}else{
buffer=fs.readFileSync(FALLBACK)
}

const safe=await sharp(buffer)
.resize(250,250,{fit:'cover',position:'center'})
.png()
.toBuffer()

return await loadImage(safe)

}catch{

const safe=await sharp(fs.readFileSync(FALLBACK))
.resize(255,255,{fit:'cover',position:'center'})
.png()
.toBuffer()

return await loadImage(safe)

}
}

export async function createWelcomeCard({
conn,
jid,
avatar,
username='Utente',
type='benvenuto',
group='Gruppo',
members=0
}){

const width=1536,height=1024
const canvas=createCanvas(width,height)
const ctx=canvas.getContext('2d')

// sfondo
const bg=await loadImage(
path.join(process.cwd(),'media/welcome-left.png')
)

ctx.drawImage(bg,0,0,width,height)

// avatar
const avatarImg=await avatarToImage({avatar,conn,jid})

const avatarSize=255
const avatarX=width/2-avatarSize/2
const avatarY=157

// ritaglio cerchio
ctx.save()

ctx.beginPath()
ctx.arc(
width/2,
avatarY+avatarSize/2,
avatarSize/2,
0,
Math.PI*2
)

ctx.closePath()
ctx.clip()

ctx.drawImage(
avatarImg,
avatarX,
avatarY,
avatarSize,
avatarSize
)

ctx.restore()

// allinea testi
ctx.textAlign='center'

// titolo benvenuto/addio
ctx.shadowColor='#ffffff'
ctx.shadowBlur=16
ctx.fillStyle='#f5f5f5'
ctx.font=FONT_BOLD

ctx.fillText(
type.toLowerCase(),
width/2,
575
)

// username utente
ctx.shadowBlur=10
ctx.fillStyle='#ff5a5a'
ctx.font=FONT_NUMBER

ctx.fillText(
username,
width/2,
675
)

// nome gruppo
ctx.shadowBlur=10
ctx.fillStyle='#f5f5f5'
ctx.font=FONT_SMALL

ctx.fillText(
`• ${group}`,
width/2,
770
)

// membri attuali
ctx.shadowBlur=6
ctx.fillStyle='#d8d8d8'
ctx.font=FONT_MEMBERS

ctx.fillText(
`• MEMBRI ATTUALI ${members}`,
width/2,
820
)

// firma bot
ctx.textAlign='right'

ctx.shadowColor='rgba(255,70,70,.45)'
ctx.shadowBlur=15
ctx.fillStyle='#ff4d4d'
ctx.font='500 28px Sans'

ctx.fillText(
'AXION BOT',
width-190,
height-135
)

return await sharp(
canvas.toBuffer('image/png')
)
.jpeg({quality:90})
.toBuffer()

}

export default createWelcomeCard