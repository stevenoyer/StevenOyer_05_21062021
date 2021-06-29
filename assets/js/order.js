// Main function and auto called on load page
(async function() {
    
    // Get params in URL
    const params = new URLSearchParams(window.location.search);

    // If order and params not empty 
    if (params.get('order') != "" && params != "") {
        // Get params order and print in element
        document.getElementById('orderCommand').textContent = params.get('order')
        localStorage.removeItem('cart')
    }else {
        // Return home page if empty params and order
        location.assign('index.html')
    }


}());