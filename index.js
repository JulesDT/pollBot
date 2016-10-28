const Bot = require('slackbots');
const fs = require('fs');
const validator = require('validator');

var lastRequest = 0

function translate(number){
    switch(number){
        case 0:
            return "zero";
            break;
        case 1:
            return "one";
            break;
        case 2:
            return "two";
            break;
        case 3:
            return "three";
            break;
        case 4:
            return "four";
            break;
        case 5:
            return "five";
            break;
        case 6:
            return "six";
            break;
        case 7:
            return "seven";
            break;
        case 8:
            return "eight";
            break;
        case 9:
            return "nine";
            break;
        default:
            return "Error";
    }
}

// create a bot
const settings = JSON.parse(fs.readFileSync('settings.json'));

const bot = new Bot(settings);

bot.on('start', function() {
    bot.postMessageToUser('julesd', 'Hello Master!');
});

bot.on('message', function(event){
    if(event.type === 'message'){
        if(event.text.startsWith('!poll')){
            if(Date.now() - lastRequest < 20*1000){
    			return;
    		}
            lastRequest = Date.now()
            var args = event.text.substring(6).split('|');
            console.log(args);
            if(args.length < 2){
                bot.postMessage(event.channel, "Pas assez d'arguments spécifiés dans la commande. Usage : !poll <option1>|<option2>[|<option3> ...]. Max : 10 options");
            }
            else if (args.length > 10) {
                bot.postMessage(event.channel, "Tu es bien gourmand ! Il n'y a pas assez de nombres pour faire le vote !");
            }
            else{
                var content = ""
                for(var i = 0; i < args.length; i++){
                    /*if(!validator.isAscii(args[i])){
                        bot.postMessage(event.channel, "What the fuck are you telling me ?");
                        return;
                    }*/
                    content += ":"+translate((i+1)%10)+": "+args[i].trim()+"\n";
                }
                console.log(content);
                bot.postMessage(event.channel, content);
            }
        }
        else if (event.text.startsWith('!help')) {
            bot.postMessage(event.channel, "Usage : !poll <option1>|<option2>[|<option3> ...]. Max : 10 options");
        }
    }
});
