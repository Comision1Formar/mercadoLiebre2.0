module.exports = function(req,res,next){
    if(req.cookies.userMercadoLiebre){
        req.session.usuario = req.cookies.userMercadoLiebre;
        next()
    }else{
        next()
    }
}