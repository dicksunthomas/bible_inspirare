const alexaSDK = require('alexa-sdk');

const appId = 'amzn1.ask.skill.53de3498-7581-4588-83e5-0a54a67237d4';
// const verseList = require('./bibleVerses');
let bibleVerses =  [
    {
        mood: 'sad',
        verseNumber: 'Deuteronomy chapter 31 verse 8',
        verse: 'The Lord himself goes before you and will be with you; he will never leave you nor forsake you. Do not be afraid; do not be discouraged'
    },
    {
        mood: 'sad',
        verseNumber: 'Philippians chapter 4 verse 13',
        verse: 'I can do all things through Christ who strengthens me.'
    },
    {
        mood: 'happy',
        verseNumber: 'Matthew chapter 5 verse 8',
        verse: 'Blessed are the pure in heart, for they shall see God.'
    }
]
const instructions = `Welcome to bible inspirare<break strength="medium" />How are you?`;

    console.log("testing1");

const handlers = {
     /**
   * Triggered when the user says "Alexa, open inspirare.
   */
  'LaunchRequest'() {
      this.emit(':ask', instructions);
  },

   /**
   * Reads the verse.
   * Slots: mood
   */
  'GetRandomVerseByMoodIntent'() {
      const { slots } = this.event.request.intent;
    console.log('test',  this.event.request.intent);
      //prompt for slot data if needed
      if(!slots.mood.value) {
          const slotToElicit = 'Mood';
          const speechOutput = 'How are you?';
          const repromptSpeech = 'Please tell me how are you feeling today';
          return this.emit(':elicitSlot', slotToElicit, speechOutput, repromptSpeech);
      }

      const mood = slots.mood.value.toLowerCase();
      const isSad = mood === 'sad';
      const isHappy = mood === 'happy';
      console.log('mood', mood);
      if(isSad || isHappy) {
        let filteredVerse;
          if(isSad){
            filteredVerse = bibleVerses.filter(verse => verse.mood === 'sad');
          }
          if(isHappy) {
            filteredVerse = bibleVerses.filter(verse => verse.mood === 'happy');;
          }
          let randomNumber = Math.floor(Math.random() * filteredVerse.length);
          console.log('random', randomNumber);
          const outputVerse = filteredVerse[randomNumber];
         this.emit(':tell', `Bible says in ${outputVerse.verseNumber} <break time="800ms" /> ${outputVerse.verse}`)
      }
     this.emit(':tell', 'sorry');
  },

  'Unhandled'() {
    console.error('problem', this.event);
    this.emit(':ask', 'An unhandled problem occurred!');
  },

  'AMAZON.HelpIntent'() {
    const speechOutput = instructions;
    const reprompt = instructions;
    this.emit(':ask', speechOutput, reprompt);
  },

  'AMAZON.CancelIntent'() {
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.StopIntent'() {
    this.emit(':tell', 'Goodbye!');
  }
};

exports.handler = function handler(event, context) {
  const alexa = alexaSDK.handler(event, context);
  alexa.APP_ID = appId;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

