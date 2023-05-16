import { replyMessage } from '../utils/index.js';
import {
  activateHandler,
  commandHandler,
  continueHandler,
  deactivateHandler,
  deployHandler,
  docHandler,
  drawHandler,
  forgetHandler,
  enquireHandler,
  reportHandler,
  retryHandler,
  searchHandler,
  talkHandler,
  versionHandler,
} from './handlers/index.js';
import Context from './context.js';
import {
  ImageMessage, Message, TemplateMessage, TextMessage,
} from './messages/index.js';
import {
  addMark,
  convertText,
  fetchAudio,
  fetchGroup,
  fetchUser,
  generateTranscription,
} from '../utils/index.js';
import { updateHistory, getHistory } from './history/index.js';
import config from '../config/index.js';
import { Bot, Event, Source } from './models/index.js';
import { getPrompt, setPrompt } from './prompt/index.js';


/**
 * @param {Context} context
 * @returns {Promise<Context>}
 */
const handleContext = async (context) => (
//  activateHandler(context)
  // commandHandler(context)
   continueHandler(context)
//  || deactivateHandler(context)
//  || deployHandler(context)
//  || docHandler(context)
//  || drawHandler(context)
  || forgetHandler(context)
//  || enquireHandler(context)
//  || reportHandler(context)
  || retryHandler(context)
//  || searchHandler(context)
//  || versionHandler(context)
  || talkHandler(context)
  || context
);

const handleEvents = async (events = []) => (
  (Promise.all(
    (await Promise.all(
      (await Promise.all(
        events
          .map((event) => new Event(event))
          .filter((event) => event.isMessage || event.isFollow )
          .filter((event) => event.isText || event.isAudio)
          .map((event) => new Context(event))
          .map((context) => context.initialize()),
      ))
        .map((context) => (context.error ? context : handleContext(context))),
    ))
      .filter((context) => context.messages.length > 0)
      .map((context) => replyMessage(context)),
  ))
);
const handlefollow = async (events = []) => {
  for (const event of events) {
    if (event.type === 'follow') {
      const userId=event.source.userId
      const { displayName } = await fetchUser(userId);

      let more='我有一個通關密碼 對方說可愛 我會回漂亮'

      more.replaceAll('　', ' ').replace(config.BOT_NAME, '').trim();
      const prompt = getPrompt(userId);
      prompt.write('assistant');
      prompt.patch(more);
      setPrompt(userId, prompt);
      
      updateHistory(userId, (history) => history.write('工研院', addMark(more)));
      

      const message = [] 
      const temp = {
        type: 'text',
        text: '歡迎加入FAST AI一站式系統的好友~現在就讓我們一起來體驗FAST AI吧!​在開始之前想先了解您的背景，請問您的工作產業類別是?',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '軟體科技業',
                 data: 'industry:軟體科技業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '製造或營造業',
                data: 'industry:製造或營造業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '技術服務業',
                data: 'industry:技術服務業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '醫療生技業',
                data: 'industry:醫療生技業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '教育服務業',
                data: 'industry:教育服務業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '藝術`娛樂休閒業',
                data: 'industry:娛樂休閒業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '運輸物流業',
                data: 'industry:教育服務業'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '金融保險業',
                data: 'industry:金融保險業'
              }
            },{
              type: 'action',
              action: {
                type: 'postback',
                label: '零售批發業',
                data: 'industry:零售批發業'
              }
            }
          ]
        }
      };

      message.push(temp);
      

      const welcome_message={
        replyToken:event.replyToken,
        messages:message
      };

      replyMessage(welcome_message)

    }
  else if(event.type === 'postback'){
    const message = []
    let temp
    if (event.postback.data.split(':')[0]=='industry'){ 
        temp = {
        type: 'text',
        text: '好的! 那您的職務是?​我們即將提供您配對到最適合的方案囉!',
        quickReply: {
          items: [
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '客戶服務',
                data: 'title:客戶服務'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '業務/行銷人員',
                data: 'title:業務/行銷人員'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '財會/行政人員',
                data: 'title:財會/行政人員'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '研發工程師',
                data: 'title:研發工程師'
              }
            },
            {
              type: 'action',
              action: {
                type: 'postback',
                label: '產線/物流工程師',
                data: 'title:產線/物流工程師'
              }
            }
          ]
        }
      };
      message.push(temp);

      

    } if(event.postback.data.split(':')[1]=='客戶服務'|| event.postback.data.split(':')[1]=='業務/行銷人員' || event.postback.data.split(':')[1]=='財會/行政人員' || event.postback.data.split(':')[1]=='產線/物流工程師'){
      temp='客戶服務'
      const conv = new TextMessage({
        type: 'text',
        text: convertText(temp),
      });
      message.push(conv);
    } if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]== '產線/物流工程師'){
      temp='影像標註'
      const conv = new TextMessage({
        type: 'text',
        text: convertText(temp),
      });
      message.push(conv);
    }
     if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]== '產線/物流工程師'){
      temp='資料前處理'
      const conv = new TextMessage({
        type: 'text',
        text: convertText(temp),
      });
      message.push(conv);
    }
     if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]=='產線/物流工程師'){
      temp='通用型標註'
      const conv = new TextMessage({
        type: 'text',
        text: convertText(temp),
      });
      message.push(conv);
    }

    const result={
      replyToken:event.replyToken,
      messages:message
    };
    replyMessage(result)
  }
}
}

export {handleEvents, handlefollow};
