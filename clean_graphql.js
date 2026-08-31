const fs = require('fs');
let code = fs.readFileSync('src/types/graphql.ts', 'utf8');
const lines = code.split('\n');

const duplicates = [
    'BundleInput', 'CategoryInput', 'CheckoutInput', 'HeroBannerInput', 'HomepageSectionInput',
    'OrderItemInput', 'ProductInput', 'ShippingAddressInput', 'ShippingConfigInput', 'TaxConfigInput', 'CouponInput'
];

let newLines = [];
let inDuplicateBlock = false;
let occurrences = {};

for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let match = line.match(/^export type (\w+) = \{/);
    if (match) {
        let typeName = match[1];
        if (duplicates.includes(typeName)) {
            occurrences[typeName] = (occurrences[typeName] || 0) + 1;
            if (occurrences[typeName] > 1) {
                inDuplicateBlock = true;
            }
        }
    }
    
    if (inDuplicateBlock) {
        if (line.startsWith('};')) {
            inDuplicateBlock = false;
        }
        continue;
    }
    
    newLines.push(line);
}

fs.writeFileSync('src/types/graphql.ts', newLines.join('\n'));
