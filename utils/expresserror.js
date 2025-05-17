
class ExpressError extends Error{
//Error is the universal error class
constructor(statuscode,message){
    super();//to invoke the parent class constructor i.e error class
    //and that will return errorcode and message according to passing argument
this.statuscode=statuscode;
this.message=message;
}

}

module.exports=ExpressError;