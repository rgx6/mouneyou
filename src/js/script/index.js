(function () {
    // 'use strict';

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
        // 'use strict';
        // console.log('init');

        var item = getRandomItem();
        setItem(item);

        var divitems = document.getElementById('items');

        for (var i = 0; i < items.length; i++) {
            var div = document.createElement('div');
            div.setAttribute('index', i);
            div.style.backgroundImage = 'url("' + items[i].image + '")';
            if (items[i].isCover) div.classList.add('size-cover');
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

        var selected = document.getElementById('selected');
        selected.style.backgroundImage = 'url("' + item.image + '")';
        if (item.isCover) {
            selected.classList.add('size-cover');
        } else {
            selected.classList.remove('size-cover');
        }
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
