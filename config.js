import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import chalk from 'chalk'
import fs from 'fs'
import * as cheerio from 'cheerio'
import fetch from 'node-fetch'
import axios from 'axios'
import moment from 'moment-timezone'
import NodeCache from 'node-cache'

const pkg =
  JSON.parse(
    fs.readFileSync(
      './package.json',
      'utf-8'
    )
  )

const moduleCache =
  new NodeCache({
    stdTTL: 300
  })

global.owner = [
  ['393501989497', 'ꪶ𝑬𝛮𝜞𝐲ꫂ | ꪶ𝘎͢ꫂ', true],
  ['212693877842', 'Medalis', true],
  ['77787623522', 'Ksav', true],
  ['254790385731', 'Zak', true],
]

global.mods = [
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]

global.prems = [
  'xxxxxxxxxx',
  'xxxxxxxxxx'
]

global.nomebot  = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'
global.nomepack = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'

global.wm       = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'

global.autore   = 'ꪶ𝑬𝛮𝜞𝐲ꫂ | ꪶ𝘎͢ꫂ'
global.dev      = 'ꪶ𝑬𝛮𝜞𝐲ꫂ | ꪶ𝘎͢ꫂ'

global.versione = pkg.version

global.testobot =
  `AXION-CORE-V${pkg.version}`

global.errore =
  '⚠️ *[SYSTEM ERROR]* Usa `.segnala` per inviare il log allo staff.'

global.repobot =
  'https://github.com/zeyno-bot/zeyno-bot'

global.canale =
  'https://whatsapp.com/channel/0029VbBsqvyF1YlXIC2zUh1N'

global.cheerio = cheerio
global.fs      = fs
global.fetch   = fetch
global.axios   = axios
global.moment  = moment

global.APIKeys = {
  spotifyclientid: 'axion',
  spotifysecret: 'axion',
  browserless: 'axion',
  screenshotone: 'axion',
  tmdb: 'axion',
  gemini: 'axion',
  ocrspace: 'axion',
  assemblyai: 'axion',
  google: 'axion',
  googlex: 'axion',
  googleCX: 'axion',
  genius: 'axion',
  unsplash: 'axion',
  removebg: 'FEx4CYmYN1QRQWD1mbZp87jV',
  openrouter: 'axion',
  lastfm: '36f859a1fc4121e7f0e931806507d5f9',
  sightengine_user: '1244671441',
  sightengine_secret: 'uvqy7fWkiqLbrs4YbdDTnn3a3ZvuEhjM',
}

let filePath =
  fileURLToPath(import.meta.url)

let fileUrl =
  pathToFileURL(filePath).href

const reloadConfig = async () => {

  const cached =
    moduleCache.get(fileUrl)

  if (cached)
    return cached

  unwatchFile(filePath)

  console.log(
    chalk.bgCyan.black(' SYSTEM ') +
    chalk.cyan(
      ` File 'config.js' aggiornato con successo.`
    )
  )

  const module =
    await import(
      `${fileUrl}?update=${Date.now()}`
    )

  moduleCache.set(
    fileUrl,
    module,
    { ttl: 300 }
  )

  return module
}

watchFile(
  filePath,
  reloadConfig
)