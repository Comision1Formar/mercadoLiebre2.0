## Guia
1. Crear la carpeta partials dentro de la carpeta views
2. Crear tres archivos dentro de carpeta partials: 'head.ejs', 'header.ejs' y 'footer.ejs'
3. Mover las porciones de código correspondientes desde el archivo index.ejs a cada uno de los partials, reemplazando vinculando el código migrado por las siguientes líneas de código respectivamente:
~~~
<%- include('partials/head') %>
<%- include('partials/header') %>
<%- include('partials/footer') %>
~~~
4. Crear un carpeta llamada **functions**, y dentro de ella un archivo **agregaMiles** que contenga una función que permita añadir el formato de 'miles' al precio (product.price). **LUEGO SE USA DIRECTAMENTE EN LA VISTA**
~~~
module.exports = number => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
~~~
5. Agregar el siguiene condicional en index.ejs para el caso que el producto no tenga descuento:
~~~
    <% if (producto.discount != 0) { %>
        <span><%- producto.discount %> % OFF</span>
    <% } %>
~~~
6. Crear el archivo **productDetail.ejs**. Añadir los _partials_ y crear la estructura necesaria para mostrar el detalle del producto conforme al modelo.
7. Crear el método correspondiente al controlador _productController_ que renderize la página _productDetail_:
~~~
 detalle: function(req, res) {
        id = req.params.id;
        res.render('productDetail', {
            title: "Detalle del Producto",
            id: id,
        })
    }
~~~
8. Crear la ruta correspondiente en el enrutador _product_:
~~~
router.get('/detail/:id', controller.detalle) // añado la ruta para mostrar los detalles del producto
~~~
9. Añadir en el _index.ejs_ las rutas necesarias para que se renderice la vista de _productDetail_
10. Dar funcionalidad al buscador. En el header el formulario de búsqueda debe quedar así:
~~~
    <form action="/search" method="get" class="search-form">
        <input type="text" name="search" placeholder="Buscar productos, marcas y más" class="search-form_input">
        <button type="submit" class="search-form_button"><i class="fas fa-search"></i></button>
    </form>
~~~
11. Añadir una ruta el _index_ que se haga cargo de la busqueda:
~~~
router.get('/search', controller.search); //añado una nueva ruta que se ocupe de la busqueda de productos
~~~
12. Añadir un método en _mainController_ que se haga cargo de renderizar la vista con los productos encontrados:
~~~
 search: function(req, res) {
        let buscar = req.query.search;
        let productos = [];
        dbProduct.forEach(producto => {
            if (producto.name.toLowerCase().includes(buscar)) {
                productos.push(producto)
            }
        })
        res.render('products', {
            title: "Resultado de la búsqueda",
            productos: productos
        })
    }
~~~







