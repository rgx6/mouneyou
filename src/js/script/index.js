(function () {
    // 'use strict';

    var url = location.protocol + '//' + location.host + location.pathname;

    var tweetUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&text={src}+' + encodeURI(url)
            + '+%23%E3%81%A6%E3%82%86%E3%81%86%E3%81%8B%E3%82%82%E3%81%86%E5%AF%9D%E3%82%88%E3%81%86';

    var tweetListUrl = 'https://twitter.com/search?q=' + encodeURI(url);

    var updateTimer;
    var updateInterval = 2000;

    var launchCount = 0;

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
        { image: '/images/anime044.png' }
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

        var stamp = getRandomStamp();
        setItem(stamp);

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
            });

            div.insertBefore(sortButton);
        }

        getTweetCount();

        document.getElementById('count').setAttribute('href', tweetListUrl);
        refreshArrow();

        // 開きっぱなし対策
        setTimeout(function () { location.reload(); }, 24 * 3600 * 1000);
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
        document.getElementById('tweet').setAttribute('href', tweetUrl.replace('{src}', item.src));
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

        var size = 200;

        var left = document.documentElement.clientWidth;
        var top = Math.floor(Math.random() * document.documentElement.clientHeight - size / 2);
        var img = $('<div>');
        img.addClass('bullet');
        img.css('background-image', 'url("' + bullet.image + '")');
        img.css({
            width: size,
            height: size,
            left: left,
            top: top,
            'z-index': 1,
        });
        bodyElement.append(img);

        var speed = Math.floor(Math.random() * 2500) + 500;
        img.animate({
            left: -1 * size,
        }, speed, 'linear', function () { img.remove(); });

        launchCount += 1;
        launchCounterElement.text(launchCount);
    }
})();
