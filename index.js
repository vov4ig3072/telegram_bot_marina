import TelegramBot from "node-telegram-bot-api"
import mongoose from "mongoose"
import dotenv from "dotenv"
import Telegram from './database/schema.js'
import Statistic from './database/statistic.js'
import content from './src/content.json' assert { type: 'json' }
import options from './src/options.js'
dotenv.config()

mongoose.set('strictQuery', true)

const { TOKEN, MONGO_URL, ADMINID} = process.env
const { startOption, infoOption, infoTarifsOptons, academyTarifsOptons, academyOption } = options

const EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i
const TELPHONE_REGEXP = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/
const URL_REGEXP = /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi

const statistic = {
    id: null,
    user: {},
    transition: []
}

const user = {}

async function start(){
    try{

        await mongoose.connect(MONGO_URL) 
            
        const bot = new TelegramBot(TOKEN, { polling: true });

        bot.setMyCommands([
            {command: '/start', description: 'Почати заробляти💰'},
            {command: '/info', description: 'З чого почати?🤔'},
            {command: '/academy', description: 'Freelance Academy UA'},
        ])

        bot.on('message', async msg => {
            const {chat, text} = msg

            statistic.transition.push(text)
            
            if(!Object.keys(statistic.user).length){
                statistic.user = chat
            }

            if(!statistic.id){
                try{
                    const statisticBD = await new Statistic({user: statistic.user, transition: statistic.transition})
                    statisticBD.save()
    
                    statistic.id = statisticBD._id
                }catch (e) {
                    console.log(e);
                }
            }
           
            if(text === '/start'){
                return await bot.sendMessage( chat.id, content.startMessage, startOption )
            }

            if(text === '/info'){
                return await bot.sendMessage(chat.id, content.infoMessage, infoOption)
            }

            if(text === '/academy'){
                return await bot.sendMessage(chat.id, content.academyMessage, academyOption)
            }

            if(EMAIL_REGEXP.test(text) || TELPHONE_REGEXP.test(text) || URL_REGEXP.test(text)){
                user.contact = text

                const telegram = await new Telegram({...user})
                await telegram.save()

                Object.keys(user).forEach(key => delete user[key])

                await bot.sendMessage(chat.id, `Твій контакт: ${text}\nДякую, чекай мого повідомлення 💋`)
                return await bot.sendMessage(ADMINID, `Нове замовлення: ${telegram._id}`)
            }else{
                await bot.sendMessage(chat.id, `Це не те що мені потрібно 🙃`)
            }
        })

        bot.on('callback_query', async msg => {
            const data = msg.data
            const id = msg.message.chat.id

            statistic.transition.push(data)

            try{
                await Statistic.findOneAndUpdate({id: statistic.id}, {transition: statistic.transition})
            }catch (e) {
                console.log(e);
            }

            if(data === "/info"){
                return await bot.sendMessage(id, content.infoMessage, infoOption)
            }

            if(data === "/academy"){
                return await bot.sendMessage(id, content.academyMessage, academyOption)
            }

            if(data === "1"){
                return await bot.sendMessage(id, content.academyFirst ,academyTarifsOptons)
            }
            
            if(data === "2"){
                return await bot.sendMessage(id, content.academySecond, academyTarifsOptons)
            }

            if(data === "3"){
                return await bot.sendMessage(id, content.academyThird, academyTarifsOptons)
            }

            if(data === "4"){
                return await bot.sendMessage(id, content.academyFourth, academyTarifsOptons)
            }

            if(data === "order"){
                user.chat = JSON.stringify(msg.message.chat)
                user.content = msg.message.text.split("\n")[0]
                // await bot.sendMessage(ADMINID, `Відправник: ${JSON.stringify(user.chat)}.\nЗамовлення: ${user.content}`)
                return await bot.sendMessage(id, `Твій запит відправленно✅ Напиши мені в боті як з тобою зв'язатися через email, телефон або сторінка в соцмережах📲😉\nАбо ✍️ тут👇\n https://instagram.com/litvinichevaaa?igshid=YmMyMTA2M2Y=\n`)
            }

            if(data === "content_maker"){
                return await bot.sendMessage(id, content.contentMaker, infoTarifsOptons)
            }

            if(data === "storiesmaker"){
                return await bot.sendMessage(id, content.storiesmaker, infoTarifsOptons)
            }

            if(data === "sales_not_adv"){
                return await bot.sendMessage(id, content.salesNotAdv, infoTarifsOptons)
            }

            if(data === "base_course_visual"){
                return await bot.sendMessage(id, content.baseCourseVisual, infoTarifsOptons)
            }

            if(data === "online_shop"){
                return await bot.sendMessage(id, content.onlineShop, infoTarifsOptons)
            }

            if(data === "mobile_video"){
                return await bot.sendMessage(id, content.mobileVideo, infoTarifsOptons)
            }

            if(data === "stories"){
                return await bot.sendMessage(id, content.stories, infoTarifsOptons)
            }
        })

    }catch (e) {
        console.log(e)
    }
}

start()