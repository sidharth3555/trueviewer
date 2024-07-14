module.exports=(fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch(next);
    };
};
//without using try catch we use wrapasync
//pass a function to wrapasync it will return a function ,if any error occurs then it will 
//catch that and move to next route