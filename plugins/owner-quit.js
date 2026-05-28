let handler = async (m, { conn, args, command }) => {
await m.reply('`*𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 ha abbandonato il gruppo correttamente*✅️`') 
await  conn.groupLeave(m.chat)}
handler.command = /^(out|leave|byebye)$/i
handler.group = true
handler.rowner = true
export default handler