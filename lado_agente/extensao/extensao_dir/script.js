window.default_zd_close_time = 1;

chrome.storage.sync.get(['zd_close_time'], function(result) {
    console.log('Value zd_close_time is ' + result.zd_close_time);

    if(!result.zd_close_time)
    {
        console.log('zd_close_time nao existe em "chrome.storage.sync", criando');
        chrome.storage.sync.set({zd_close_time: window.default_zd_close_time}, function() {
            //
        });

        localStorage.zd_close_time = window.default_zd_close_time;
    }else{
        localStorage.zd_close_time = result.zd_close_time;
    }
});

function updateStorageData()
{
    if(!localStorage.getItem("zd_close_time"))
    {
        console.log("Não existe localmente 'zd_close_time'. Criando registro...");
        localStorage.zd_close_time = window.default_zd_close_time;
    }else{
        console.log("registro 'zd_close_time': " + localStorage.getItem("zd_close_time"));
    }
}

updateStorageData();

function getZdCloseTime()
{
    updateStorageData();
    return localStorage.getItem("zd_close_time");
}

function fechaChatsEncerrados()
{
    console.log('Executando...');

    var lista_chats = document
    .querySelectorAll('div.title_controls button.chrome.round.button.meshim_dashboard_components_widgets_RoundButton.dark:last-child');

    lista_chats.forEach(function(v, k){
        
      if(document
      .querySelectorAll('div.title_controls button.chrome.round.button.meshim_dashboard_components_widgets_RoundButton.dark:last-child')[k]
      .classList.contains('active') != true)
        {
            document.querySelectorAll('div.title_controls button.chrome.round.button.meshim_dashboard_components_widgets_RoundButton.dark:last-child')[k].click();
        }

    });

    updateStorageData();
}

(function () {

    updateStorageData();

    var minutes = true; // true = minutes; false = seconds
    var interval = minutes ? 60000 : 1000;
    var IDLE_TIMEOUT = getZdCloseTime() ? getZdCloseTime() : window.default_zd_close_time;
    var idleCounter = 0;
    console.log('INICIO IDLE_TIMEOUT: ' + IDLE_TIMEOUT);

    window.onmousemove = window.onkeypress = function () {
        idleCounter = 0;
    };

    window.setInterval(function () {
        updateStorageData();

        window.onmousemove = document.onmousemove = window.onkeypress = document.onkeypress = function () {
            idleCounter = 0;
        };

        if (++idleCounter >= IDLE_TIMEOUT)
        {
            console.log('Iniciando busca por chats encerrados');
            fechaChatsEncerrados();
            idleCounter = 0;
        }else{
            console.log('IDLE_TIMEOUT: ' + IDLE_TIMEOUT, 'idleCounter: ' + idleCounter);
        }
    }, interval);
}());