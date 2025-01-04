function removeDuplicateDivParents() {
    // Find all iframes
    const iframes = document.getElementsByTagName('iframe');
    
    for (let iframe of iframes) {
        let currentElement = iframe;
        let divParents = [];
        
        // Collect all parent divs with class "A"
        while (currentElement.parentElement) {
            if (currentElement.parentElement.tagName === 'DIV' && 
                currentElement.parentElement.className === 'A') {
                divParents.push(currentElement.parentElement);
            }
            currentElement = currentElement.parentElement;
        }
        
        // If we found multiple parent divs with class "A"
        if (divParents.length > 1) {
            // Keep the outermost div (first encountered when going up)
            const keepDiv = divParents[divParents.length - 1];
            
            // Move the iframe directly under the first div
            keepDiv.appendChild(iframe);
            
            // Remove all other div parents
            divParents.slice(0, -1).forEach(div => {
                if (div.parentElement) {
                    // Replace the div with its children (if any)
                    while (div.firstChild) {
                        div.parentElement.insertBefore(div.firstChild, div);
                    }
                    div.parentElement.removeChild(div);
                }
            });
        }
    }
}