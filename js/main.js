const workspace = document.getElementById('workspace');
const runButton = document.getElementById('runButton');
let program = [];

document.querySelectorAll('.dropdown-item').forEach(item => {
    item.addEventListener('click', (e) => {
        const id = e.target.id;
        const block = document.createElement('div');
        block.className = 'command-block';
        block.textContent = e.target.textContent;
        block.dataset.command = id;
        workspace.appendChild(block);
        program.push(id);
    });
});

runButton.addEventListener('click', () => {
    executeProgram(program);
});

function executeProgram(program) {
    let i = 0;

    function nextStep() {
        if (i < program.length) {
            const command = program[i];
            executeCommand(command);
            i++;
            setTimeout(nextStep, 1000);
        }
    }

    nextStep();
}

function executeCommand(command) {
    switch (command) {
        case 'moveForward':
            console.log('前進');
            // キャラクターの前進ロジックを追加
            break;
        case 'turnLeft':
            console.log('左折');
            // キャラクターの左折ロジックを追加
            break;
        case 'turnRight':
            console.log('右折');
            // キャラクターの右折ロジックを追加
            break;
        case 'jump':
            console.log('ジャンプ');
            // キャラクターのジャンプロジックを追加
            break;
    }
}
