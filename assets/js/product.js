// Main function and auto called on load page
(async function() {
    
    const id = getParamaterUrl()
    const product = await getProductById(id)
    const verify = await verifyExistIdInJson(id)
    insertProductOnPage(product)

    const addCart = document.getElementById('addCart')

    addCart.addEventListener('click', function() {
        
        addProductToCart()
        
    })

}());

function addProductToCart()
{
    alert('In dev')
}


// Get params url
function getParamaterUrl()
{
    const urlString = window.location.search
    const urlParams = new URLSearchParams(urlString)
    const idUrl = urlParams.get('id')

    return idUrl
}

// Verify if exist id in list
async function verifyExistIdInJson(id)
{
    const products = await getAllProducts()
    let idProducts = []

    products.forEach((products) => {
        idProducts.push(products._id)
    });
    
    let idExist = idProducts.includes(id)
    
    if (!idExist) {
        document.location.href = "/"
    }
}

// Get all products by API
async function getAllProducts()
{
    const products = fetch('https://api.orinoco.stevenoyer.fr/api/cameras/')
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(products => {
            return products
        })
        .catch(error => {
            alert('Un problème est survenue lors de la connexion à l\'API')
            console.log(error)
        });

    return products
}

// Get single product by ID
async function getProductById(id)
{
    const product = fetch('https://api.orinoco.stevenoyer.fr/api/cameras/' + id)
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(product => {
            return product
        })
        .catch(error => {
            alert('Un problème est survenue lors de la connexion à l\'API')
            console.log(error)
        });

    return product
}

// Insert information product on page
function insertProductOnPage(product)
{

    console.log(product)

    document.getElementById('article--img').src = product.imageUrl
    document.getElementById('article--title').innerHTML = `${product.name} <span id="article--price" class="uk-badge">${product.price / 100}.00€</span>`
    document.getElementById('article--description').textContent = product.description

    const optionsLenses = product.lenses 

    optionsLenses.forEach((optionsLenses) => {
        document.getElementById('article--option').innerHTML += `<option>${optionsLenses}</option>`
    })

}