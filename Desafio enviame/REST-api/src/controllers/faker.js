//SE generean envios falsos en formato json usando la biblioteca faker.

const faker = require('faker/locale/es');
const fs = require('fs');                       //Este modulo permite crear un archivo.
const { random } = require('faker/locale/es');


//const carri = ['Correos de Chile','Chilexpress','Starken','BlueExpress','Atenas','Shipit','Shippify','Enviame','Muvsmart','TodoVa'];
const serv_tip = ['free','normal','express']


function random_value(val) {                                    //Selecciona al azar de un arreglo pre definido
   return val[Math.floor(Math.random() * val.length)];
}

function generateEnvio(){
        //shiping_order
        const imp_id = faker.random.number(9999999999999)/*faker.random.uuid()*/;  //"Mensaje carrier: Número referencia debe ser menor o igual a 24 dígitos y no vacío."
        const o_price = faker.commerce.price();
        const n_package = '1'/*faker.random.number(3)*/;        //"El carrier no acepta multibulto"
        const description = faker.commerce.productName();
        const typenvi = 'delivery';
        const peso = faker.random.number(100);
        const volumen = faker.random.number(100);
        //shipping_destination
            //customer
        const nombre = faker.name.firstName()+' '+faker.name.lastName();
        const tel = faker.phone.phoneNumber();
        const correo = faker.internet.email();
            //delivery_address
                //home_address
        const local = 'Providencia'
        const addr = faker.address.streetAddress();
        const inf = '';
        //shipping_origin
        const ware_code = 'cod_bod';
        //carrier
        const carr_code = 'CCH'/*random_value(carri)*/;  //"The carrier_code does not belongs to company.",
        const service = random_value(serv_tip);
        const tra_num = '';

            let shipping_order= {
                imported_id: imp_id,
                order_price: o_price,
                n_packages: n_package,
                content_description: description,
                type: typenvi,
                weight: peso,
                volume: volumen
            };
            let shipping_destination= {
                customer: {
                    name: nombre,
                    phone: tel,
                    email: correo
                },
                delivery_address: {
                    home_address: {
                        place: local,
                        full_address: addr,
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
            }
     
    return{shipping_order,shipping_destination,shipping_origin,carrier}
}


//const generatedData = generateEnvio()
//fs.writeFileSync('input.json',JSON.stringify(generatedData,null, "\t"));

exports.generateEnvio =generateEnvio;
