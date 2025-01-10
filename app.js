import express from 'express';
import session from 'express-session';
import express from  'express-session';

const app= express();

app.use(
    session({
        secret:'giovany66',
        resave:false,
        saveUninitialized:true,
        cookie:{maxAge:24 *60 *60*100}
    })
)

app.get('/iniciar-sesion',(req,res)=>{
    if(!req.session.inicio){
        req.session.inicio=new date ();
        req.session.ultimoAcceso=new date();
        res.send('Sesion iniciada');
    
    }else{
        res.send('la sesion ya esta activa');

    }
})

app.get('/actualizar',(req,res)=>{
    if(req.session.inicio){
        req.session.ultimoAcceso=new date();
        res.send('fecha de ultima consulta actualizada')
    }else{
        res.send('no hay ninguna sesion activa')
    }
})


    const inicio=req.session.inicio;
    const ultimoAcceso=req.session.ultimoAcceso;
    const ahora=new date();
    
    const antiguedadMs =ahora -inicio;
    const horas=Math.floor(antiguedadMs/(1000 *60*60));
    const minutos=Math.floor((antiguedadMs % (1000 * 60 *60 )));
    const segundos=Math.floor((antiguedadMs % (1000 * 60 *60 )) / 1000);

    res.json({
        mensaje:'estado de la sesion',
        sesionId:req.sesionId,
        inicio:inicio.toISOString(),
        ultimoAcceso:ultimoAcceso.toISOString(),
        antiguedad:`${horas}horas,${minutos}minutos,${segundos}segundos`
        
    });

    




