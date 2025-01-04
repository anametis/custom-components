function removeNestedDivsWithRegex(html) {
    // Match nested div patterns with class="A" around iframes
    const pattern = /(<div\s+class="A"\s*>)+\s*(<iframe[^>]*\/>)\s*(<\/div>)+/g;
    
    // Replace with single div wrapper
    return html.replace(pattern, '<div class="A">$2</div>');
}