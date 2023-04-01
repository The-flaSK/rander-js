const fs = require('fs');
const folderPath = './videos';
console.log("Cleaner started!")
// A function to delete files that were created 2 minutes ago
function deleteOldFiles() {
  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

  fs.readdir(folderPath, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      const filePath = `${folderPath}/${file}`;
      fs.stat(filePath, (err, stats) => {
        if (err) throw err;

        const creationTime = stats.ctime;
        if (creationTime < twoMinutesAgo) {
          fs.unlink(filePath, (err) => {
            if (err) throw err;
            console.log(`Deleted file: ${filePath}`);
          });
        }
      });
    }
  });
}

// Set a timer to run deleteOldFiles function every 5 seconds
setInterval(deleteOldFiles, 5 * 1000);

