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

    var tweetListUrl = 'https://twitter.com/search?q=' + encodeURIComponent(url);

    var updateTimer;
    var updateInterval = 2000;

    var scale = 0.5;

    var launchCount = 0;
    var prevLaunchCount = 0;

    // TA用
    var taTimer;
    var taStartTime = 0;
    var taScore = 0;
    var taMaxCps = 0;
    var taGoalCount = 0;

    var bodyElement = $('body');
    var launchCounterElement = $('#launchCounter');

    var stamps = [
        {
            image: '/images/stamp001.png',
            src: 'http://pic.twitter.com/zJf9UxVkCy'
        }, {
            image: '/images/stamp002.png',
            src: 'http://pic.twitter.com/gGWnG2T1N2'
        }, {
            image: '/images/stamp003.png',
            src: 'http://pic.twitter.com/8dnYyZqEoF'
        }, {
            image: '/images/stamp004.png',
            src: 'http://pic.twitter.com/zjx4PUhbmY'
        }, {
            image: '/images/stamp005.png',
            src: 'http://pic.twitter.com/kHnGxG95CI'
        }, {
            image: '/images/stamp006.png',
            src: 'http://pic.twitter.com/SbRtVCDOit'
        }, {
            image: '/images/stamp007.png',
            src: 'http://pic.twitter.com/zIdqC5MtxE'
        }, {
            image: '/images/stamp008.png',
            src: 'http://pic.twitter.com/yYZEcqQCGZ'
        }, {
            image: '/images/stamp009.png',
            src: 'http://pic.twitter.com/dYwZ3axpKW'
        }, {
            image: '/images/stamp010.png',
            src: 'http://pic.twitter.com/Z0yAX0QcHJ',
            isCover: true
        }, {
            image: '/images/stamp011.png',
            src: 'http://pic.twitter.com/M6I6regjKd',
            isCover: true
        }, {
            image: '/images/stamp012.png',
            src: 'http://pic.twitter.com/Iv8gvPUATM'
        }, {
            image: '/images/stamp013.png',
            src: 'http://pic.twitter.com/sQOagjwDRJ'
        }, {
            image: '/images/stamp014.png',
            src: 'http://pic.twitter.com/1iWz6NfP9t'
        }, {
            image: '/images/stamp015.png',
            src: 'http://pic.twitter.com/tyXVCqpQTc'
        }, {
            image: '/images/stamp016.png',
            src: 'http://pic.twitter.com/e1CILuyhgc'
        }, {
            image: '/images/stamp017.png',
            src: 'http://pic.twitter.com/jmUVSC3zXK'
        }, {
            image: '/images/stamp018.png',
            src: 'http://pic.twitter.com/2pd753IzXC'
        }, {
            image: '/images/stamp019.png',
            src: 'http://pic.twitter.com/e1B9k2MXgS'
        }, {
            image: '/images/stamp020.png',
            src: 'http://pic.twitter.com/wGwLC41tdH'
        }, {
            image: '/images/stamp021.png',
            src: 'http://pic.twitter.com/SYkLTqipqL'
        }, {
            image: '/images/stamp022.png',
            src: 'http://pic.twitter.com/wb79W80JeH'
        }, {
            image: '/images/stamp023.png',
            src: 'http://pic.twitter.com/YYwHReTUBS',
            isCover: true
        }, {
            image: '/images/stamp024.png',
            src: 'http://pic.twitter.com/VnmJEufqY2'
        }, {
            image: '/images/stamp025.png',
            src: 'http://pic.twitter.com/6viZHnOBEn'
        }, {
            image: '/images/stamp026.png',
            src: 'http://pic.twitter.com/MMDWi2jWHB'
        }, {
            image: '/images/stamp027.png',
            src: 'http://pic.twitter.com/kDzFQfo6ty'
        }, {
            image: '/images/stamp028.png',
            src: 'http://pic.twitter.com/cuWqlvgib3'
        }, {
            image: '/images/stamp029.png',
            src: 'http://pic.twitter.com/RQdFyGXkcv'
        }, {
            image: '/images/stamp030.png',
            src: 'http://pic.twitter.com/4xZ45MTCNv'
        }, {
            image: '/images/stamp031.png',
            src: 'http://pic.twitter.com/M1zjqfk8pH'
        }, {
            image: '/images/stamp032.png',
            src: 'http://pic.twitter.com/agDkVgLd3n'
        }, {
            image: '/images/stamp033.png',
            src: 'http://pic.twitter.com/3wfkhxsCH1',
            isCover: true
        }, {
            image: '/images/stamp034.png',
            src: 'http://pic.twitter.com/29RqnztSk9'
        }, {
            image: '/images/stamp035.png',
            src: 'http://pic.twitter.com/XiMVmrDUWp'
        }, {
            image: '/images/stamp036.png',
            src: 'http://pic.twitter.com/hXcB5g6Ygq'
        }, {
            image: '/images/stamp037.png',
            src: 'http://pic.twitter.com/XWopb3cOts'
        }, {
            image: '/images/stamp038.png',
            src: 'http://pic.twitter.com/E9kjtoqJRR'
        }, {
            image: '/images/stamp039.png',
            src: 'http://pic.twitter.com/CQkpQ8Altc'
        }, {
            image: '/images/stamp040.png',
            src: 'http://pic.twitter.com/sA362F6rix'
        }, {
            image: '/images/stamp041.png',
            src: 'http://pic.twitter.com/Gg4ehjqB97'
        }, {
            image: '/images/stamp042.png',
            src: 'http://pic.twitter.com/i0LrCSSpzB'
        }, {
            image: '/images/stamp043.png',
            src: 'http://pic.twitter.com/YaskkVfYyo'
        }, {
            image: '/images/stamp044.png',
            src: 'http://pic.twitter.com/Hg3WV1gKNj'
        }, {
            image: '/images/stamp045.png',
            src: 'http://pic.twitter.com/e2idANGP7m'
        }, {
            image: '/images/stamp046.png',
            src: 'http://pic.twitter.com/8ai4ePmRbt'
        }, {
            image: '/images/stamp047.png',
            src: 'http://pic.twitter.com/b8eOJc3rdn'
        }, {
            image: '/images/stamp048.png',
            src: 'http://pic.twitter.com/VHKZpeN8eU'
        }, {
            image: '/images/stamp049.png',
            src: 'http://pic.twitter.com/42hJHOGPHm'
        }, {
            image: '/images/stamp050.png',
            src: 'http://pic.twitter.com/arr2ECWUtM'
        }, {
            image: '/images/stamp051.png',
            src: 'http://pic.twitter.com/LUKtLqZeve'
        }, {
            image: '/images/stamp052.png',
            src: 'http://pic.twitter.com/v7l5tGeSdq'
        }, {
            image: '/images/stamp053.png',
            src: 'http://pic.twitter.com/uWYAxKQpmF'
        }, {
            image: '/images/stamp054.png',
            src: 'http://pic.twitter.com/a1O9gQjnx6'
        }
    ];

    var bullets = [
        { image: '/images/anime005.png' },
        { image: '/images/anime007.png' },
        { image: '/images/anime012.png' },
        { image: '/images/anime016.png' },
        { image: '/images/anime027.gif' },
        { image: '/images/anime029.gif' },
        { image: '/images/anime036.png' },
        { image: '/images/anime037.png' },
        { image: '/images/anime043.png' },
        { image: '/images/anime044.png' },
        { image: '/images/anime048.png' },
        { image: '/images/anime051.png' }
    ];

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
        var modelabel = $('#modelabel');

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
            div.css('background-image', 'url("' + stamps[index].image + '")');
            div.addClass('sortable');
            if (stamps[index].isCover) div.addClass('size-cover');
            div.on('click', function () {
                // console.log('#items div click');

                var index = $(this).attr('index');
                var item = stamps[index];
                setItem(item);

                // エイプリルフール
                var today = new Date();
                if (today.getMonth() === 3 && today.getDate() === 1) {
                    var bullet = getRandomBullet();
                    launch(bullet);
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
        if (!isNaN(q['ta']) && 0 < q['ta'] - 0) initTAMode(q['ta'] - 0);
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
        selected.css('background-image', 'url("' + item.image + '")');
        if (item.isCover) {
            selected.addClass('size-cover');
        } else {
            selected.removeClass('size-cover');
        }
        document.getElementById('tweet')
            .setAttribute('href', tweetUrl.replace('{src}', encodeURIComponent(item.src)));
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

        $.ajax({
            type: 'GET',
            url: 'http://urls.api.twitter.com/1/urls/count.json?url=' + url,
            dataType: 'jsonp',
            jsonpCallback: 'callback',
            cache: false,
            success: function (json) {
                document.getElementById('count').appendChild(document.createTextNode(json.count));
            },
            error: function () {
                document.getElementById('count').appendChild(document.createTextNode('検索'));
            }
        });
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

        launchCount += 1;
        launchCounterElement.text(launchCount);

        if (0 < taGoalCount) {
            if (launchCount < taGoalCount) {
                // TA中
                $('#taCount').text(launchCount + ' / ' + taGoalCount + ' すた');
            } else if (launchCount === taGoalCount) {
                // TA終了処理
                clearInterval(taTimer);
                displayTAInfo(true);
                var tweet = tweetTAUrl
                        .replace(/_taGoalCount_/g, taGoalCount)
                        .replace('_taTime_', taScore)
                        .replace('_taAvgCps_', (taGoalCount / taScore).toFixed(3))
                        .replace('_taMaxCps_', taMaxCps);
                $('#tweet').attr('href', tweet);
            } else {
                // TA終了後
            }
        }
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
})();
