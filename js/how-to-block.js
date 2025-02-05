(function () {
    'use strict';

    const how_use_block = {
        '前': {
            'description': 'キャラクターが向いてる方向に前進します。基本的な移動に使われます。'
        },
        '後': {
            'description': 'キャラクターが上方向にジャンプします。前進ノードと組み合わせると、斜め前にジャンプできます。'
        },
        'ジャンプ': {
            'description': 'キャラクターが上方向にジャンプします。前進ノードと組み合わせると、斜め前にジャンプできます。'
        },
        '停止': {
            'description': '動きが止まります。'
        }
    };
    const how_use_block2 = {
        '[': {
            'description': 'ル－プ開始。'
        },
        ']': {
            'description': 'ル－プ終了。'
        }
    };
    const how_use_block3 = {
        'IF[': {
            'description': '条件が真の場合にのみ中のノードを実行します。基本的な条件分岐を学ぶために使います。'
        },
        'IF文終了': {
            'description': 'IF文の終了を表します。'
        }

    };


    // 説明を更新する関数（どのプルダウンかを区別するため引数を追加）
    function refreshDescription(value, block, elementId) {
        const elDescription = document.querySelector(`#${elementId}`);
        if (block[value]) {
            elDescription.innerHTML = block[value].description;
        } else {
            elDescription.innerHTML = '選択したコマンドに説明がありません。';
        }
    }

    // プルダウン1
    const description = document.querySelector('#pulldown1');
    description.addEventListener('change', (e) => {
        refreshDescription(e.target.value, how_use_block, 'elDescription1');
    });

    // プルダウン2
    const description2 = document.querySelector('#pulldown2');
    description2.addEventListener('change', (e) => {
        refreshDescription(e.target.value, how_use_block2, 'elDescription2');
    });
    // プルダウン3
    const description3 = document.querySelector('#pulldown3');
    description3.addEventListener('change', (e) => {
        refreshDescription(e.target.value, how_use_block3, 'elDescription3');
    });

    // プルダウン4
    const description4 = document.querySelector('#pulldown4');
    description4.addEventListener('change', (e) => {
        refreshDescription(e.target.value, how_use_block4, 'elDescription4');
    });

    // プルダウン5
    const description5 = document.querySelector('#pulldown5');
    description5.addEventListener('change', (e) => {
        refreshDescription(e.target.value, how_use_block5, 'elDescription5');
    });

})();