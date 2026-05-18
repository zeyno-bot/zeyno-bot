// Configura qui il tuo numero di telefono (Owner) senza spazi o simboli, seguito da @s.whatsapp.net
const OWNER_NUMBER = '393780560229@s.whatsapp.net'; 

const handler = async (m, { conn, text, command }) => {
    // Inizializza la blacklist nel database se non esiste
    global.db.data.blacklist = global.db.data.blacklist || [];

    // Controllo di sicurezza: Solo l'owner
    if (m.sender !== OWNER_NUMBER) {
        return conn.sendMessage(m.chat, { text: '❌ Questo comando è riservato esclusivamente all\'owner del bot.' }, { quoted: m });
    }

    if (command === 'block') {
        let target = '';

        // Se l'utente ha taggato qualcuno (es. .block @utente)
        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        } 
        // Se l'utente ha risposto a un messaggio (reply) kikka chi ha inviato quel messaggio
        else if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } 
        // Se l'utente ha scritto il numero a mano (es. .block 27633534835)
        else if (text) {
            let cleaned = text.replace(/[^0-9]/g, '');
            if (cleaned.length > 5) { // Controllo minimo per evitare numeri vuoti
                target = cleaned + '@s.whatsapp.net';
            }
        }

        if (!target) {
            return conn.sendMessage(m.chat, { text: '⚠️ Uso corretto:\n• *.block @tag*\n• Rispondi a un messaggio col comando *.block*\n• *.block 27633534835*' }, { quoted: m });
        }

        // Estrae il numero pulito da mostrare nel messaggio di conferma
        let displayNum = target.split('@')[0];

        if (global.db.data.blacklist.includes(target)) {
            return conn.sendMessage(m.chat, { text: `ℹ️ Il numero *${displayNum}* è già presente nella blacklist.` }, { quoted: m });
        }

        // Aggiunge al database permanente
        global.db.data.blacklist.push(target);
        await conn.sendMessage(m.chat, { text: `🚫 Numero *${displayNum}* aggiunto alla blacklist con successo.` }, { quoted: m });

        // --- CONTROLLO RETROATTIVO SUI GRUPPI ---
        await conn.sendMessage(m.chat, { text: `⏳ Scansione dei gruppi in corso per rimuovere l'utente...` }, { quoted: m });
        
        let kickCount = 0;
        try {
            // Sfruttiamo i metadati dei gruppi memorizzati nell'handler del bot o in store
            const chats = Object.keys(global.db.data.chats || conn.chats || {});
            
            for (let chatId of chats) {
                if (chatId.endsWith('@g.us')) {
                    try {
                        let metadata = await conn.groupMetadata(chatId).catch(() => null);
                        if (!metadata) continue;
                        
                        let isPresent = metadata.participants.some(p => p.id === target);
                        
                        // Controlla se il bot è admin nel gruppo
                        let botId = conn.decodeJid(conn.user.id);
                        let botIsAdmin = metadata.participants.some(p => p.id === botId && (p.admin === 'admin' || p.admin === 'superadmin'));

                        if (isPresent && botIsAdmin) {
                            await conn.groupParticipantsUpdate(chatId, [target], 'remove');
                            await conn.sendMessage(chatId, { text: `⚡ *Axion Security:* Rilevato utente in blacklist globale. Espulso automaticamente.` });
                            kickCount++;
                        }
                    } catch (err) {
                        // Salta l'errore del singolo gruppo
                    }
                }
            }
            await conn.sendMessage(m.chat, { text: `✅ Scansione completata. Utente kikkato da *${kickCount}* gruppi.` }, { quoted: m });
        } catch (e) {
            console.error('Errore nel controllo retroattivo blacklist:', e);
        }
    }

    if (command === 'unblock') {
        let target = '';

        if (m.mentionedJid && m.mentionedJid.length > 0) {
            target = m.mentionedJid[0];
        } else if (m.quoted && m.quoted.sender) {
            target = m.quoted.sender;
        } else if (text) {
            target = text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
        }

        if (!target || !global.db.data.blacklist.includes(target)) {
            return conn.sendMessage(m.chat, { text: 'ℹ️ Questo numero non è presente nella blacklist.' }, { quoted: m });
        }

        global.db.data.blacklist = global.db.data.blacklist.filter(num => num !== target);
        let displayNum = target.split('@')[0];
        return conn.sendMessage(m.chat, { text: `✅ Numero *${displayNum}* rimosso dalla blacklist.` }, { quoted: m });
    }
};

// --- CONTROLLO AUTOMATICO INGRESSI ---
handler.participantsUpdate = async (update, { conn }) => {
    const { id, participants, action } = update;
    if (action === 'add') {
        global.db.data.blacklist = global.db.data.blacklist || [];
        for (let participant of participants) {
            if (global.db.data.blacklist.includes(participant)) {
                try {
                    await conn.groupParticipantsUpdate(id, [participant], 'remove');
                    await conn.sendMessage(id, { text: `🚨 *Sicurezza Axion:* Un utente presente nella blacklist globale ha provato ad accedere ed è stato espulso.` });
                } catch (error) {
                    console.error(`Impossibile kikkare l'utente dal gruppo ${id}:`, error);
                }
            }
        }
    }
};

handler.command = ['block', 'unblock'];
handler.tags = ['owner'];
handler.help = ['block', 'unblock'];

export default handler;
