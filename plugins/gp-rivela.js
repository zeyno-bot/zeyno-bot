const viewOnceCache = new Map()

let handler = async (m, { conn }) => {
  try {
    if (!m.quoted) {
      return m.reply('*⚠️ 𝛥𝐗𝐈𝚶𝐍 𝐒𝐘𝐒𝐓𝐄𝐌: 𝐑𝐢𝐬𝐩𝐨𝐧𝐝𝐢 𝐚 𝐮𝐧 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨 𝐯𝐢𝐬𝐮𝐚𝐥𝐢𝐳𝐳𝐚𝐛𝐢𝐥𝐞 𝐮𝐧𝐚 𝐬𝐨𝐥𝐚 𝐯𝐨𝐥𝐭𝐚.*')
    }

    if (!m.quoted?.viewOnce) {
      return m.reply('*⚠️ 𝛥𝐗𝐈𝚶𝐍 𝐒𝐘𝐒𝐓𝐄𝐌: 𝐐𝐮𝐞𝐬𝐭𝐨 𝐧𝐨𝐧 𝐞̀ 𝐮𝐧 𝐜𝐨𝐧𝐭𝐞𝐧𝐮𝐭𝐨 𝐯𝐢𝐬𝐮𝐚𝐥𝐢𝐳𝐳𝐚𝐛𝐢𝐥𝐞 𝐮𝐧𝐚 𝐬𝐨𝐥𝐚 𝐯𝐨𝐥𝐭𝐚.*')
    }

    const msgId = m.quoted.id || m.quoted.key?.id
    const cachedData = viewOnceCache.get(msgId)

    if (!cachedData) {
      return m.reply('*❌ 𝛥𝐗𝐈𝚶𝐍 𝐒𝐘𝐒𝐓𝐄𝐌: Non ho trovato questo file in memoria. Potrebbe essere stato inviato prima del mio ingresso o del mio riavvio.*')
    }

    const { buffer, mtype, caption } = cachedData

    if (/videoMessage/.test(mtype)) {
      await conn.sendFile(m.chat, buffer, 'video.mp4', caption, m)
    } else if (/imageMessage/.test(mtype)) {
      await conn.sendFile(m.chat, buffer, 'image.jpg', caption, m)
    } else if (/audioMessage/.test(mtype)) {
      await conn.sendFile(m.chat, buffer, 'audio.mp3', '', m, false, {
        mimetype: 'audio/mp4',
        ptt: cachedData.ptt || false
      })
    }

  } catch (e) {
    console.error(e)
    return m.reply('*❌ 𝛥𝐗𝐈𝚶𝐍 𝐒𝐘𝐒𝐓𝐄𝐌: Errore durante il recupero dei dati.*')
  }
}

handler.before = async (m, { conn }) => {
  if (!m.isGroup) return false
  
  const isViewOnce = m.viewOnce || m.message?.viewOnceMessageV2 || m.message?.viewOnceMessage || m.message?.viewOnceMessageV2Extension
  if (!isViewOnce) return false

  try {
    const msgId = m.id || m.key?.id
    if (viewOnceCache.has(msgId)) return false

    const mtype = m.mtype || Object.keys(m.message)[0]
    let buffer = await m.download().catch(() => null)

    if (buffer && buffer.length) {
      viewOnceCache.set(msgId, {
        buffer,
        mtype,
        caption: m.caption || '',
        ptt: m.message?.[mtype]?.ptt || false
      })
    }
  } catch (e) {
    console.error('Errore nel salvataggio preventivo ViewOnce:', e)
  }
  return false
}

handler.help = ['rivela']
handler.tags = ['group']
handler.command = ['readviewonce', 'rivela', 'viewonce']
handler.group = true
handler.admin = true

export default handler
