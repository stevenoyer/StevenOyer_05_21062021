// Main function and auto called on load page
(async function() {
    
    if (localStorage.getItem('cart') == null) {
        document.getElementById('cart-empty').style.display = 'block'
        document.getElementById('cart-block').style.display = 'none'
    }else {
        document.getElementById('cart-empty').style.display = 'none'
        document.getElementById('cart-block').style.display = 'block'
        showCart()
    }

    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault()
        checkInputs()
    })

}());

// Show cart in localstorage
function showCart()
{

    let price = 0

    // Clean block 'table-products'
    document.getElementById('table-products').innerHTML = ''

    let productsCart = JSON.parse(localStorage.getItem('cart'))

    console.log(productsCart)
    
    productsCart.forEach(product => {
        
        if (product.quantity > 1) {
            price += (product.price / 100) * product.quantity
        }else {
            price += product.price / 100
        }
        
        templateCart(product)
    })

    document.getElementById('cart-total-price').textContent = price + '.00€'

    if (price == 0) {
        document.getElementById('cart-empty').style.display = 'block'
        document.getElementById('cart-block').style.display = 'none'
    }else {
        document.getElementById('cart-empty').style.display = 'none'
        document.getElementById('cart-block').style.display = 'block'
    }

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

    let price = 0
    
    if (product.quantity > 1) {
        price = (product.price / 100) * product.quantity
    }else {
        price = product.price / 100
    }

    const cartList = document.getElementById('table-products')

    // Get template article
    const template = document.getElementById('table-cart')

    // Clone template article
    const cloneTemplate = document.importNode(template.content, true)

    // Insert data in template
    cloneTemplate.getElementById('table-img').innerHTML = '<img id="cart--img" src="' + product.imageUrl + '" alt="" width="80%"><p>' + product.name + '</p> <p>' + product.lense + '</p>'
    cloneTemplate.getElementById('table-quantity').textContent = product.quantity
    cloneTemplate.getElementById('table-amount').textContent = price + '.00€'
    cloneTemplate.getElementById('cart--trash').setAttribute('onclick', 'deleteProductToCart(\'' + product._id + '\')')

    // Display template with data
    cartList.appendChild(cloneTemplate)

}

function getAllProductsIds()
{
    const allProducts = JSON.parse(localStorage.getItem('cart'))
    return allProducts.map( product => product._id )
}

function checkInputs()
{
    const formData = new FormData(document.querySelector('#formData')) 
    const contact = Object.fromEntries(formData.entries())

    for (let value of formData.entries()) {
        if (value[1] == "" || value[1] == " ") {
            UIkit.notification({message: 'Veuillez vérifier tous les champs !', status: 'danger', timeout: 2000})
            return false
        }
    }

    delete contact.zipcode

    const products = getAllProductsIds()
    /* products.push('pouet pouet') */
    
    const body = {
        products,
        contact
    }

    console.log(body)

    document.getElementById('validateForm').style.display = 'none'

    fetch('https://api.orinoco.stevenoyer.fr/api/cameras/order', {
        method: 'post',
        headers: { "content-type" : "application/json" },
        body: JSON.stringify(body)
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        }

        UIkit.notification({message: 'Erreur serveur', status: 'danger', timeout: 2000})
    })
    .then(data => {
        if (data.orderId) {
            UIkit.notification({message: 'Votre commande a bien été passée', status: 'success', timeout: 2000})
            
            setTimeout(() => {
                location.assign('confirmation.html?order=' + data.orderId)
            }, 2000)

        }
    })
    .catch(console.warn)
    .finally(() => {
        document.getElementById('validateForm').style.display = 'block'
    })

}