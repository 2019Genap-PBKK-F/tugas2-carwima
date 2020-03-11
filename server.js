const hostname = '10.199.14.46';
const port = 8020;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
//const sql = require('mssql');
const sql = require('mssql');
var cors = require('cors');
app.use(cors());
 
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

var config={
  user: 'su',
  password: 'SaSa1212',
  server: '10.199.13.253',
  database:'nrp05111740000098'
}
//real code starts here 
app.get('/api/mahasiswa', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from mahasiswa', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

   
app.get('/api/mahasiswa/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from mahasiswa where id='+req.params.id, function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

app.post('/api/mahasiswa', function (req, res) {
  sql.connect(config, function (err) {
      if (err) console.log(err);
      var request = new sql.Request();
      request.query("insert into mahasiswa values ('"+req.body.nama+"','"+req.body.nrp+"','"+req.body.angkatan+"','"+req.body.tgl_lahir+"','"+req.body.photo+"','"+req.body.aktif+"')", function (err) {
          if (err) console.log(err)
      });
  });
});



app.put('/api/mahasiswa/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        var tgl_lahir = req.body.tgl_lahir.slice(0, 10)
        request.query("update mahasiswa set mhs_nama='"+req.body.nama+"', mhs_nrp='"+req.body.nrp+"', mhs_angkatan='"+req.body.angkatan+"', mhs_tgllahir='"+tgl_lahir+"', photo='"+req.body.photo+"',mhs_aktif='"+req.body.aktif+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
  });

app.delete('/api/mahasiswa/:id', function (req, res) {
  
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from mahasiswa where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
       console.log('Deleted!')
    });
  });

app.get('/', function (req, res) {
  res.send('Hello World');
});

var server = app.listen(port, hostname, function () {
    console.log('Server is running..');
});

//listen for request on port 3000, and as a callback function have the port listened on logged