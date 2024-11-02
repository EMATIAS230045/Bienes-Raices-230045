import express from 'express';
const router = express.Router();

router.get("/",function(req,res){
    res.send("Hola mundo desde Node, atraves del Navegador")
})


router.get("/QuienSoy",function(req,res){
    res.json({"Estudiante": "Erick Matias Granillo Mejia",
    "carrera": "TI DSM",
    "grado": "4°",
    "grupo": "A",
    "asignatura": "aplicaciones web orientada a servicios (AWOS)"

})
})

export default router
