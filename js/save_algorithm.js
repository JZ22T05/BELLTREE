// ノードタイプIDの変換
function convertNodeTypeId(nodeTypeId) {
    switch (nodeTypeId) {
        case "loop-start": return 9;
        case "loop-end": return 5;
        case "if-condition": return 6;
        case "else": return 8;
        case "if-end": return 7;
        default: return parseInt(nodeTypeId);
    }
}

// 並べたアルゴリズムを取得
function getNodes() {
    const programArea = document.getElementById("program-area");
    if (!programArea) throw new Error("programArea element not found");

    const nodes = [];
    programArea.querySelectorAll(".block").forEach((block, index) => {
        const nodeTypeId = convertNodeTypeId(block.getAttribute("data-command"));
        const input = block.querySelector("input[type='number']");
        const loopCount = input ? parseInt(input.value, 10) || 0 : 0;
        nodes.push({ sequenceNumber: index + 1, nodeTypeId, loopCount });
    });

    return nodes;
}

// 保存処理
document.addEventListener("DOMContentLoaded", () => {
    const scoreScreenBtn = document.getElementById("score-screen-btn");
    if (scoreScreenBtn) {
        scoreScreenBtn.addEventListener("click", async (event) => {
            event.preventDefault();
            try {
                await saveAlgorithmToDB();
                alert("保存が完了しました！");
            } catch (error) {
                alert("保存に失敗しました。再試行してください。");
                console.error("保存エラー:", error);
            }
        });
    }
});

// タイマーからクリア時間を取得し、保存
async function saveAlgorithmToDB() {
    const nodes = getNodes();
    if (nodes.length === 0) throw new Error("アルゴリズムが空です");

    // 経過時間（秒）を小数点以下2桁で取得
    const clearTime = (elapsedTime / 1000).toFixed(2);

    const sessionResponse = await fetch("../php/save_algorithm.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get_session_data", nodes, clearTime }),
    });

    const sessionData = await sessionResponse.json();
    if (!sessionData.success) throw new Error(sessionData.message);

    if (sessionData.logged_in) {
        let sql = `
DECLARE
    v_algorithm_id NUMBER;
BEGIN
    INSERT INTO ALGORITHM (USER_ID, STAGE_ID)
    VALUES (${sessionData.user_id}, '${sessionData.stage_id}')
    RETURNING ALGORITHM_ID INTO v_algorithm_id;
`;

        nodes.forEach(node => {
            sql += `
    INSERT INTO NODE (SEQUENCE_NUMBER, NODE_TYPE_ID, ALGORITHM_ID, LOOP_COUNT)
    VALUES (${node.sequenceNumber}, ${node.nodeTypeId}, v_algorithm_id, ${node.loopCount});
`;
        });

        sql += `
    INSERT INTO STAGE_CLEAR_HISTORY (USER_ID, STAGE_ID, ALGORITHM_ID, CLEAR_TIME)
    VALUES (${sessionData.user_id}, '${sessionData.stage_id}', v_algorithm_id, ${clearTime});
END;
`;

        const sqlResponse = await fetch("../php/save_algorithm.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sql }),
        });

        const sqlData = await sqlResponse.json();
        if (!sqlData.success) throw new Error(sqlData.message);
    }
}




// // ノードタイプIDの変換
// function convertNodeTypeId(nodeTypeId) {
//     switch (nodeTypeId) {
//         case "loop-start": return 9;
//         case "loop-end": return 5;
//         case "if-condition": return 6;
//         case "else": return 8;
//         case "if-end": return 7;
//         default: return parseInt(nodeTypeId);
//     }
// }

// // 並べたアルゴリズムを取得
// function getNodes() {
//     const programArea = document.getElementById("program-area");
//     if (!programArea) throw new Error("programArea element not found");

//     const nodes = [];
//     programArea.querySelectorAll(".block").forEach((block, index) => {
//         const nodeTypeId = convertNodeTypeId(block.getAttribute("data-command"));
//         const input = block.querySelector("input[type='number']");
//         const loopCount = input ? parseInt(input.value, 10) || 0 : 0;
//         nodes.push({ sequenceNumber: index + 1, nodeTypeId, loopCount });
//     });

//     return nodes;
// }

// // 保存処理
// document.addEventListener("DOMContentLoaded", () => {
//     const scoreScreenBtn = document.getElementById("score-screen-btn");
//     if (scoreScreenBtn) {
//         scoreScreenBtn.addEventListener("click", async (event) => {
//             event.preventDefault();
//             try {
//                 await saveAlgorithmToDB();
//                 alert("保存が完了しました！");
//             } catch (error) {
//                 alert("保存に失敗しました。再試行してください。");
//                 console.error("保存エラー:", error);
//             }
//         });
//     }
// });

// async function saveAlgorithmToDB() {
//     const nodes = getNodes();
//     if (nodes.length === 0) throw new Error("アルゴリズムが空です");

//     const sessionResponse = await fetch("../php/save_algorithm.php", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action: "get_session_data", nodes }),
//     });

//     const sessionData = await sessionResponse.json();
//     if (!sessionData.success) throw new Error(sessionData.message);

//     if (sessionData.logged_in) {
//         let sql = `
// DECLARE
//     v_algorithm_id NUMBER;
// BEGIN
//     INSERT INTO ALGORITHM (USER_ID, STAGE_ID)
//     VALUES (${sessionData.user_id}, '${sessionData.stage_id}')
//     RETURNING ALGORITHM_ID INTO v_algorithm_id;
// `;

//         nodes.forEach(node => {
//             sql += `
//     INSERT INTO NODE (SEQUENCE_NUMBER, NODE_TYPE_ID, ALGORITHM_ID, LOOP_COUNT)
//     VALUES (${node.sequenceNumber}, ${node.nodeTypeId}, v_algorithm_id, ${node.loopCount});
// `;
//         });

//         sql += `
//     INSERT INTO STAGE_CLEAR_HISTORY (USER_ID, STAGE_ID, ALGORITHM_ID, CLEAR_TIME)
//     VALUES (${sessionData.user_id}, '${sessionData.stage_id}', v_algorithm_id, ${elapsedTime});
// END;
// `;

//         const sqlResponse = await fetch("../php/save_algorithm.php", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ sql }),
//         });

//         const sqlData = await sqlResponse.json();
//         if (!sqlData.success) throw new Error(sqlData.message);
//     }
// }
