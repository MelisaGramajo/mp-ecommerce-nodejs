var express = require('express');
var exphbs  = require('express-handlebars');
var mercadopago = require ('mercadopago');
require('dotenv').config()
 
var app = express();
 
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', function (req, res) {
    res.render('detail', req.query);
});

app.get('/success', function (req, res) {
    res.render('success', req.query);
});

app.get('/fail', function (req, res) {
    res.render('fail', req.query);
});

app.get('/pending', function (req, res) {
    res.render('pending', req.query);
});



//Mercado Pago
app.post('/mercadoPago', function (req, res) {
    console.log("QUERY:::",req.query);
    let preference = {
        items: [
            {
                id: 1234,
                title: req.query.title,
                description: "Dispositivo móvil de Tienda e-commerce",
                picture_url: "https://http2.mlstatic.com/celular-samsung-galaxy-m10-liberado-D_NQ_NP_855147-MLA31630524442_072019-F.jpg",
                unit_price: parseInt(req.query.price),
                quantity: parseInt(req.query.unit)
                
                
            }
        ],
        external_reference: 'melisargramajo@gmail.com',
        payer: {
            name: 'Lalo',
            surname: 'Landa',
            email: 'test_user_63274575@testuser.com',
            phone: {
                area_code: "11",
                number: 22223333  
            },
            address: {
                street_name: 'False',
                street_number: 123,
                zip_code: "1111"
            }
        },
        payment_methods: {
            excluded_payment_methods: [
                {
                    id: 'amex'
                }
            ],
            excluded_payment_types: [
                {
                    id: 'atm'
                }
            ],
            installments: 6,
        },
        back_urls: {
            success: "https://melisagramajo-mp-commerce-node.herokuapp.com/success",
            pending: "https://melisagramajo-mp-commerce-node.herokuapp.com/pending",
            failure: "https://melisagramajo-mp-commerce-node.herokuapp.com/fail"
        },
        auto_return: "approved",
        notification_url: "https://melisagramajo-mp-commerce-node.herokuapp.com/",
    };

    mercadopago.preferences.create(preference)
        .then(function (response) {
           res.redirect(response.body.init_point);
        }).catch(function (err) {
            console.log(err);
        });
 

});

  //configure mercado pago
  mercadopago.configure({
    access_token:  process.env.ACCESS_TOKEN,
    integrator_id: process.env.INTEGRATOR_ID
  });

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));
 
const port = normalizePort(process.env.PORT || '3000'); 
app.set('port', port);
app.listen(port);

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }


