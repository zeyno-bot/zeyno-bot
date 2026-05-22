let handler = async (m, { conn }) => {
    let staff = `*⋆｡˚✦『 𝐒𝐓𝐀𝐅𝐅 𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 』✦˚｡⋆*

*╭───────────────╮*
*│ 🤖 𝐁𝐨𝐭:* ${global.nomebot}
*│ 🆚 𝐕𝐞𝐫𝐬𝐢𝐨𝐧𝐞:* ${global.versione}
*╰───────────────╯*

*╭─── 👑 𝐂𝐑𝐄𝐀𝐓𝐎𝐑𝐄 ───╮*
*│ ✦ 𝐍𝐨𝐦𝐞:* Endy
*│ ✦ 𝐑𝐮𝐨𝐥𝐨:* Creatore / Developer
*│ ✦ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* @393501989497
*╰────────────────────╯*

*╭─── 🔱 𝐂𝐎-𝐎𝐖𝐍𝐄𝐑 ───╮*
*│ ✦ Ksav*
*│   ├ 𝐑𝐮𝐨𝐥𝐨:* Co-Owner/ Lead Developer
*│   └ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* @77787623522
*╰────────────────────╯*

*╭─── 🛡️ 𝐒𝐓𝐀𝐅𝐅 ───╮*
*│ ✦ 𝐋𝐮𝐱𝐢𝐟𝐞𝐫*
*│   ├ 𝐑𝐮𝐨𝐥𝐨:* Staffer
*│   └ 𝐂𝐨𝐧𝐭𝐚𝐭𝐭𝐨:* @212693877842
*╰────────────────────╯*

*╭─── 📌 𝐈𝐍𝐅𝐎 𝐔𝐓𝐈𝐋𝐈 ───╮*
*│ ✦ 𝐆𝐢𝐭𝐇𝐮𝐛:* github.com/zeyno-bot
*│ ✦ 𝐒𝐮𝐩𝐩𝐨𝐫𝐭𝐨:* @573217871395
*╰────────────────────╯*

> *𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓*`

    await conn.reply(
        m.chat,
        staff.trim(),
        m,
        {
            contextInfo: {
                mentionedJid: [
                    '393501989497@s.whatsapp.net',
                    '77787623522@s.whatsapp.net',
                    '639350468907@s.whatsapp.net',
                    '393509594333@s.whatsapp.net'
                ]
            }
        }
    )

    await conn.sendMessage(m.chat, {
        contacts: {
            contacts: [
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Endy
ORG:𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 - Creatore / Dev
TEL;type=CELL;type=VOICE;waid=393501989497:+393501989497
END:VCARD`
                },
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:Ksav
ORG:𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 - Co-Owner
TEL;type=CELL;type=VOICE;waid=7778 7623522:+77787623522
END:VCARD`
                },
                {
                    vcard: `BEGIN:VCARD
VERSION:3.0
FN:medalis
ORG:𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 - Staffer
TEL;type=CELL;type=VOICE;waid=212693877842:+212693877842
END:VCARD`
                }
            ]
        }
    }, { quoted: m })

    m.react('👑')
}

handler.help = ['staff']
handler.tags = ['main']
handler.command = ['staff', 'collaboratori']

export default handler
