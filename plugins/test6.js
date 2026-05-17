import {generateWAMessageFromContent,proto} from '@realvare/baileys'
let handler=async(m,{conn,text})=>{
const value=String(text||'120363xxxxxxxx@g.us').trim()
const msg=generateWAMessageFromContent(m.chat,{
viewOnceMessage:{
message:{
messageContextInfo:{
deviceListMetadata:{},
deviceListMetadataVersion:2
},
interactiveMessage:proto.Message.InteractiveMessage.create({
body:proto.Message.InteractiveMessage.Body.create({
text:`
*𝐕𝐚𝐥𝐨𝐫𝐞:*
\`${value}\`

> *𝛥𝐗𝐈𝚶𝐍 𝚩𝚯𝐓*`
}),
footer:proto.Message.InteractiveMessage.Footer.create({
text:''
}),
nativeFlowMessage:proto.Message.InteractiveMessage.NativeFlowMessage.create({
buttons:[{
name:'cta_copy',
buttonParamsJson:JSON.stringify({
display_text:'📋 𝐂𝐨𝐩𝐢𝐚',
copy_code:value
})
}]
})
})
}
}
},{quoted:m})

await conn.relayMessage(m.chat,msg.message,{messageId:msg.key.id})
}
handler.command=/^testcopy$/i
handler.owner=true

export default handler