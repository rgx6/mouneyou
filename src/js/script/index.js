(function () {
    // 'use strict';

    var url = location.protocol + '//' + location.host + location.pathname;

    var tweetUrlBase = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&text=';
    var tweetUrlContent = '{src}' + '%20' + encodeURIComponent(url)
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

    var tweetListUrl = 'https://twitter.com/search?q=' + encodeURIComponent(location.host);

    // ならべかえ保存タイミング制御用
    var updateTimer;
    var updateInterval = 2000;

    // アニメーション表示倍率
    var defaultScale = 0.5;
    var onlineScale  = 0.35;

    // アニメーション回数
    var launchCount     = 0;
    var prevLaunchCount = 0;

    // アニメーション用Canvas
    var canvasWrapper = document.getElementById('animation-canvas-wrapper');
    var canvas = document.getElementById('animation-canvas');
    var context = canvas.getContext('2d');

    // requestAnimationFrame制御用
    var fps = 60;
    var isAnimating = false;

    // アニメーション中のobject
    var animations = [];

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
    var onlineAnimationsLimit        = 100;

    // リプライモード用
    var isReplyMode = false;

    var bodyElement = $('body');
    var launchCounterElement = $('#launchCounter');
    var tweetElement = document.getElementById('tweet');
    var scrollToTopElement = $('#scrollToTop');

    var stamps  = _stampList; // from script tag
    var bullets = _animeList; // from script tag

    init();

    window.addEventListener('resize', function () {
        'use strict';
        // console.log('window resize');

        resizeCanvas();
    });

    window.addEventListener('scroll', function () {
        'use strict';
        // console.log('window scroll');

        if (tweetElement.getBoundingClientRect().bottom < 0) {
            scrollToTopElement.fadeIn(500);
        } else {
            scrollToTopElement.fadeOut(500);
        }
    });

    // pointer-events: none; に対応していないブラウザ対策
    document.getElementById('animation-canvas-wrapper').addEventListener('click', function () {
        'use strict';
        // console.log('animation-canvas-wrapper click');

        this.style.display = 'none';
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

        var message = '複数のブラウザで使用する方向け\n\nすたンプのならび順を同期させるためのURLを発行します。';
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
                },
                stop: function (event, ui) {
                    // console.log('stop');
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

    document.getElementById('reply').addEventListener('click', function () {
        'use strict';
        // console.log('#reply click');

        copyReplyText();
    });

    document.getElementById('search').addEventListener('click', function () {
        'use strict';
        // console.log('#search click');

        searchStamp();
    });

    document.getElementById('scrollToTop').addEventListener('click', function () {
        'use strict';
        // console.log('#scrollToTop click');

        window.scrollTo(0, 0);
    });

    document.getElementById('reply-mode').addEventListener('click', function () {
        'use strict';
        // console.log('#reply-mode click');

        toggleReplyMode();
    });

    function init() {
        // 'use strict';
        // console.log('init');

        var today = new Date();
        var todayYMD = formatDate(today, 'YYYYMMDD');
        var todayMD = formatDate(today, 'MMDD');

        var stamp = getRandomStamp();
        setItem(stamp);

        var sortButton = $('#sort');

        if (0 < _id.length) document.getElementById('sync').style.display = 'none';

        if (JSON.parse(localStorage.getItem('isReplyMode'))) {
            replyModeOn();
        } else {
            replyModeOff();
        }

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
            var searchTag = stamps[index].searchTag || '';
            div.attr('searchTag', searchTag);
            div.text(searchTag);
            div.on('mousedown', function () {
                // console.log('#items div mousedown');

                $('.selected-thumbnail').removeClass('selected-thumbnail');
                $(this).addClass('selected-thumbnail');
            });
            div.on('click', function () {
                // console.log('#items div click');

                var index = $(this).attr('index');
                var item = stamps[index];
                setItem(item);

                if (isReplyMode) {
                    copyReplyText();
                }

                // エイプリルフール
                if (todayMD === '0401') {
                    var bullet = {
                        "image": Math.floor(Math.random() * 2) == 0
                            ? "/images/anime/anime998.png"
                            : "/images/anime/anime999.png",
                        "pattern": 3,
                    };
                    startAnimation(bullet, defaultScale);
                }
            });

            div.insertBefore(sortButton);
        }

        document.getElementById('count').setAttribute('href', tweetListUrl);

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
        if (!isNaN(q['limit'])) {
            onlineAnimationsLimit = q['limit'] - 0;
        }
        if (!isNaN(q['test'])) {
            setInterval(function () {
                console.log(animations.length);
                var num = q['test'] - 0;
                if (0 <= onlineAnimationsLimit) num = Math.min(num, onlineAnimationsLimit - animations.length);
                for (var i = 0; i < num; i++) {
                    var bullet = getRandomBullet();
                    startAnimation(bullet, onlineScale);
                }
            }, 1000);
        }

        if (todayMD === '1224' || todayMD === '1225') {
            bodyElement.addClass('christmas-background');
        } else if (todayMD === '0303') {
            bodyElement.addClass('hinamatsuri-background');
        } else if (todayMD === '0310') {
            // すたちゅー誕生日
        } else if (todayMD === '0401') {
            bodyElement.addClass('aprilfool-background');
        } else if ('20190427' <= todayYMD && todayYMD <= '20190506') {
            bodyElement.addClass('goldenweek-background');
        } else {
            var number = Math.floor(Math.random() * 12);
            bodyElement.addClass('background-' + number);
        }

        resizeCanvas();
    }

    function searchStamp () {
        'use strict';
        // console.log('searchStamp');

        var searchWord = window.prompt('すたンプ検索');
        searchWord = searchWord ? searchWord.replace(/\s/g, '') : '';

        var firstHit = null;

        $('.items div[searchTag]').each(function (item) {
            $(this).removeClass('search-hit-thumbnail');

            if (searchWord == '') return;

            if ($(this).attr('searchTag').includes(searchWord)) {
                $(this).addClass('search-hit-thumbnail');
                if (!firstHit) {
                    firstHit = this;
                }
            }
        });

        if (firstHit) {
            window.scrollTo(0, $(firstHit).offset().top);
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
        selected.attr('src', item.src[0]);
        setTweetUrl();
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
            tweet = tweetUrlBase + tweetUrlContent.replace('{src}', encodeURIComponent(src));
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

    function render () {
        'use strict';
        // console.log('render');

        isAnimating = true;

        context.clearRect(0, 0, canvas.width, canvas.height);

        animations.forEach(function (anime) {
            // console.log(anime);
            context.save();
            context.scale(anime.scale, anime.scale);
            if (anime.pattern == 1) {
                // scaleはサイズにだけ反映させたいので座標への影響をキャンセル
                context.drawImage(anime.img, anime.left / anime.scale, anime.top / anime.scale);
            } else {
                context.drawImage(
                    anime.img,
                    anime.drawOffsetLeft,
                    0,
                    anime.width,
                    anime.height,
                    anime.left / anime.scale,
                    anime.top / anime.scale,
                    anime.width,
                    anime.height);

                anime.frameCount = (anime.frameCount + 1) % anime.frameToChange;
                if (anime.frameCount == 0) {
                    anime.drawOffsetCount = (anime.drawOffsetCount + 1) % anime.pattern;
                    anime.drawOffsetLeft = anime.width * anime.drawOffsetCount;
                }
            }
            context.restore();

            anime.left -= anime.speed;
        });

        for (var i = animations.length - 1; 0 <= i; i--) {
            if (animations[i].left + animations[i].img.width < 0) animations.splice(i, 1);
        }

        if (0 < animations.length) {
            window.requestAnimationFrame(render);
        } else {
            isAnimating = false;
        }
    }

    function startAnimation (bullet, scale) {
        'use strict';
        // console.log('startAnimation');

        var img = new Image();
        img.onload = function () {
            var pattern = bullet.pattern || 1;
            var width = this.width / pattern;
            var timeToDelete = Math.floor(Math.random() * 2500) + 500;
            var frameToDelete = timeToDelete * fps / 1000;
            var speedPerFrame = (canvasWrapper.offsetWidth + width * scale) / frameToDelete;

            var animation = {
                img: this,
                left: canvasWrapper.offsetWidth,
                top: Math.floor(Math.random() * canvasWrapper.offsetHeight - this.height * scale / 2),
                speed: speedPerFrame,
                scale: scale,
                width: width,
                height: this.height,
                pattern: pattern,
                drawOffsetLeft: 0,
                drawOffsetCount: 0,
                frameCount: 0,
                frameToChange: Math.floor(Math.random() * 10 + 1),
            };

            animations.push(animation);

            if (!isAnimating && window.requestAnimationFrame) {
                render();
            }
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

    function resizeCanvas () {
        'use strict';
        // console.log('resizeCanvas');

        canvas.setAttribute('width', canvasWrapper.offsetWidth);
        canvas.setAttribute('height', canvasWrapper.offsetHeight);
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

            if (onlineLocalClickCount === 0) alert('タイトルをクリックしてみんなですたちゅーをとばそう！');
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

            onlineClickCount = newClickCount;
            displayOnlineClickCount();

            // 他のユーザーが飛ばした分だけすたちゅーを飛ばす（負荷対策で上限あり）
            if (0 <= onlineAnimationsLimit) diff = Math.min(diff, onlineAnimationsLimit - animations.length);
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

    function copyReplyText () {
        'use strict';
        // console.log('copyReplyText');

        var src = document.getElementById('selected').getAttribute('src');
        var content =  decodeURIComponent(tweetUrlContent.replace('{src}', src));

        var input = document.getElementById('replytext');
        input.value = content;
        input.style.display = 'block';
        input.select();
        try {
            document.execCommand('copy');
            $('#copied').fadeIn(500, function () {
                setTimeout(function () {
                    $('#copied').fadeOut(500);
                }, 1000);
            });
        } catch (e) {
        }
    }

    function toggleReplyMode () {
        'use strict';
        // console.log('toggleReplyMode');

        if (isReplyMode) {
            replyModeOff();
        } else {
            replyModeOn();
        }
    }

    function replyModeOn () {
        'use strict';
        // console.log('replyModeOn');

        var modelabel = $('#reply-mode-label');
        modelabel.addClass('on');
        modelabel.removeClass('off');
        modelabel.text('ON');
        isReplyMode = true;
        localStorage.setItem('isReplyMode', JSON.stringify(true));
    }

    function replyModeOff () {
        'use strict';
        // console.log('replyModeOff');

        var modelabel = $('#reply-mode-label');
        modelabel.addClass('off');
        modelabel.removeClass('on');
        modelabel.text('OFF');
        isReplyMode = false;
        localStorage.setItem('isReplyMode', JSON.stringify(false));
    }

    function formatDate (date, format) {
        if (!format) format = 'YYYYMMDD';
        format = format.replace(/YYYY/g, date.getFullYear());
        format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
        format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
        return format;
    };
})();
