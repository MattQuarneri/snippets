// Create a Trusted Types policy
const policy = window.trustedTypes.createPolicy('defaultPolicy', {
    createHTML: (html) => html
});

function getTextNodesByLength() {
    const textNodes = [];

    // Recursive function to traverse the DOM and shadow DOM
    function traverse(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Exclude text nodes inside SCRIPT elements
            if (node.parentNode.nodeName !== 'SCRIPT' && 
                node.parentNode.nodeName !== 'STYLE') {
                
                const trimmedText = node.nodeValue.trim();
                if (trimmedText.length > 0) {
                    node.nodeValue = trimmedText;
                    textNodes.push(node);
                    //textNodes.push({ node, length: trimmedText.length, text: trimmedText });
                }
            }
        } else if (node.nodeType == Node.ELEMENT_NODE && node.nodeName === "P"){ 
            const trimmedText = node.textContent.trim();
             if (trimmedText.length > 0) {
                node.textContent = trimmedText;
                textNodes.push(node);
             }
        } 
        else {
            // If the node has a shadow root, traverse it
            if (node.shadowRoot) {
                traverse(node.shadowRoot);
            }
            // Recursively traverse child nodes
            node.childNodes.forEach(child => traverse(child));
        }
    }

    // Start traversing from the document body
    traverse(document.body);

    // Sort text nodes by text length in descending order
    textNodes.sort((a, b) => b.textContent.length - a.textContent.length);

    return textNodes;
    /*
    return textNodes.map(entry => ({
        node: entry.node,
        text: entry.text,
        length: entry.length,
    }));
    */
}

function styleText(node, commonWords, commonVerbs, vowels) {
    // List of commonWords are smaller
    
    // Regex to match common words, ignoring case
    const regex = new RegExp(`\\b(${commonWords.join('|')})\\b`, 'gi');

    
    // Replace matched words with styled spans
    const modifiedContent = node.textContent.split(/\b/).map(word => {
        // Process words longer than 4 letters
        if (word.length > 4) {
            let i = 3;
            if(vowels.includes(word[3])){
                i = 4;
                if(!vowels.includes(word[4])){
                    i = 5;        
                }
            }
            return `<b>${word.slice(0, i)}</b>` + word.slice(i); // Bold the first three letters
        }
        // Return the word unchanged if it's not longer than 4 letters
        return word;
    }).join('').replace(regex, '<span style="font-size: 0.8em;">$1</span>');

    if (node.nodeType == Node.ELEMENT_NODE && node.nodeName === "P"){
        node.innerHTML = policy.createHTML(modifiedContent);
    }else{
        node.parentNode.innerHTML = policy.createHTML(modifiedContent);
    }
}

const vowels = ["a", "e", "i", "o", "u", "y"];
const commonWords = [" of ", " the ", " a ", " to ", " an ", " is ", " in ", " on ", " at ", " and ", " or "];
const commonVerbs = ["am", "is", "are", "was", "were", "be", "been", "being", "do", "does", "did", "have", "has", "had", "go", "goes", "went", "see", "saw", "seen", "make", "made", "take", "taken"]
getTextNodesByLength().map(elm => styleText(elm, commonWords, commonVerbs, vowels));