

////////////////////////////*Validation*//////////////////////////////////////////////////////////////////


const isValid = function(x) {
    if (typeof x === "undefined" || x === null) return false;
    if (typeof x === "string" && x.trim().length === 0) return false;
    return true;
};
const isValidBody = function(x) {
    return Object.keys(x).length > 0;
};

const nameRegex = /^[a-zA-Z\s]+$/

const emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/

const validMobile = /^(\+91)?0?[6-9]\d{9}$/

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,15}$/;

const pinRegex = /^([0-9]){6}$/

const priceRegex = /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/

const installmentRegex = /^[0-9]*$/

const positiveIntigerRegex = /^[1-9]*$/

module.exports ={
    isValid,
    isValidBody,
    nameRegex,
    emailRegex,
    validMobile,
    passwordRegex,
    pinRegex,
    priceRegex,
    installmentRegex,
    positiveIntigerRegex
}