(function () {
    $(document).ready(function () {
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
            }
        ];

        init();

        $('#items').on('click', 'div', function (e) {
            'use strict';
            // console.log('#items div click');

            var index = $(this).attr('index');
            var item = items[index];
            setItem(item);
        });

        $('#title').on('click', function () {
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

            for (var i = 0; i < items.length; i++) {
                var $div = $('<div/>');
                $div.attr('index', i);
                $div.css('background-image', 'url("' + items[i].image + '")');
                $('#items').append($div);
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

            $('#image').css('background-image', 'url("' + item.image + '")');
            $('#tweet').attr('href', tweetUrl.replace('{src}', item.src));
        }
    });
})();
