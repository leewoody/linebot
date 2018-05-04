require('dotenv').config()

const linebot = require('../index.js');

const express = require('express');
const fs = require('fs');
const path = require('path');
const cp = require('child_process');

// base URL for webhook server
//const baseURL = 'https://21f6b15c.ngrok.io/linewebhook'; //process.env.baseUrl;
const baseURL = 'https://emmasvn.cmes.com.tw/Socialkit/Script'; //process.env.baseUrl;

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// serve static and downloaded files
app.use('/static', express.static('static'));
app.use('/downloaded', express.static('downloaded'));

const bot = linebot({
  channelId: '1576320506',
  channelSecret: '1912205cfc205f878eb011409e5d72df',
  channelAccessToken: 'xKd2a0hzbJesXlnv221X6DKmZz6zr6vovyOgtrafQ/WJ17MfuDCHDM5JpzybkCeIjLnHyVR9t0z4r2C+XJBswyMp7/psCWcoTCZDKVXL0Kugm0Q6JxmuNdPiLfdtOs7ea3PGRxiwkVOQHHIwa97/3QdB04t89/1O/w1cDnyilFU=',
  verify: true // default=true
});

bot.on('message', function (event) {

console.log(event);
const buttonsImageURL = baseURL + '/static/buttons/1040.jpg';
          
  switch (event.message.type) {
    case 'text':
      switch (event.message.text) {
        case 'Me':
          event.source.profile().then(function (profile) {
            return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
          });
          break;
        case 'Member':
        if(event.source.member()){
          event.source.member().then(function (member) {
            return event.reply(JSON.stringify(member));
          });
        }
          break;
        case 'Picture':
          event.reply({
            type: 'image',
            originalContentUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png',
            previewImageUrl: 'https://d.line-scdn.net/stf/line-lp/family/en-US/190X190_line_me.png'
          });
          break;
        case 'Location':
          event.reply({
            type: 'location',
            title: 'LINE Plus Corporation',
            address: '1 Empire tower, Sathorn, Bangkok 10120, Thailand',
            latitude: 13.7202068,
            longitude: 100.5298698
          });
          break;
        case 'Push':
          bot.push('Ub225c98178bd4fef4ad1adf0b624bfba', ['Hey!', 'สวัสดี ' + String.fromCharCode(0xD83D, 0xDE01)]);
          break;
        case 'Push2':
          bot.push('R32777cf452cb419075801d3b77e123ed', 'Push to group');
          break;
        case 'Multicast':
          bot.push(['Ub225c98178bd4fef4ad1adf0b624bfba', 'R32777cf452cb419075801d3b77e123ed'], 'Multicast!');
          break;
        case 'Confirm':
          event.reply({
            type: 'template',
            altText: 'this is a confirm template',
            template: {
              type: 'confirm',
              text: 'Are you sure?',
              actions: [{
                type: 'message',
                label: 'Yes',
                text: 'yes'
              }, {
                type: 'message',
                label: 'No',
                text: 'no'
              }]
            }
          });
          break;
        case 'Multiple':
          return event.reply(['Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5']);
          break;
        case 'Version':
          event.reply('linebot@' + require('../package.json').version);
          break;
        case 'profile':
          if (event.source.userId) {
            return bot.getUserProfile(event.source.userId)
              .then((profile) => event.reply(
                [
                  `Display name: ${profile.displayName}`,
                  `Status message: ${profile.statusMessage}`,
                ]
              ));
          } else {
            return event.reply( 'Bot can\'t use profile API without user ID');
          }  
          break;
        case 'buttons':
          return event.reply(
            {
              type: 'template',
              altText: 'Buttons alt text',
              template: {
                type: 'buttons',
                thumbnailImageUrl: buttonsImageURL,
                title: 'My button sample',
                text: 'Hello, my button',
                actions: [
                  { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                  { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                  { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                  { label: 'Say message', type: 'message', text: 'Rice=米' },
                ],
              },
            }
          );  
          break;
          case 'carousel':
          return event.reply(
            {
              type: 'template',
              altText: 'Carousel alt text',
              template: {
                type: 'carousel',
                columns: [
                  {
                    thumbnailImageUrl: buttonsImageURL,
                    title: 'hoge',
                    text: 'fuga',
                    actions: [
                      { label: 'Go to line.me', type: 'uri', uri: 'https://line.me' },
                      { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                    ],
                  },
                  {
                    thumbnailImageUrl: buttonsImageURL,
                    title: 'hoge',
                    text: 'fuga',
                    actions: [
                      { label: '言 hello2', type: 'postback', data: 'hello こんにちは', text: 'hello こんにちは' },
                      { label: 'Say message', type: 'message', text: 'Rice=米' },
                    ],
                  },
                ],
              },
            }
          );
        case 'image carousel':
          return event.reply(
            {
              type: 'template',
              altText: 'Image carousel alt text',
              template: {
                type: 'image_carousel',
                columns: [
                  {
                    imageUrl: buttonsImageURL,
                    action: { label: 'Go to LINE', type: 'uri', uri: 'https://line.me' },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: { label: 'Say hello1', type: 'postback', data: 'hello こんにちは' },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: { label: 'Say message', type: 'message', text: 'Rice=米' },
                  },
                  {
                    imageUrl: buttonsImageURL,
                    action: {
                      label: 'datetime',
                      type: 'datetimepicker',
                      data: 'DATETIME',
                      mode: 'datetime',
                    },
                  },
                ]
              },
            }
          );
        case 'datetime':
          return event.reply(
            {
              type: 'template',
              altText: 'Datetime pickers alt text',
              template: {
                type: 'buttons',
                text: 'Select date / time !',
                actions: [
                  { type: 'datetimepicker', label: 'date', data: 'DATE', mode: 'date' },
                  { type: 'datetimepicker', label: 'time', data: 'TIME', mode: 'time' },
                  { type: 'datetimepicker', label: 'datetime', data: 'DATETIME', mode: 'datetime' },
                ],
              },
            }
          );
          break;  
        case 'imagemap':
          return event.reply(
            {
              type: 'imagemap',
              baseUrl: baseURL+ '/static/rich',
              altText: 'Imagemap alt text',
              baseSize: { width: 1040, height: 1040 },
              actions: [
                { area: { x: 0, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/manga/en' },
                { area: { x: 520, y: 0, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/music/en' },
                { area: { x: 0, y: 520, width: 520, height: 520 }, type: 'uri', linkUri: 'https://store.line.me/family/play/en' },
                { area: { x: 520, y: 520, width: 520, height: 520 }, type: 'message', text: 'URANAI!' },
              ],
            }
          );
          break;  
        default:
          str = event.message.text;
          substr = 'VANCE';
          substr2 = 'WOODY';

          if(str.toUpperCase().indexOf(substr) > -1) {
            replayStr = 'Replay: '+ event.message.text +' ==> Allen think '+ substr+' is bitch!!! ';
          }else if(str.toUpperCase().indexOf(substr2) > -1) {
            replayStr = 'Replay: '+ event.message.text +' ==> People think '+ substr2+' is rich!!! ';
          }else{
            replayStr = 'Replay:'+ event.message.text;
          }
          
          event.reply(replayStr.toUpperCase()).then(function (data) {
            console.log('Success', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
          break;
      }
      break;
    case 'image':
      event.message.content().then(function (data) {
        const s = data.toString('hex').substring(0, 32);
        return event.reply('Nice picture! ' + s);
      }).catch(function (err) {
        return event.reply(err.toString());
      });
      break;
    case 'video':
      event.reply('Nice video!');
      break;
    case 'audio':
      event.reply('Nice audio!');
      break;
    case 'location':
      event.reply(['That\'s a good location!', 'Lat:' + event.message.latitude, 'Long:' + event.message.longitude]);
      break;
    case 'sticker':
      event.reply({
        type: 'sticker',
        packageId: 1,
        stickerId: 1
      });
      break;
    default:
      event.reply('Unknow message: ' + JSON.stringify(event));
      break;
  }
});

bot.on('follow', function (event) {
  event.reply('follow: ' + event.source.userId);
});

bot.on('unfollow', function (event) {
  event.reply('unfollow: ' + event.source.userId);
});

bot.on('join', function (event) {
  event.reply('join: ' + event.source.groupId);
});

bot.on('leave', function (event) {
  event.reply('leave: ' + event.source.groupId);
});

bot.on('postback', function (event) {
  let data = event.postback.data;
  if (data === 'DATE' || data === 'TIME' || data === 'DATETIME') {
    data += `(${JSON.stringify(event.postback.params)})`;
  }
  return event.reply( 'Got postback: '+ data);
  
  //event.reply('postback: ' + event.postback.data);
});

bot.on('beacon', function (event) {
  event.reply('beacon: ' + event.beacon.hwid);
});

// 用 Function 接，參數第一個為 Request ，第二個為 Response
// 第三個為 Callback function
app.get('/linewebhook', function (req, res, next) {
  res.send('Hello World!')
});

bot.listen('/linewebhook', process.env.PORT || 8080, function () {
  console.log('LineBot is running.');
});
