const fs = require('fs');

function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function stringifyCSVLine(row) {
    return row.map(col => {
        if (typeof col === 'string' && (col.includes(',') || col.includes('"') || col.includes('\n'))) {
            return `"${col.replace(/"/g, '""')}"`;
        }
        return col;
    }).join(',');
}

try {
    const lines = fs.readFileSync('import_ready_products.csv', 'utf8').split(/\r?\n/);
    const header = parseCSVLine(lines[0]);
    const coverImageIndex = header.indexOf('coverImage');

    if (coverImageIndex === -1) {
        console.error("Could not find coverImage column");
        process.exit(1);
    }

    const outputLines = [];
    outputLines.push(lines[0]); // Header

    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const row = parseCSVLine(lines[i]);
        if (row[coverImageIndex]) {
            // Remove everything after the first semicolon
            row[coverImageIndex] = row[coverImageIndex].split(';')[0];
        }
        outputLines.push(stringifyCSVLine(row));
    }

    fs.writeFileSync('import_ready_products.csv', outputLines.join('\n'));
    console.log("Done. Processed " + (lines.length - 1) + " lines and removed multiple images.");
} catch (error) {
    console.error("Error processing CSV:", error);
}
