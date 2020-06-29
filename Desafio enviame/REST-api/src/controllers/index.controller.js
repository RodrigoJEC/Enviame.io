const {Pool} = require('pg');                                          //Crea conjunto de conecciones
const fs = require('fs');                       //Este modulo permite crear un archivo.
const fake = require('./faker.js');          //retorna json generado aleatoriamente.


const conexion =async () => {
    try{                                            //Verifica si existen errores en este bloque de codigos
        const pool = new Pool({                     //se guarda en una constante para reutilizar
            host: 'localhost',                      //el servidor se encuentra en el mismo pc
            user: 'postgres',                       //usuario por defecto
            password: '123456',                     //contraseña asignada
            database: 'EnviameIO',                  //nombre de base de datos
        });
        await pool.connect();
        return pool;                                // regresa la coneccion
    }
    catch (err) {                           //Ejecutar en caso de error
        console.log(err);
    }
};

const getEnviosByID = async(req, res) =>{
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    const response = await sesion.query('SELECT * FROM envios WHERE id = $1',[req.params.id]);
    res.json((await response).rows);
};

const tiempo = async (req, res) =>{
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    const dist = await sesion.query('SELECT distancia FROM envios WHERE id = $1',[req.params.id]);
    const numero = JSON.parse(JSON.stringify(dist));
    const valor = numero.rows[0].distancia;

    const valint = parseInt(valor,10)
    if(valint<=100){
        res.send('El tiempo de en trega es 0 dias')
    }
    else{
        var n_value = Math.floor(valint/100);
        var dias = (Math.pow(1.6180034,n_value)-Math.pow(-0.6180034,n_value))/Math.sqrt(5);
        res.send(`La entrega se realizara en ${Math.round(dias)} dias`);
        console.log(Math.round(dias));
    }
}

const putdistancia = async(req, res) =>{
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    const response =await sesion.query('UPDATE envios Set distancia = Round(((2000) * Random()) + 1)');
    res.send('Distancias agregadas')
}

const deleteEnvio = async(req, res) =>{
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    //res.send('delte envio: ' + req.params.id)
    const response =await sesion.query('DELETE FROM envios WHERE id = $1',[req.params.id]);
    res.json('Envio ID: '+req.params.id+' eliminado exitosamente');
};

const updatereg = async (req, res)=>{
    const id= req.params.id;
    const 
    {
        imported_id,
        price,
        n_paquete,
        description,
        peso,
        volumen,
        name,
        phone,
        email,
        locacion,
        address,
        inf,
        ware_code,
        carr_code,
        service,
        tra_num
    }= req.body;
    //console.log(id,imported_id,price,n_paquete,description,peso,volumen,name,phone,email,locacion,address,inf,ware_code,carr_code,service,tra_num);
    //console.log(name);
    let shipping_order= {
        imported_id: imported_id,
        order_price: price,
        n_packages: n_paquete,
        content_description: description,
        type: 'delivery',
        weight: peso,
        volume: volumen
    };
    let shipping_destination= {
        customer: {
            name: name,
            phone: phone,
            email: email
        },
        delivery_address: {
            home_address: {
                place: locacion,
                full_address: address,
                information: inf
            }
        }
    };
    let shipping_origin = {
        warehouse_code: ware_code
    };
    let carrier = {
        carrier_code: carr_code,
        carrier_service: service,
        tracking_number: tra_num
    };

    //console.log(JSON.stringify({shipping_order,shipping_destination,shipping_origin,carrier}));

    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    try {                                   //esta seccion prueba el ingresar el archivo json en la base de datos
        const response = await fetch('https://stage.api.enviame.io/api/s2/v2/companies/620/deliveries', {       //Usa fetch() para enviar una petición POST con datos codificados en JSON .                method: 'POST',
        method: 'POST',
        body: JSON.stringify({shipping_order,shipping_destination,shipping_origin,carrier}),
        headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'api-key': '798171c39baf6fd212aaacacc5793b8e'
                }
            }
            );
            const json = await response.json();
            sesion.query('UPDATE envios SET registro = $1 WHERE id = $2',[json,id]);
            console.log("Guardado exitoso: ");
    //res.send('EXITO revise registros en ruta http://localhost:4000/envios');
    }
    catch (err) {                           // en caso de error se anuncia por consola
        console.log("Error en proceso "+err);
    }
    res.send('Verifique cambios');
};

const getEnvio = async (req, res) =>{
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }                                      //Crea ruto a travez del metodo GET. Cuando entre en la ruta /envios reponde algo.
    const response = await sesion.query('SELECT * FROM envios');                              //A traves de un pool realizo una consulta query
    res.status(200).json(response.rows);
    //await sesion.end();
};

const fetch = require('node-fetch');        //proporciona una interfaz JavaScript para acceder y manipular partes del canal HTTP
const { match } = require('assert');

const registro = async (req, res)=>{
    try{
        const sql = 'INSERT INTO envios(registro) VALUES ($1)';
        const values = [JSON.stringify(res)];
        const respuesta = await req.query(sql,values);//guarda respuesta en constante response
        return respuesta;
    }
    catch(err){
        console.log(err);
        return null;
    }
    
};

const generar = async (req,res) => {
    const sesion = await conexion();        //establece coneccion 
    if (sesion === null) {
        console.log("No se pudo conectar"); // muestre mensaje en caso de fallar la conexion
        return;
    }
    try {                                   //esta seccion prueba el ingresar el archivo json en la base de datos
        for(var i=1; i<=10;i++){
            const datos= fake.generateEnvio()
            const inputdb={datos}
            const response = await fetch('https://stage.api.enviame.io/api/s2/v2/companies/620/deliveries', {       //Usa fetch() para enviar una petición POST con datos codificados en JSON .
                method: 'POST',
                body: JSON.stringify(inputdb),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'api-key': '798171c39baf6fd212aaacacc5793b8e'
                }
            }
            );
            const json = await response.json();
            const responseInsert = await registro(sesion, json);
            if (responseInsert === null){
                console.log("No se pudo insertar la informacion");
            }
            console.log("Guardado exitoso: "+i);
    }
    console.log('fin del ciclo')
    res.send('EXITO revise registros en ruta http://localhost:4000/envios');
    }
    catch (err) {                           // en caso de error se anuncia por consola
        console.log("Error en proceso "+err);
    }
};


module.exports = {
    getEnvio,
    generar,
    getEnviosByID,
    deleteEnvio,
    updatereg,
    putdistancia,
    tiempo
}