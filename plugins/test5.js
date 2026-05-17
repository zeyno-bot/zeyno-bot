let handler=async(m,{conn,text})=>{
try{
const{createWelcomeCard}=await import(`../lib/cards/welcome-card.js?update=${Date.now()}`)
const group=m.isGroup?await conn.groupMetadata(m.chat).catch(()=>null):null
const jid=m.mentionedJid?.[0]||m.quoted?.sender||m.sender
const username=conn.getName(jid)||'Utente'
const groupName=group?.subject||'Gruppo'
const type=/addio|goodbye/i.test(text||'')?'addio':'benvenuto'

const card=await createWelcomeCard({
conn,
jid,
username,
group:groupName,
type
})

await conn.sendMessage(m.chat,{image:card},{quoted:m})

}catch(e){
console.error(e)
await m.reply(String(e?.stack||e))
}
}

handler.command=/^test5$/i
handler.owner=true

export default handler