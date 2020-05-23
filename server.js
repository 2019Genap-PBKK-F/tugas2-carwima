//const hostname = '127.0.0.1';
const hostname = '10.199.14.46';
const fs = require('fs')
const https = require('https')
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
  user: 'sa',
  password: 'SaSa1212',
  server: '10.199.13.253',
  database:'nrp05111740000098'
}

app.get('/api/dosen', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from dosen', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
app.get('/api/dosen', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from dosen', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
app.get('/api/penelitian', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from penelitian', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
app.get('/api/publikasi', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from publikasi', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
app.get('/api/abmas', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from abmas', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

app.get('/api/login/:id1&:id2', function (req, res) {
    if(req.params.id1==req.params.id2){
    sql.connect(config, function (err) {
        if (err) console.log(err);
        console.log(req.params.id1);
        var request = new sql.Request();
        request.query("select * from SatuanKerja where email= '"+req.params.id1+"'", function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
    }
    else res.send(null);
});

app.get('/api/Kontak_kinerja/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("select aspek.aspek, aspek.komponen_aspek, MasterIndikator.nama, round(Indikator_SatuanKerja.bobot,3) as bobot, round(Indikator_SatuanKerja.target,3) as target, CONCAT(round(Indikator_SatuanKerja.capaian, 3), CONCAT('(',CONCAT(round(Indikator_SatuanKerja.capaian/(Indikator_SatuanKerja.target+0.01),1),'%)'))) as capaian from indikator_satuankerja left join indikator_periode on Indikator_SatuanKerja.id_master = indikator_periode.id_master left join MasterIndikator on masterindikator.id = Indikator_SatuanKerja.id_master left join Aspek on aspek.id = MasterIndikator.id_aspek where indikator_satuankerja.id_satker='"+req.params.id+"'  order by aspek.id", function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

app.get('/api/jmlAspek/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("select aspek.id, count(aspek.id) as jumlah from indikator_satuankerja left join indikator_periode on Indikator_SatuanKerja.id_master = indikator_periode.id_master left join MasterIndikator on masterindikator.id = Indikator_SatuanKerja.id_master left join Aspek on aspek.id = MasterIndikator.id_aspek where indikator_satuankerja.id_satker='"+req.params.id+"' group by aspek.id order by aspek.id", function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.get('/api/satkername/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("select distinct indikator_satuankerja.id_satker as id, nama from indikator_satuankerja left join satuankerja on Indikator_SatuanKerja.id_satker = SatuanKerja.id where satuankerja.id_induk_satker='"+req.params.id+"' or SatuanKerja.id='"+req.params.id+"' order by SatuanKerja.nama desc", function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
/*
//real code starts here 
app.post('/api/DataDasar', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into DataDasar values ('"+req.body.nama+"','"+req.body.create+"','"+req.body.update+"','"+req.body.expired+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });



app.put('/api/DataDasar/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update DataDasar set nama='"+req.body.nama+"', last_update='"+req.body.update+"', expired_date='"+req.body.expired+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/DataDasar/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from DataDasar where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
*/
//only Others
app.get('/', function (req, res) {
  res.send('Hello World');
});
/*
var server = app.listen(port, hostname, function () {
    console.log('Server is running..');
});*/
https.createServer({
    key: fs.readFileSync('carwima.github.io.key', 'utf8'),
    cert: fs.readFileSync('carwima.github.io.cert', 'utf8')
  }, app)
  .listen(port, hostname, function () {
    console.log('Example app listening on port 3000! Go to https://localhost:3000/')
  })