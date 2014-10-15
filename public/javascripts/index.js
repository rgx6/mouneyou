(function () {
    'use strict';

    var tweetUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&hashtags=' + encodeURI('てゆうかもう寝よう')
            + '&text={src}'
            + '&url=' + encodeURI('http://mouneyou.rgx6.com/');

    var items = [
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
            src: 'http://pic.twitter.com/Z0yAX0QcHJ'
        }, {
            image: '/images/stamp011.png',
            src: 'http://pic.twitter.com/M6I6regjKd'
        }, {
            image: '/images/stamp012.png',
            src: 'http://pic.twitter.com/Iv8gvPUATM'
        }, {
            image: '/images/stamp013.png',
            src: 'http://pic.twitter.com/sQOagjwDRJ'
        }
    ];

    init();

    document.getElementById('title').addEventListener('click', function () {
        'use strict';
        // console.log('#title click');

        var item = getRandomItem();
        setItem(item);
    });

    document.getElementsByTagName('body')[0].addEventListener('selectstart', function () {
        console.log('hoge');
    });

    function init() {
        'use strict';
        // console.log('init');

        var item = getRandomItem();
        setItem(item);

        var divitems = document.getElementById('items');

        for (var i = 0; i < items.length; i++) {
            var div = document.createElement('div');
            div.setAttribute('index', i);
            div.style.backgroundImage = 'url("' + items[i].image + '")';
            div.addEventListener('click', function () {
                // console.log('#items div click');

                var index = this.getAttribute('index');
                var item = items[index];
                setItem(item);
            });
            divitems.appendChild(div);
        }
    }

    function getRandomItem () {
        'use strict';
        // console.log('getRandom');

        var index = Math.floor(Math.random() * items.length);
        return items[index];
    }

    function setItem (item) {
        'use strict';
        // console.log('setItem');

        document.getElementById('image').style.backgroundImage = 'url("' + item.image + '")';
        document.getElementById('tweet').setAttribute('href', tweetUrl.replace('{src}', item.src));
    }
})();
