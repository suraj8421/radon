const productModel = require('../models/productModel')
const { uploadFile } = require('../aws/fileUpload')
const ObjectId = require('mongoose').Types.ObjectId
const { isValid, isValidBody, nameRegex, emailRegex, validMobile, passwordRegex, pinRegex, priceRegex } = require('../middleware/valid')


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

        /////////////////////////// body validation////////////////////////////////////////////////
        if (!isValidBody(body))  return res.status(400).send({ status: false, message: "Body cannot be empty" })

        ////////////////////////// title validation ////////////////////////////////////////
        if (!isValid(title)) return res.status(400).send({ status: false, message: "Title is required" })
        // if (!nameRegex.test(title)) return res.status(400).send({ status: false, message: "Title should only be albhabets" })
        

        /////////////////////////// description validation ////////////////////////////////////
        if (!isValid(description)) return res.status(400).send({ status: false, message: "Description should be given" })

        /////////////////////////// price validation //////////////////////////////////////////
        if (!priceRegex.test(price)) return res.status(400).send({ status: false, message: "Enter a valid price amount" })


        ////////////////////////// upload product image in aws and getting the link///////////////////////////
        let uploadedFileURL
        let files = req.files
        if (files && files.length > 0)  uploadedFileURL = await uploadFile(files[0])
        else  res.status(400).send({ msg: "No file found. Please add a product image" })

        body["productImage"] = uploadedFileURL


        ////////////////////////////// Currency id validation ///////////////////////
        if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "currencyId is required" })
        if (!isValidCurrencyID(currencyId)) return res.status(400).send({ status: false, message: "Please enter a valid currency format as INR" })
        
        

        ////////////////////////////// Currency format validation///////////////////////
        if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "currencyFormat is required" })
        if (!isValidCurrencyFormat(currencyFormat)) return res.status(400).send({ status: false, message: "Please enter a valid currency format as ₹" })

        ///////////////////////////////isFreeShipping///////////////////////////////////////////////////////
        if (isFreeShipping !== "true" && isFreeShipping !=="false") return res.status(400).send({ status: false, message: "isFreeShipping should have only true or false" })

        ///////////////////////////////style validation ////////////////////////////////////////////////////////
        if(style){
            if (!isValid(style)) return res.status(400).send({ status: false, message: "style should" })
        }

        /////////////////////////// available size validation //////////////////////////
        if (availableSizes) {
            availableSizes = availableSizes.trim()
            // if (availableSizes[0] === "[" && availableSizes[availableSizes.length-1] === "]"){
            // availableSizes = JSON.parse(availableSizes);
            //     if (Array.isArray(availableSizes)) {
            //         validProductData['availableSizes'] = [...availableSizes]
            //      }else{
            //         return res.status(400).send({ status: false, message: "enter proper format in availableSize column as ['S', 'XL']" })
            //      }
            //  } else {
                availableSizes = availableSizes.split(",").map(sbCat => sbCat.trim())
                body['availableSizes'] = availableSizes
        //     }
        }
        console.log(availableSizes);
        for(let i=0; i<availableSizes.length; i++){
            if (!isValidSize(availableSizes[i])) return res.status(400).send({ status: false, message: "Product sizes should only be 'S', 'XS', 'M', 'X', 'L', 'XXL' or 'XL'" })
        }

        /////////////////////////////installment validation////////////////////////////////////////////////////
        if (!priceRegex.test(installments)) return res.status(400).send({ status: false, message: "Enter a valid installment amount" })



        //////////////////////checking unique title///////////////////////////////////////////////////////
        let uniqueTitle = await productModel.findOne({ title: title })
        if (uniqueTitle) return res.status(400).send({ status: false, message: `${title} title already exist` })

        ////////////////////////////// Creating new product /////////////////////////////////////////////////
        let productData = await productModel.create(body)
        return res.send({ status: true, message: "User created successfully", productData })
    } catch (error) {
        return res.status(500).send({ message: "Server side Errors. Please try again later", error: error.message })
    }
}


module.exports = {createProduct}
