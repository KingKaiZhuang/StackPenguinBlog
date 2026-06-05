import { execSync } from "child_process";

async function run() {
    console.log("🚀 開始推送更新到 GitHub...");
    try {
        execSync("git add .", { stdio: "inherit" });
        
        const status = execSync("git status --porcelain").toString();
        if (status.trim().length > 0) {
            const msg = process.argv[2] || "Update content";
            execSync(`git commit -m "${msg}"`, { stdio: "inherit" });
            execSync("git push", { stdio: "inherit" });
            console.log("✅ GitHub 推送成功！");
        } else {
            console.log("⚠️ 沒有需要推送的變更。");
            // We can still check Vercel status just in case.
        }
    } catch (e) {
        console.error("❌ Git 推送失敗", e.message);
        process.exit(1);
    }

    console.log("\n⏳ 等待 Vercel 觸發部署...");
    // Wait a few seconds to ensure GitHub webhook triggers Vercel
    await new Promise(r => setTimeout(r, 5000));

    const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
    let i = 0;
    
    // Create an animation loop independent of the exec polling
    const spinner = setInterval(() => {
        process.stdout.write(`\r${frames[i++ % frames.length]} 讀取 Vercel 狀態中... `);
    }, 100);

    let lastStatusStr = "";

    while (true) {
        try {
            const output = execSync("npx vercel ls --yes", { stdio: "pipe" }).toString();
            const lines = output.split('\n');
            const headerIndex = lines.findIndex(l => l.includes("Project") && l.includes("Deployment") && l.includes("Status"));
            
            if (headerIndex !== -1 && lines.length > headerIndex + 1) {
                const firstRow = lines[headerIndex + 1];
                if (firstRow.trim() === "") continue;
                
                const match = firstRow.match(/https:\/\/\S+/);
                const url = match ? match[0] : "unknown";
                
                let status = "Unknown";
                if (firstRow.includes("● Ready")) status = "Ready";
                else if (firstRow.includes("● Building")) status = "Building";
                else if (firstRow.includes("● Queued")) status = "Queued";
                else if (firstRow.includes("● Error")) status = "Error";
                else if (firstRow.includes("● Canceled")) status = "Canceled";

                const statusStr = `Vercel 部署狀態: [${status}] | 網址: ${url}                             `;
                
                if (statusStr !== lastStatusStr) {
                    process.stdout.write(`\r✅ ${statusStr}\n`);
                    lastStatusStr = statusStr;
                }

                if (status === "Ready") {
                    clearInterval(spinner);
                    console.log(`\n🎉 部署完成！您的網站已經成功更新。`);
                    console.log(`🔗 測試網址: ${url}`);
                    break;
                } else if (status === "Error" || status === "Canceled") {
                    clearInterval(spinner);
                    console.log(`\n❌ 部署失敗或已取消，請前往 Vercel 控制台查看原因。`);
                    process.exit(1);
                }
            }
        } catch (e) {
            // ignore
        }
        await new Promise(r => setTimeout(r, 4000));
    }
}

run();
