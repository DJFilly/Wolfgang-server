const {
    Client,
    Attachment
} = require('discord.js');
const bot = new Client();

const ytdl = require("ytdL-core");

const token = 'NjQ2ODMwNzEwMjUwMDEyNzIz.Xksp-w.vJTu7JZ8QncyxincmM2s6uL8L9U';

const PREFIX = '!';



var version = '1.0';

var servers = {};

bot.on('ready', () => {
    console.log('This bot is online! ' + version);
})


bot.on('message', message => {

    args = message.content.substring(PREFIX.length).split(" ");

    switch (args[0]){
        case 'play':

            function play(connection, message){
                var server = servers[message.guild.id];
                
                server.dispatcher = connection.playStream(ytdl(server.queue[0], {filter: "audioonly"}));

                server.queue.shift();

                server.dispatcher.on("end", function(){
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }

                })
            }

            if(!args[1]){
                message.channel.send(" Please put a link after the command.");
                return;
            }

            if(!message.member.voiceChannel){
                message.channel.send(" Please connect to a voice channel!");
                return;
            }

            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }

            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection){
                play(connection, message);
            })
            
        
        break;

        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send('You have skipped the song.')
        break;

        case 'stop': 
            var server = servers[message.guild.id];
            if(message.guild.voiceConnection) {
                for(var i = server.queue.length -1; i >= 0; i--){
                    server.queue.splice(i, 1);
                }

                server.dispatcher.end();
                message.channel.send('Leaving the queue; Ending voice connection.')
                console.log('stopped the queue!')
            }
            if(message.guild.connection) message.guild.voiceConnection.disconnect();

        break;
    }
});

bot.login(process.env.token);
