// Main function and auto called on load page
(async function() {
    
    const products = await getAllProducts();
    insertProductsOnPage(products)

}());

// Get all products by API
async function getAllProducts()
{
    const articles = fetch('https://api.orinoco.stevenoyer.fr/api/cameras')
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then(produits => {
            return produits
        })
        .catch(erreur => {
            alert('Un problème est survenue lors de la connexion à l\'API')
            console.log(erreur)
        });

    return articles
}

// Insert product on the page
function insertProductsOnPage(products)
{

    // Clean block 'articles'
    document.getElementById('articles--list').innerHTML = ''

    // Loop products
    products.forEach((products) => {
        displayProduct(products)
    })

}

// Displaying products using the template
function displayProduct(product)
{
    console.log(product)

    // Get articles list
    const articlesList = document.getElementById('articles--list')

    // Get template article
    const template = document.getElementById('articles')

    // Clone template article
    const cloneTemplate = document.importNode(template.content, true)

    // Format price
    let formatPrice = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })
    let price = formatPrice.format(product.price)

    // Insert data in template
    cloneTemplate.getElementById('article--img').src = product.imageUrl
    cloneTemplate.getElementById('article--title').innerHTML = `${product.name} <span id="article--price" class="uk-badge">${price}</span>`
    cloneTemplate.getElementById('article--description').textContent = product.description
    cloneTemplate.getElementById('article--link').href = '/produit.html?id=' + product._id

    // Display template with data
    articlesList.appendChild(cloneTemplate)

}
