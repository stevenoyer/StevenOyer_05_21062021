// Main function and auto called on load page
(async function() {
    
    showCart()

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