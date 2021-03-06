function hasChangeOnChat()
{
    if(document.querySelector('#webWidget'))
    {
        var chat_list = 
        document.querySelector('#webWidget').contentWindow.document.querySelectorAll('div[role="log"][aria-live="polite"] div[class^="container-"] div span.Linkify');

        if(chat_list.length > 0)
        {
            var old_length          = window.total_chat_div ? window.total_chat_div : 0;
            var new_length          = chat_list.length;
            window.total_chat_div   = new_length;

            return old_length != 0 && new_length > old_length;
        }
    }

    return false;
}

function toggleMute(set_state = null)
{
    var mute_state = false;

    if(window.mute_notification)
    {
        var mute_state = true;
    }

    if(set_state == true || set_state == false)
        window.mute_notification = set_state;
    else
        window.mute_notification = mute_state ? false : true;

    console.log('mudo ' + (window.mute_notification ? 'sim' : 'nao'));
}

function zdCloseNotification()
{
    var mute_notification = window.mute_notification ? window.mute_notification : false;
    var audio_el = document.querySelectorAll('audio#zd_close_notification');

    if(audio_el.length > 0)
    {
        
        if(mute_notification != true)
        audio_el[0].play();
    }else{
        var x = document.createElement("AUDIO");

    if (x.canPlayType("audio/mpeg")) {
        x.setAttribute("src","https://raw.githubusercontent.com/tiagofrancafernandes/zendesk_autoclose_by_inactivity/master/media/notifications/mp3.mp3");
    } else {
        x.setAttribute("src","https://raw.githubusercontent.com/tiagofrancafernandes/zendesk_autoclose_by_inactivity/master/media/notifications/ogg.ogg");
    }
        //x.setAttribute("controls", "controls");
        x.setAttribute("id", "zd_close_notification");
        x.style.display= 'none';
        document.body.appendChild(x);
        
        if(mute_notification != true)
        x.play();
    }  
}

function lastToSendMessage(expected)
{
    if(document.querySelector('#webWidget'))
    {
        var chat_list = 
        document.querySelector('#webWidget').contentWindow.document.querySelectorAll('div[role="log"][aria-live="polite"] div[class^="container-"]');

        if(chat_list.length > 0)
        {
            var last_message_index = chat_list.length -1;
            var last_message       = chat_list[last_message_index];
            var html_content       = last_message.innerHTML;

            return html_content.indexOf(expected) !== -1;
        }
    }

    return null;
}

function startClose(alert_msg = null, send_message_to_agent = null)
{
    var the_agent_was_the_last = lastToSendMessage('messageAgent-');//Se o agente foi o ultimo a escrever

    if(the_agent_was_the_last)
    {
        if(window.ZDAC_DEBUG){ console.log('foi o agente a escrever por ultimo. Encerrando...'); }
        
        alert_msg = alert_msg != null ? alert_msg : "Chat encerrado por inatividade. \nFique à vontade para nos contactar sempre que precisar.\n :\)";
        var widget = document.querySelectorAll('iframe#webWidget');

        if(widget.length > 0)
        {
            var menu_btn    = document.querySelectorAll('iframe#webWidget')[0].contentWindow.document.querySelectorAll('button[aria-label="Encerrar chat"]');

            if(menu_btn.length > 0)
            {
                if(menu_btn[0].disabled)
                {
                    return;
                }else{
                    if(window.$zopim && window.$zopim.livechat)
                    {
                        window.$zopim.livechat.addTags('encerrado_por_inatividade');

                        if(send_message_to_agent)
                            window.$zopim.livechat.say(send_message_to_agent);
                        else
                            window.$zopim.livechat.say('encerrado via cliente');

                        setTimeout(function () {
                            window.$zopim.livechat.endChat();
                        }, 3000);

                        setTimeout(function () {
                            alert(alert_msg);
                        }, 4000);
                    }
                }
            }
        }
    }
}

(function () {
    window.ZDAC_DEBUG = false;
    var minutes = true; // true = minutos; false = segundos
    var interval = minutes ? 60000 : 1000;
    var IDLE_TIMEOUT = 10; // segundos se minutos=false
    var idleCounter = 0;
    var HALF_IDLE_TIMEOUT = IDLE_TIMEOUT / 2;
    HALF_IDLE_TIMEOUT = HALF_IDLE_TIMEOUT.toFixed();    

    console.log('O chat se encerrará após ' + IDLE_TIMEOUT + (minutes ? ' minutos ' : ' segundos ') + 'de inatividade.');
    console.log('window.ZDAC_DEBUG: ' + window.ZDAC_DEBUG);

    window.onmousemove = window.onkeypress = function () {
        idleCounter = 0;
    };

    window.setInterval(function () {
        if (idleCounter == HALF_IDLE_TIMEOUT)
        {
            var the_agent_was_the_last = lastToSendMessage('messageAgent-');//Se o agente foi o ultimo a escrever

            if(the_agent_was_the_last)
            {
                if(window.ZDAC_DEBUG){ console.log('metade do tempo e o agente foi o ultimo'); }

                toggleMute(false);
                // zdCloseNotification();//Alerta sonoro na metade do tempo de inatividade na página
            }
            else{
                if(window.ZDAC_DEBUG){ console.log('metade do tempo mas o agente NÃO foi o ultimo a escrever'); }
            }
        }
    },1000);

    window.setInterval(function () {
        if(hasChangeOnChat())
        {
            if(window.ZDAC_DEBUG){ console.log('mudança no chat. Zerando o contador'); }
            idleCounter = 0;
        }
    }, 1000);

    window.setInterval(function () {
        window.onmousemove = document.onmousemove = window.onkeypress = document.onkeypress = function () {
            idleCounter = 0;
        };

        if (++idleCounter >= IDLE_TIMEOUT)
        {
            var message_to_agent =  '--ENCERRADO_POR_INATIVIDADE--\n------------------------------\nEncerrado após ' 
                                    + IDLE_TIMEOUT + (minutes ? ' minutos ' : ' segundos ') + ' de inatividade\n------------------------------';

            startClose(null, message_to_agent);
            idleCounter = 0;
        }else{
            //
        }

    }, interval);

}());

function downloadExtension()
{
  window.open('https://github.com/tiagofrancafernandes/zendesk_autoclose_by_inactivity/releases');
}

document.addEventListener('DOMContentLoaded', function() {
    hasChangeOnChat();
    toggleMute(true);
    // zdCloseNotification();//Inicia a criação do elemento sonoro
    toggleMute(false);
});