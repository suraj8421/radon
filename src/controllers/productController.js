const productModel = require('../models/productModel')
const { uploadFile } = require('../aws/fileUpload')
const ObjectId = require('mongoose').Types.ObjectId
const { isValid, isValidBody, installmentRegex, priceRegex } = require('../middleware/valid')


const isValidSize = function (x) {
    return ["S", "XS", "M", "X", "L", "XXL", "XL"].indexOf(x) !== -1;
};

const isValidCurrencyFormat = function (x) {
    return ["₹"].indexOf(x) !== -1;
};

const isValidCurrencyID = function (x) {
    return ["INR"].indexOf(x) !== -1;
};

const createProduct = async function (req, res) {
    try {
        let body = req.body
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, style, availableSizes, installments } = body

        ////////////////////////////////////*body validation*////////////////////////////////////////////////
        if (!isValidBody(body))  return res.status(400).send({ status: false, message: "Body cannot be empty" })

        ////////////////////////////////// title validation ////////////////////////////////////////
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required" })
        // if (!nameRegex.test(title)) return res.status(400).send({ status: false, message: "Title should only be albhabets" })
        

        ////////////////////////////////// description validation ////////////////////////////////////
        if (!isValid(description)) return res.status(400).send({ status: false, message: "Description should be given" })

        ///////////////////////////////////// price validation //////////////////////////////////////////
        if (!priceRegex.test(price)) return res.status(400).send({ status: false, message: "Enter a valid price amount" })


        //////////////////////////// upload product image in aws and getting the link///////////////////////////
        let uploadedFileURL
        let files = req.files
        if (files && files.length > 0)  uploadedFileURL = await uploadFile(files[0])
        else  res.status(400).send({ message: "No file found. Please add a product image" })

        body["productImage"] = uploadedFileURL


        //////////////////////////////////////// Currency id validation ////////////////////////////////////////////
        if(!currencyId) {
            body.currencyId = "INR"
        }else{
        if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "currencyId is required" })
        if (!isValidCurrencyID(currencyId)) return res.status(400).send({ status: false, message: "Please enter a valid currency format as INR" })
        }
        

        //////////////////////////////////////// Currency format validation ////////////////////////////////////////
        if(!currencyFormat){
            body.currencyFormat = "₹"
        }else{
        if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "currencyFormat is required" })
        if (!isValidCurrencyFormat(currencyFormat)) return res.status(400).send({ status: false, message: "Please enter a valid currency format as ₹" })
        }

        /////////////////////////////////////////// isFreeShipping ///////////////////////////////////////////////////////
        if("isFreeShipping" in req.body){
        if (isFreeShipping !== "true" && isFreeShipping !=="false") return res.status(400).send({ status: false, message: "isFreeShipping should have only true or false" })}

        ////////////////////////////////////////// style validation ////////////////////////////////////////////////////////
        if("style" in body){
            if (!isValid(style)) return res.status(400).send({ status: false, message: "style should be valid" })
        }

        /////////////////////////////////////// available size validation /////////////////////////////////////////
        if (!availableSizes) return res.status(400).send({ status: false, message: "Available sizes mandatory" })
    
                availableSizes = availableSizes.trim().split(",").map(sbCat => sbCat.trim().toUpperCase())
                body['availableSizes'] = availableSizes
             
        for(let i=0; i<availableSizes.length; i++){
            if (!isValidSize(availableSizes[i])) return res.status(400).send({ status: false, message: "Product sizes should only be 'S', 'XS', 'M', 'X', 'L', 'XXL' or 'XL'" })
        }
    

        //////////////////////////////////////// installment validation ///////////////////////////////////////////////
        if("installments" in body ){
        if (!installmentRegex.test(installments)) return res.status(400).send({ status: false, message: "Enter a valid installment amount" })}


        ////////////////////////////////// checking unique title ///////////////////////////////////////////////////////
        let uniqueTitle = await productModel.findOne({ title: title })
        if (uniqueTitle) return res.status(400).send({ status: false, message: `${title} title already exist` })

        //////////////////////////////////////// Creating new product /////////////////////////////////////////////////
        let productData = await productModel.create(body)
        return res.status(201).send({ status: true, message: "Product created successfully", productData })
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}




const getProduct = async function (req, res) {
    try {
        let data = req.query
        for(let k in data){
            
            if (k.trim() !== "size" && k.trim() !== "name" && k.trim() !== "priceGreaterThan" && k.trim() !== "priceLessThan" && k.trim() !== "priceSort"){
                return res.status(400).send({
                status: false,
                message: "body should only have: size, name, priceGreaterThan, priceLessThan, priceSort",
            })
            }
        }


        let filter = { isDeleted: false }

        if (data.name ) {
            if (!isValid(data.name))
                return res.status(400).send({
                    status: false,
                    message: "Enter a value for product name ",
                })
            filter.title = {}
            filter.title["$regex"] = data.name
            filter.title["$options"] = "i"
            // console.log(filter);
        }
        


        if (data.size ) {
            if (!isValid(data.size))
                return res.status(400).send({
                    status: false,
                    message: "Enter a value for product size ",
                })

            if (data.size) {
                var size = data.size.toUpperCase().split(",") // Creating an array
                if (size.length === 0) {
                    return res.status(400).send({
                        status: false,
                        message: "please provide the product sizes",
                    })
                }

                let filteredsize = data.size.split(",").map(ele => ele.toUpperCase().trim())
                let enumSize = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                for (let i = 0; i < filteredsize.length; i++) {
                    if (!enumSize.includes(filteredsize[i])) {
                        return res.status(400).send({
                            status: false,
                            message: `Sizes should be ${enumSize} value (with multiple value please give saperated by comma)`
                        })
                    }
                }
            
            filter.availableSizes = {}        
            filter.availableSizes["$in"] = filteredsize
        }
    }

        if (data.priceGreaterThan === "" || data.priceLessThan === "")
            return res.status(400).send({ status: false, message: "Price cant be empty" })

        if (data.priceGreaterThan || data.priceLessThan) {
            if (data.priceGreaterThan) {
                if (!isValid(data.priceGreaterThan))
                    return res.status(400).send({
                        status: false,
                        message: "Enter a valid product price ",
                    })
                let numGte = Number(data.priceGreaterThan)
                if (!/^\d*\.?\d*$/.test(numGte))
                    return res.status(400).send({
                        status: false,
                        message: "Enter a valid value and must be number for price greater than ",
                    })
            }

            if (data.priceLessThan) {
                let numLte = Number(data.priceLessThan)
                if (!/^\d*\.?\d*$/.test(numLte))
                    return res.status(400).send({
                        status: false,
                        message: "Enter a valid value and must be number  for price less than ",
                    })
            }

            filter.price = {}
         
                if (data.priceGreaterThan) filter.price["$gt"] = data.priceGreaterThan
                if (data.priceLessThan) filter.price["$lt"] = data.priceLessThan
            // }
        }

        //TODO : sort product based on price
        let sortedprice = data.priceSort

        if (sortedprice) {
            if (!sortedprice.match(/^(1|-1)$/))
                return res.status(400).send({ status: false, message: "priceSort must be 1 or -1" })
        }
        // console.log(filter);
        
        const getProduct = await productModel.find(filter).sort({ price: sortedprice }) //collation is use to make sorting case incasesentive

        if (!getProduct.length) {
            return res.status(404).send({ status: false, message: "Product not found" })
        }

        return res.status(200).send({ status: true, itemFound:getProduct.length, message: "Success", data: getProduct })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


const getproductDetails = async function (req, res) {
    try {

        let productid = req.params.productId
        if ((!ObjectId.isValid(productid))) {
            return res.status(400).send({ status: false, message: "Bad Request. ProductId invalid" })
        }

        let product = await productModel.findById(productid).select({__v:0})
        if (!product) return res.status(404).send({ status: false, message: "No such product Exits" })

        if (product.isDeleted == true) {
            return res.status(404).send({ status: false, message: "product is not Present" })
        }
        return res.status(200).send({ status: true, message: "Success", data: product })
    }
    catch (error) {
        res.status(500).send({ message: "Error", error: error.message })
    }
}



const deleteProduct = async function (req, res) {
    try {

        const productId = req.params.productId
     
        if ((!ObjectId.isValid(productId))) {
            return res.status(400).send({ status: false, message: "Bad Request. ProductId invalid" })
        }

        const product = await productModel.findOneAndUpdate({ _id: productId, isDeleted:false }, { $set: { isDeleted: true, deletedAt: new Date() } })

        if (!product) return res.status(404).send({ status: false, msg: "productId is not Exist" })

        return res.status(200).send({ status: true, msg: "product is Successfully Deleted" })
    }

    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

const updateProduct=async function(req,res){
    try{
        let body=req.body;
        let productId = req.params.productId;

         if (!isValidBody(body) && !req.files)  return res.status(400).send({ status: false, message: "Body cannot be empty" })

         if ((!ObjectId.isValid(productId))) {
            return res.status(400).send({ status: false, message: "Bad Request. ProductId invalid" })
        }
 
        let { title, description, price, isFreeShipping, style, availableSizes, installments } = body
          
        if("description" in body){
         if (!isValid(description)) return res.status(400).send({ status: false, message: "Description should be given" })
        }
        if("price" in body){
        if (!priceRegex.test(price)) return res.status(400).send({ status: false, message: "Enter a valid price amount" })
        }
        if ("isFreeShipping" in body){
        if (isFreeShipping !== "true" && isFreeShipping !=="false") return res.status(400).send({ status: false, message: "isFreeShipping should have only true or false" })
        }

        let uploadedFileURL
        let files = req.files
        if (files && files.length > 0)  
        uploadedFileURL = await uploadFile(files[0])

        if("style" in body){
            if (!isValid(style)) return res.status(400).send({ status: false, message: "style should be valid" })
        }
        if("availableSizes" in body){
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "available sizes should be valid" })

            availableSizes = availableSizes.toUpperCase().trim().split(",").map(sbCat => sbCat.trim())
            for(let i=0; i<availableSizes.length; i++){
                if (!isValidSize(availableSizes[i])) return res.status(400).send({ status: false, message: "Product sizes should only be 'S', 'XS', 'M', 'X', 'L', 'XXL' or 'XL'" })
            }
        }

        if("installments" in body){
            if (!installmentRegex.test(installments)) return res.status(400).send({ status: false, message: "Enter a valid installment amount" })
        }

        if ("title" in body) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required" })
            let Title = await productModel.findOne({ title: title })
            if (Title) return res.status(400).send({ status: false, message: `${title} title is already exists` })
        } 
       
        const dataToUpdate = { title, description, price, isFreeShipping, style, installments, uploadedFileURL }

        let findProduct = await productModel.findOneAndUpdate({ _id: productId, isDeleted: false }, { $set: dataToUpdate , $addToSet:{ availableSizes: availableSizes }}, { new: true })

        if(!findProduct) return res.status(404).send({status:false,message:"product not found"})


        return res.status(200).send({ status: true, message: "Updated successfully", data: findProduct })
    }catch(err){
        // console.log(err)
        return res.status(500).send({ status: false, message:err.message})
    }
}


module.exports = { createProduct, getProduct, getproductDetails, deleteProduct,updateProduct }
