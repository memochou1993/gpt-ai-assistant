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
import { updateHistory, getHistory,removeHistory } from './history/index.js';
import config from '../config/index.js';
import { Bot, Event, Source } from './models/index.js';
import { getPrompt, setPrompt, removePrompt } from './prompt/index.js';


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

const cases={
  '客戶流失率預測':{
    "text": "客戶流失率預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:客戶流失率預測"
      }
    ]
  },
  '備料預測':{
    "text": "備料預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:備料預測"
      }
    ]
  },
  '銷量預測':{
    "text": "銷量預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:銷量預測"
      }
    ]
  },
  '交貨量預測':{
    "text": "交貨量預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:交貨量預測"
      }
    ]
  },
  '商品喜好度推薦系統':{
    "text": "商品喜好度推薦系統",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:商品喜好度推薦系統"
      }
    ]
  },
  '訂定售價':{
    "text": "訂定售價",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:訂定售價"
      }
    ]
  },
  '離職率預測':{
    "text": "離職率預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:離職率預測"
      }
    ]
  },
  '交通熱區預測':{
    "text": "交通熱區預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:交通熱區預測"
      }
    ]
  },
  '人潮預測':{
    "text": "人潮預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:人潮預測"
      }
    ]
  },
  '建築物料耗損預測':{
    "text": "建築物料耗損預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:建築物料耗損預測"
      }
    ]
  },
  '疾病風險預測':{
    "text": "疾病風險預測",
    "actions": [
      {
        "type": "postback",
        "label": "進一步了解",
        "data": "info:疾病風險預測"
      }
    ]
  },
    '病變影像判讀':{
      "text": "病變影像判讀",
      "actions": [
        {
          "type": "postback",
          "label": "進一步了解",
          "data": "info:病變影像判讀"
        }
      ]
    },
    '材料辨識':{
      "text": "材料辨識",
      "actions": [
        {
          "type": "postback",
          "label": "進一步了解",
          "data": "info:材料辨識"
        }
      ]
    },
    '瑕疵分類':{
      "text": "瑕疵分類",
      "actions": [
        {
          "type": "postback",
          "label": "進一步了解",
          "data": "info:瑕疵分類"
        }
      ]
    },
  }


const handleEvents = async (events = []) => (
  (Promise.all(
    (await Promise.all(
      (await Promise.all(
        events
          .map((event) => new Event(event))
          .filter((event) => event.isMessage )
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
                data: 'industry:軟體科技業',
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

    }else if(event.type === 'unfollow'){
      removePrompt(event.source.userId);
      removeHistory(event.source.userId);
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
      const resp = new TextMessage({
        text:'您選擇了: '+event.postback.data.split(':')[1],
        type: 'text',
      });
      message.push(resp);
      message.push(temp);

    }
    let content=[]
     if(event.postback.data.split(':')[1]=='客戶服務'|| event.postback.data.split(':')[1]=='業務/行銷人員' || event.postback.data.split(':')[1]=='財會/行政人員' || event.postback.data.split(':')[1]=='產線/物流工程師'){

      content = content.concat(cases['客戶流失率預測'],cases['備料預測'],cases['銷量預測'],cases['交貨量預測'],cases['商品喜好度推薦系統'],cases['訂定售價'],cases['離職率預測']
      ,cases['交通熱區預測'],cases['人潮預測'],cases['建築物料耗損預測'],cases['疾病風險預測'])  

    } if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]== '產線/物流工程師'){
      
      content = content.concat(cases['疾病風險預測'],cases['病變影像判讀'],cases['材料辨識'])
      
    }
     if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]== '產線/物流工程師'){

      content = content.concat(cases['客戶流失率預測'],cases['交貨量預測'],cases['商品喜好度推薦系統'],cases['訂定售價'],cases['人潮預測'],cases['建築物料耗損預測'],cases['疾病風險預測'])
      
    }
     if(event.postback.data.split(':')[1]=='研發工程師'|| event.postback.data.split(':')[1]=='產線/物流工程師'){
      
      content = content.concat(cases['交通熱區預測'],cases['建築物料耗損預測'],cases['疾病風險預測'],cases['病變影像判讀'],cases['材料辨識'],cases['瑕疵分類'])
      
    }
    const n=4
    if (content.length>0 && content.length<=n){
      const conv = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "carousel",
          "columns": content
        }
      }
      message.push(conv);
    }else if(content.length>n){
      let limitcontent=[]
      for(let i=0;i<n-1;i++){
        limitcontent.push(content.pop())
    }
    limitcontent.push({
      "text": " ",
      "actions": [
        {
          "type": "postback",
          "label": "顯示更多",
          "data": "more:"+content.map(item => item.text)
        }
      ]
    })
    const conv = {
      "type": "template",
      "altText": "在不支援顯示樣板的地方顯示的文字",
      "template": {
        "type": "carousel",
        "columns": limitcontent
      }
    }
    message.push(conv);
    }

    if(event.postback.data.split(':')[0]=='more'){
      let content = event.postback.data.split(':')[1].split(",")
      let limitcontent = []
      console.log(content)

      for(let i=0;i<n-1;i++){
        if(content.length>0){
          limitcontent.push(cases[content.pop()])
        }
    }
    if(content.length!=0){
    limitcontent.push({
      "text": " ",
      "actions": [
        {
          "type": "postback",
          "label": "顯示更多",
          "data": "more:"+content
        }
      ]
    })
  }
      const conv = {
        "type": "template",
        "altText": "在不支援顯示樣板的地方顯示的文字",
        "template": {
          "type": "carousel",
          "columns": limitcontent
        }
      }

      message.push(conv);
    }

    
    if(event.postback.data.split(':')[0]=='info'){
      const msg = {
        type: 'template',
        altText: 'Message with button',
        template: {
          type: 'buttons',
          title:event.postback.data.split(':')[1],
          text:'糖尿病患者心血管疾病1年內的風險預測：',
          actions: [
            {
              type: 'uri',
              label: '申請試用',
              uri: 'https://www.itri.org.tw/'
            }
          ]
        }
      };
      message.push(msg);
    }


    if(message.length>0){
      const result={
        replyToken:event.replyToken,
        messages:message
      };
      replyMessage(result)
    }


  }
}
}

export {handleEvents, handlefollow};
