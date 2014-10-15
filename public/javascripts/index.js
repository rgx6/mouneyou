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
                src: 'http://pic.twitter.com/8UNWlFTRDS'
            }, {
                image: '/images/stamp002.png',
                src: 'http://pic.twitter.com/VcwA4qwG1M'
            }, {
                image: '/images/stamp003.png',
                src: 'http://pic.twitter.com/ovFQeH1qD6'
            }, {
                image: '/images/stamp004.png',
                src: 'http://pic.twitter.com/zEZc5fsa3C'
            }, {
                image: '/images/stamp005.png',
                src: 'http://pic.twitter.com/ooDW5xx6pc'
            }, {
                image: '/images/stamp006.png',
                src: 'http://pic.twitter.com/XO5YmxNLzI'
            }, {
                image: '/images/stamp007.png',
                src: 'http://pic.twitter.com/a0Opq4QPfp'
            }, {
                image: '/images/stamp008.png',
                src: 'http://pic.twitter.com/wuqX3fyL0Q'
            }, {
                image: '/images/stamp009.png',
                src: 'http://pic.twitter.com/2AY7vdkHpM'
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
