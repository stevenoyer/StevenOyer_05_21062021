// Main function and auto called on load page
(async function() {
    
    const id = getParamaterUrl()
    const product = await getProductById(id)
    const verify = await verifyExistIdInJson(id)
    insertProductOnPage(product)

    const addCart = document.getElementById('addCart')
    const cartTrash = document.getElementById('cart--trash')

    addCart.addEventListener('click', function() {

        try {
            addProductToCart(product)
            showCart()
        } catch (error) {
            console.warn(error)
        }
        
    })

}());

// Show cart in localstorage
function showCart()
{

    // Clean block 'articles-card-list'
    document.getElementById('articles-card-list').innerHTML = ''

    let productsCart = JSON.parse(localStorage.getItem('cart'))

    let price = 0

    console.log(productsCart)
    
    productsCart.forEach(product => {
        
        if (product.quantity > 1) {
            price += (product.price / 100) * product.quantity
        }else {
            price += product.price / 100
        }
        
        templateCart(product)
    })

    document.getElementById('total-price').textContent = 'Sous total : ' + price + '.00€'

}

// Delete product in localstorage
function deleteProductToCart(id)
{

    let removeProductInCart = false

    productsInCart = JSON.parse(localStorage.getItem('cart'))

    productsInCart.forEach(product => {

        if (product._id == id) {
            console.log(product)
            if (product.quantity > 1) {
                product.quantity --
                console.log(product)
            }else {
                removeProductInCart = true
            }
        }

        console.log(product)
        
    })

    if (removeProductInCart) {
        for (let i in productsInCart) {
            if (id === productsInCart[i]['_id']) {
                productsInCart.splice(i, 1)

                if (productsInCart.length === 0) {
                    localStorage.removeItem('cart')
                }

                console.log('Remove => ', productsInCart)
            }
        }
    }

    localStorage.setItem('cart', JSON.stringify(productsInCart))
    showCart()
    console.log('cart end =>',productsInCart)

}

// Get template sidebar product and clone
function templateCart(product)
{

    const cartList = document.getElementById('articles-card-list')

    // Get template article
    const template = document.getElementById('template-card')

    // Clone template article
    const cloneTemplate = document.importNode(template.content, true)

    // Insert data in template
    cloneTemplate.getElementById('cart--img').src = product.imageUrl
    cloneTemplate.getElementById('cart--trash').setAttribute('onclick', 'deleteProductToCart(\'' + product._id + '\')')
    cloneTemplate.getElementById('cart--badge').textContent = product.quantity

    // Display template with data
    cartList.appendChild(cloneTemplate)
}

// Add product to cart
function addProductToCart(product)
{

    let productItem = {
        "name": product.name,
        "description": product.description,
        "imageUrl": product.imageUrl,
        "price": product.price,
        "_id": product._id,
        "lense": document.getElementById('article--option').value,
        "quantity": 1
    }

    // Cart is empty
    if (!localStorage.getItem('cart')) {
        let cartTable = [];
        cartTable.push(productItem)
        localStorage.setItem('cart', JSON.stringify(cartTable))
        return;
    }

    let getJsonCart = JSON.parse(localStorage.getItem('cart'))
    let exist = false

    getJsonCart.forEach(existProduct => {

        if (existProduct._id == product._id) {
            existProduct.quantity ++
            exist = true 
        }

    })

    if (!exist) {
        getJsonCart.push(productItem)
    }

    localStorage.setItem('cart', JSON.stringify(getJsonCart))
    UIkit.notification({message: product.name + ' ajouté au panier.', status: 'success', timeout: 2000})

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

    document.getElementById('article--img').src = product.imageUrl
    document.getElementById('article--title').innerHTML = `${product.name} <span id="article--price" class="uk-badge">${product.price / 100}.00€</span>`
    document.getElementById('article--description').textContent = product.description

    const optionsLenses = product.lenses 

    optionsLenses.forEach((optionsLenses) => {
        document.getElementById('article--option').innerHTML += `<option>${optionsLenses}</option>`
    })

}