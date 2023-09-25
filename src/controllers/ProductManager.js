import {promises as fs} from 'fs';
import { nanoid } from 'nanoid';

class ProductManager {
    constructor (){ 
        this.path = "./src/models/products.json"
    }

    readProducts = async () => {
        let products = await fs.readFile(this.path , "utf-8")
        return JSON.parse(products)
    }

    writeProducts = async (product) =>{
        await fs.writeFile(this.path , JSON.stringify(product))
        
    }

    exist = async(id) => {
        let products= await this.readProducts()
        return products.find(prod => prod.id === id)
    }

    addProducts = async (product) => {
        const { title, description, code, price, status, stock, category } = product;
  

        const numericPrice = parseFloat(price);
        const booleanStatus = status === 'true'; // Convierte la cadena en booleano
        const numericStock = parseInt(stock);
        const numericMinimo = parseInt(product.minimo);

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof code !== "string" ||
            typeof numericPrice !== "number" || // Comprueba numericPrice
            typeof booleanStatus !== "boolean" || // Comprueba booleanStatus
            typeof numericStock !== "number" || // Comprueba numericStock
            typeof category !== "string" ||
            typeof numericMinimo !== "number"
        ) {
            return "Todos los campos son requeridos ";
        }
        console.log('Datos del producto a agregar:', product);
        let productsOld = await this.readProducts();

        product.id = productsOld.length + 1;

        const productWithTypes = {
            ...product,
            price: numericPrice,
            status: booleanStatus,
            stock: numericStock,
            minimo: numericMinimo
        };

        let productAll = [...productsOld, productWithTypes];
        await this.writeProducts(productAll);
        console.log('Producto agregado:', productWithTypes);
        return "Producto Agregado";
    }
    
    
    
    getProducts = async () => {
        return await this.readProducts()
    }

    getProductsById = async (id) => {
        let productsById = await this.exist(id)
        if ( !productsById) return "Producto no encontrado :("
        return productsById
    }

    updateProducts = async (id, product) => {
        let productsById= await this.exist(id)
        if ( !productsById) return "Producto no encontrado :("
        await this.deleteProducts(id)
        let productsOld =await this.readProducts()
        let products = [{...product, id:id}, ...productsOld]
        await this.writeProducts(products)
        return "Producto Actualizado"
    }

    deleteProducts = async (id) => {
        let products= await this.readProducts()
        let existProducts = products.some( prod => prod.id === id)
        if (existProducts) {
            let filterProducts = products.filter( prod => prod.id != id)
            await this.writeProducts(filterProducts)
            return "Producto eliminado"
        } 
        return "Producto no existe"
    }

}

export default ProductManager