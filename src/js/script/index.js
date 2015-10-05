(function () {
    // 'use strict';

    var url = location.protocol + '//' + location.host + location.pathname;

    var tweetUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&text={src}' + '%20' + encodeURIComponent(url)
            + '%20' + encodeURIComponent('#てゆうかもう寝よう')
            + '%20' + encodeURIComponent('#すたンプ');
    var tweetTAUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&text=' + encodeURIComponent('_taGoalCount_ 匹のすたちゅーを _taTime_ 秒でとばしました。')
            + encodeURIComponent('平均 _taAvgCps_ すた/秒。最高 _taMaxCps_ すた/秒。')
            + '%20' + encodeURIComponent(url) + '%3fta=_taGoalCount_'
            + '%20' + encodeURIComponent('#てゆうかもう寝よう')
            + '%20' + encodeURIComponent('#すたとばしTA');
    var tweetOnlineUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&text=' + encodeURIComponent('_onlineClickCount_ 匹のすたちゅーがとばされました。')
            + '%20' + encodeURIComponent(url)
            + '%20' + encodeURIComponent('#てゆうかもう寝よう')
            + '%20' + encodeURIComponent('#すたとばしおんらいん');

    var tweetListUrl = 'https://twitter.com/search?q=' + encodeURIComponent(url);

    // ならべかえ保存タイミング制御用
    var updateTimer;
    var updateInterval = 2000;

    // アニメーション表示倍率
    var defaultScale = 0.5;
    var onlineScale  = 0.35;

    // アニメーション回数
    var launchCount     = 0;
    var prevLaunchCount = 0;

    // TA用
    var taTimer;
    var taStartTime = 0;
    var taScore     = 0;
    var taMaxCps    = 0;
    var taGoalCount = 0;

    // オンラインモード用
    var socket;
    var isOnlineMode                 = false;
    var onlineTimer;
    var onlineSendClickCountInterval = 1000;
    var onlineClickCount             = 0;
    var onlineClickCountFromSend     = 0;
    var onlineLocalClickCount        = 0;
    var onlineDiffMax                = 100;

    var bodyElement = $('body');
    var launchCounterElement = $('#launchCounter');

    var stamps  = _stampList; // from script tag
    var bullets = _animeList; // from script tag

    init();

    window.addEventListener('resize', function () {
        'use strict';
        // console.log('window resize');

        refreshArrow();
    });

    document.getElementById('title').addEventListener('click', function () {
        'use strict';
        // console.log('#title click');

        var bullet = getRandomBullet();
        launch(bullet);
    });

    document.getElementById('sync').addEventListener('click', function () {
        'use strict';
        // console.log('#sync click');

        var message = '複数のブラウザで使用する方向け\n\nすたんぷのならび順を同期させるためのURLを発行します。';
        var confirm = window.confirm(message);
        if (confirm) beginSync();
    });

    document.getElementById('sort').addEventListener('click', function () {
        'use strict';
        // console.log('#sort click');

        var items = $('#items');
        var modelabel = $('#sortlabel');

        var isDisabled = items.sortable('instance') == null;
        if (isDisabled) {
            items.sortable({
                cursor: 'move',
                delay: 300,
                items: 'div.sortable',
                tolerance: 'pointer',
                start: function (event, ui) {
                    // console.log('start');
                    ui.item.addClass('sorting');
                },
                stop: function (event, ui) {
                    // console.log('stop');
                    ui.item.removeClass('sorting');
                    saveStampOrder();
                },
            });

            modelabel.addClass('on');
            modelabel.removeClass('off');
            modelabel.text('ON');
        } else {
            // disableではスワイプによるスクロールができなかったのでdestroyしている。
            items.sortable('destroy');
            modelabel.addClass('off');
            modelabel.removeClass('on');
            modelabel.text('OFF');
        }
    });

    document.getElementById('online').addEventListener('click', function () {
        'use strict';
        // console.log('#online click');

        toggleOnlineMode();
    });

    document.getElementById('taReset').addEventListener('click', function () {
        'use strict';
        // console.log('#taReset click');

        initTAMode(taGoalCount);
    });

    function init() {
        // 'use strict';
        // console.log('init');

        var stamp = getRandomStamp();
        setItem(stamp);

        var sortButton = $('#sort');

        if (0 < _id.length) document.getElementById('sync').style.display = 'none';

        var stampOrder = loadStampOrder();

        for (var i = 0; i < stamps.length; i++) {
            var index = 0;
            if (i < stampOrder.length) {
                index = stampOrder[i];
            } else {
                index = i;
            }
            var div = $('<div>');
            div.attr('index', index);
            div.addClass('sortable sprite sprite-' + stamps[index].id);
            div.on('click', function () {
                // console.log('#items div click');

                var index = $(this).attr('index');
                var item = stamps[index];
                setItem(item);

                // エイプリルフール
                var today = new Date();
                if (today.getMonth() === 3 && today.getDate() === 1) {
                    var bullet = getRandomBullet();
                    startAnimation(bullet, defaultScale);
                }
            });

            div.insertBefore(sortButton);
        }

        getTweetCount();

        document.getElementById('count').setAttribute('href', tweetListUrl);
        refreshArrow();

        // 開きっぱなし対策
        setTimeout(function () { location.reload(); }, 24 * 3600 * 1000);

        var q = {};
        location.search.substr(1).split('&').forEach(function (p) {
            var param = p.split('=');
            q[param[0]] = param.length === 2 ? param[1] : '';
        });
        if (!isNaN(q['ta']) && 0 < q['ta'] - 0) {
            initTAMode(q['ta'] - 0);
            // TAモードとオンラインモードは排他
            document.getElementById('online').style.display = 'none';
        }

        // きゃすけっと開始まで表示しない 2015/10/10 0:00
        var onlineOpen = new Date(2015, 9, 10);
        var today = new Date();
        if (today < onlineOpen) {
            document.getElementById('online').style.display = 'none';
        }
    }

    function getRandomStamp () {
        'use strict';
        // console.log('getRandomStamp');

        var index = Math.floor(Math.random() * stamps.length);
        return stamps[index];
    }

    function getRandomBullet () {
        'use strict';
        // console.log('getRandomBullet');

        var index = Math.floor(Math.random() * bullets.length);
        return bullets[index];
    }

    function setItem (item) {
        'use strict';
        // console.log('setItem');

        var selected = $('#selected');
        selected.css('background-image', 'url("/images/stamp/' + item.id + '.png")');
        if (item.isCover) {
            selected.addClass('size-cover');
            selected.removeClass('contain');
        } else {
            selected.addClass('contain');
            selected.removeClass('size-cover');
        }
        selected.attr('src', item.src);
        setTweetUrl();
    }

    function refreshArrow () {
        'use strict';
        // console.log('refreshArrow');

        var width = document.body.clientWidth;

        var tweetobj = $('#tweet');
        if (width < 440) {
            tweetobj.removeClass('arrowtweetleft');
            tweetobj.addClass('arrowtweettop');
        } else {
            tweetobj.removeClass('arrowtweettop');
            tweetobj.addClass('arrowtweetleft');
        }

        var countobj = $('#count');
        if (width < 220 ||
            (440 <= width && width < 550)) {
            countobj.removeClass('arrowcountleft');
            countobj.addClass('arrowcounttop');
        } else {
            countobj.removeClass('arrowcounttop');
            countobj.addClass('arrowcountleft');
        }
    }

    function loadStampOrder () {
        'use strict';
        // console.log('loadStampOrder');

        return 0 < _stampOrder.length ? _stampOrder : getStampOrder();
    }

    function saveStampOrder () {
        'use strict';
        // console.log('saveStampOrder');

        var stampOrder = $('#items')
                .sortable('toArray', { attribute: 'index' })
                .map(function (x) { return +x; });

        localStorage.setItem('stampOrder', JSON.stringify(stampOrder));

        if (0 < _id.length) {
            clearTimeout(updateTimer);
            updateTimer = setTimeout(function () {
                updateOrder(stampOrder);
            }, updateInterval);
        }
    };

    function getStampOrder () {
        'use strict';
        // console.log('getStampOrder');

        var stampOrder = localStorage.getItem('stampOrder') ?
                JSON.parse(localStorage.getItem('stampOrder')) :
                [];
        return stamps.length < stampOrder.length ? [] : stampOrder;
    }

    function beginSync () {
        'use strict';
        // console.log('beginSync');

        var order = getStampOrder();

        $.ajax({
            type: 'POST',
            url: '/beginsync',
            contentType: 'application/json',
            data: JSON.stringify({ stampOrder: order }),
            dataType: 'json',
            cache: false,
            async: false,
            success: function (json) {
                alert('同期用のURLに移動します。\n\n移動先のURLを使用するとブラウザ間でならび順が同期されます。');
                location.href = url + '?id=' + json.id;
            },
            error: function () {
                alert('エラー');
            }
        });
    }

    function updateOrder (stampOrder) {
        'use strict';
        // console.log('updateOrder');

        $.ajax({
            type: 'POST',
            url: '/updateorder',
            contentType: 'application/json',
            data: JSON.stringify({ id: _id, stampOrder: stampOrder }),
            dataType: 'json',
            cache: false,
            success: function () {
                $('#updated').fadeIn(500, function () {
                    setTimeout(function () {
                        $('#updated').fadeOut(500);
                    }, 1000);
                });
            },
            error: function () {
                alert('エラー');
            }
        });
    }

    function getTweetCount () {
        'use strict';
        // console.log('getTweetCount');

        var count = document.getElementById('count');
        if (!count.childNodes[0]) count.appendChild(document.createTextNode(''));

        count.childNodes[0].nodeValue = '取得中';

        $.ajax({
            type: 'GET',
            url: 'http://urls.api.twitter.com/1/urls/count.json?url=' + url,
            dataType: 'jsonp',
            jsonpCallback: 'callback',
            cache: false,
            success: function (json) {
                count.childNodes[0].nodeValue = json.count;
            },
            error: function () {
                count.childNodes[0].nodeValue = '検索';
            }
        });
    }

    function setTweetUrl () {
        'use strict';
        // console.log('setTweetUrl');

        var tweet;
        if (0 < taGoalCount && launchCount === taGoalCount) {
            tweet = tweetTAUrl
                    .replace(/_taGoalCount_/g, taGoalCount)
                    .replace('_taTime_', taScore)
                    .replace('_taAvgCps_', (taGoalCount / taScore).toFixed(3))
                    .replace('_taMaxCps_', taMaxCps);
            document.getElementById('tweet').setAttribute('href', tweet);
        } else if (isOnlineMode) {
            tweet = tweetOnlineUrl.replace('_onlineClickCount_', onlineClickCount);
            document.getElementById('tweet').setAttribute('href', tweet);
        } else {
            var src = $('#selected').attr('src');
            tweet = tweetUrl.replace('{src}', encodeURIComponent(src));
            document.getElementById('tweet').setAttribute('href', tweet);
        }
    }

    function launch (bullet) {
        'use strict';
        // console.log('launch');

        // TA開始処理
        if (taTimer == null && 0 < taGoalCount) {
            taStartTime = new Date().getTime();
            taTimer = setInterval(function () {
                displayTAInfo();
            }, 1000);
        }

        startAnimation(bullet, defaultScale);

        launchCount += 1;
        launchCounterElement.text(launchCount);

        // オンラインモード処理
        if (isOnlineMode) {
            // 送信用タイマー設定
            if (onlineClickCountFromSend === 0) {
                setTimeout(function () {
                    socket.emit('send_click_data_to_server', onlineClickCountFromSend);
                    onlineClickCountFromSend = 0;
                }, onlineSendClickCountInterval);
            }

            onlineClickCount += 1;
            onlineClickCountFromSend += 1;

            onlineLocalClickCount += 1;
            localStorage.setItem('onlineLocalClickCount', onlineLocalClickCount - 0);

            displayOnlineClickCount();

            setTweetUrl();
        }

        // TA処理
        if (0 < taGoalCount) {
            if (launchCount < taGoalCount) {
                // TA中
                $('#taCount').text(launchCount + ' / ' + taGoalCount + ' すた');
            } else if (launchCount === taGoalCount) {
                // TA終了処理
                clearInterval(taTimer);
                displayTAInfo(true);
                setTweetUrl();
            } else {
                // TA終了後
            }
        }
    }

    function startAnimation (bullet, scale) {
        'use strict';
        // console.log('startAnimation');

        var img = new Image();
        img.onload = function () {
            var width = this.width * scale;
            var height = this.height * scale;
            var left = document.documentElement.clientWidth;
            var top = Math.floor(Math.random() * document.documentElement.clientHeight - height / 2);

            this.setAttribute('width', width);
            this.setAttribute('height', height);
            this.style.left = left + 'px';
            this.style.top = top + 'px';
            this.className = 'bullet';

            bodyElement.append(this);

            var speed = Math.floor(Math.random() * 2500) + 500;
            $(this).animate({
                left: -1 * width,
            }, speed, 'linear', function () { $(this).remove(); });
        };
        img.src = bullet.image;
    }

    function initTAMode (goalCount) {
        'use strict';
        // console.log('initTAMode');

        taGoalCount = goalCount;

        $('#sort').css('display', 'none');
        $('#sync').css('display', 'none');
        $('#launchCounter').css('display', 'none');

        $('#taInfo').css('display', 'block');

        clearInterval(taTimer);
        taTimer = null;

        launchCount = 0;
        prevLaunchCount = 0;
        taStartTime = 0;
        taScore = 0;
        taMaxCps = 0;

        displayTAInfo();

        var stamp = getRandomStamp();
        setItem(stamp);
    }

    function displayTAInfo (isEnd) {
        'use strict';
        // console.log('displayTAInfo');

        var cps = launchCount - prevLaunchCount;
        if (taMaxCps < cps) taMaxCps = cps;

        prevLaunchCount = launchCount;

        var time;
        if (taStartTime === 0) {
            time = 0;
        } else if (isEnd) {
            taScore = (new Date().getTime() - taStartTime) / 1000;
            time = taScore;
        } else {
            time = Math.floor((new Date().getTime() - taStartTime) / 1000);
        }

        $('#taCount').text(launchCount + ' / ' + taGoalCount + ' すた');
        $('#taTime').text(time + ' 秒');
        $('#taCps').text(cps + ' すた/秒');
        var avgCps = time === 0 ? 0 : (launchCount / time).toFixed(3);
        $('#taAvgCps').text('平均 ' + avgCps + ' すた/秒');
        $('#taMaxCps').text('最高 ' + taMaxCps + ' すた/秒');
    }

    function toggleOnlineMode () {
        'use strict';
        // console.log('toggleOnlineMode');

        if (isOnlineMode) {
            socket.disconnect();
            return;
        }

        if (socket != null) {
            socket.socket.connect();
            return;
        }

        var script = document.createElement('script');
        script.onload = initSocket;
        script.setAttribute('type', 'application/javascript');
        script.setAttribute('src', '/socket.io/socket.io.js');
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function initSocket () {
        'use strict';
        // console.log('initSocket');

        socket = io.connect('/', { 'reconnect': false });

        // socket.io のイベントハンドラを登録

        socket.on('connected', function (data) {
            'use strict';
            // console.log('connected');

            onlineClickCount = data.clickCount;

            onlineLocalClickCount = localStorage.getItem('onlineLocalClickCount') ?
                localStorage.getItem('onlineLocalClickCount') - 0 :
                0;

            displayOnlineClickCount();
            displayOnlineUserCount(data.userCount);

            isOnlineMode = true;

            var modelabel = $('#onlinelabel');
            modelabel.addClass('on');
            modelabel.removeClass('off');
            modelabel.text('ON');

            $('#launchCounter').css('display', 'none');

            $('#onlineInfo').css('display', 'block');

            setTweetUrl();

            if (onlineLocalClickCount === 0) alert('タイトルをクリックしてすたちゅーをとばそう！');
        });

        socket.on('disconnect', function () {
            'use strict';
            // console.log('disconnect');

            isOnlineMode = false;

            var modelabel = $('#onlinelabel');
            modelabel.addClass('off');
            modelabel.removeClass('on');
            modelabel.text('OFF');

            $('#launchCounter').css('display', 'block');

            $('#onlineInfo').css('display', 'none');

            setTweetUrl();
        });

        socket.on('send_click_data_to_client', function (data) {
            'use strict';
            // console.log('send_click_data_to_client');

            // まだ server に送信していないクリック数を考慮
            var newClickCount = data.clickCount + onlineClickCountFromSend;

            // 他のユーザーによるクリック数
            var diff = newClickCount - onlineClickCount;

            if (diff < 0) {
                console.error('diff < 0');
                diff = 0;
            }
            // 負荷対策
            diff = Math.min(onlineDiffMax, diff);

            onlineClickCount = newClickCount;
            displayOnlineClickCount();

            // 他のユーザーが飛ばした分だけすたちゅーを飛ばす
            for (var i = 0; i < diff; i++) {
                var delay = Math.floor(Math.random() * onlineSendClickCountInterval);
                setTimeout(function () {
                    var bullet = getRandomBullet();
                    startAnimation(bullet, onlineScale);
                }, delay);
            }

            setTweetUrl();
        });

        socket.on('send_user_count_to_client', function (data) {
            'use strict';
            // console.log('send_user_count_to_client');

            displayOnlineUserCount(data.userCount);
        });
    }

    function displayOnlineClickCount () {
        'use strict';
        // console.log('displayOnlineClickCount');

        $('#onlineClickCount').text(onlineClickCount + ' すた');
        $('#onlineLocalClickCount').text(onlineLocalClickCount + ' すた');
    }

    function displayOnlineUserCount (userCount) {
        'use strict';
        // console.log('displayOnlineUserCount');

        $('#onlineUserCount').text('すたとばし勢　' + userCount + ' 人');
    }
})();
