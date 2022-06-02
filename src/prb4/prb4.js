
    
    const _ = require("lodash");
    
    let arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const months = console.log(_.chunk(arr, 3))
    
    
    let odd = [1,3,5,7,9,11,13,15,17,19]
    const number = console.log(_.tail(odd))
    
     
     const unique = (_.union([2,4,6],[2,6,10],[1,3,5],[1,5,8],[3,6,9]))
     console.log(unique)
    
     
    let array = ([["horror","The Shining"],["drama","Titanic"],["thriller","Shutter Island"],["fantasy","Pans Labyrinth"]])
    const object = console.log(_.fromPairs(array))
    
    
    
    module.exports.number = number
    module.exports.months = months
    module.exports.unique = unique
    module.exports.object = object
