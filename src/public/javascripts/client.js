(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-52114327-4', 'auto');
ga('send', 'pageview');

(function () {
    'use strict';

    var tweetUrl = 'https://twitter.com/intent/tweet'
            + '?lang=ja'
            + '&hashtags=' + encodeURI('てゆうかもう寝よう')
            + '&text={src}'
            + '&url=' + encodeURI(location.href);

    var tweetListUrl = 'https://twitter.com/search?q=' + encodeURI(location.href);

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
            src: 'http://pic.twitter.com/YYwHReTUBS'
        }, {
            image: '/images/stamp024.png',
            src: 'http://pic.twitter.com/VnmJEufqY2'
        }, {
            image: '/images/stamp025.png',
            src: 'http://pic.twitter.com/6viZHnOBEn'
        }
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

        var item = getRandomItem();
        setItem(item);
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

        document.getElementById('count').setAttribute('href', tweetListUrl);
        refreshArrow();
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

        document.getElementById('selected').style.backgroundImage = 'url("' + item.image + '")';
        document.getElementById('tweet').setAttribute('href', tweetUrl.replace('{src}', item.src));
    }

    function refreshArrow () {
        'use strict';
        // console.log('refreshArrow');

        var width = window.innerWidth;

        var tweetobj = document.getElementById('tweet');
        if (width < 440) {
            tweetobj.classList.remove('arrowtweetleft');
            tweetobj.classList.add('arrowtweettop');
        } else {
            tweetobj.classList.remove('arrowtweettop');
            tweetobj.classList.add('arrowtweetleft');
        }

        var countobj = document.getElementById('count');
        if (width < 220 ||
            (440 <= width && width < 550)) {
            countobj.classList.remove('arrowcountleft');
            countobj.classList.add('arrowcounttop');
        } else {
            countobj.classList.remove('arrowcounttop');
            countobj.classList.add('arrowcountleft');
        }
    }
})();
