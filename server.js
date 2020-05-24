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

//merge starts here
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
app.get('/api/Master', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select mi.id as id, asp.aspek as aspek, asp.komponen_aspek as komponen_aspek, mi.nama as nama_indikator, mi.deskripsi as deskripsi, dd1.nama as pembilang, dd2.nama as penyebut, mi.default_bobot as default_bobot from masterindikator mi, datadasar dd1, datadasar dd2, aspek asp where mi.id_aspek=asp.id and dd1.id=mi.id_pembilang and dd2.id=mi.id_penyebut', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
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

app.get('/api/DataDasar', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from DataDasar', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
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

//real code starts here 
app.post('/api/JenisSatker', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into JenisSatker values ('"+req.body.nama+"','"+req.body.create+"','"+req.body.update+"','"+req.body.expired+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/JenisSatker', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from JenisSatker', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.put('/api/JenisSatker/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update JenisSatker set nama='"+req.body.nama+"', last_update='"+req.body.update+"', expired_date='"+req.body.expired+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/JenisSatker/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from JenisSatker where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});

//real code starts here 
app.post('/api/MasterIndikator', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into MasterIndikator values ('"+req.body.aspek+"','"+req.body.pembilang+"','"+req.body.penyebut+"','"+req.body.nama+"','"+req.body.deskripsi+"','"+req.body.default_bobot+"','"+req.body.create+"','"+req.body.update+"','"+req.body.expired+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/MasterIndikator', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from MasterIndikator', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.put('/api/MasterIndikator/:id', function (req, res) {
    console.log(req.body)
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update MasterIndikator set id_aspek='"+req.body.aspek+"',id_pembilang='"+req.body.pembilang+"',id_penyebut='"+req.body.penyebut+"',nama='"+req.body.nama+"',deskripsi='"+req.body.deskripsi+"',default_bobot='"+req.body.defaultbobot+"',last_update='"+req.body.update+"',expired_date='"+req.body.expired+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/MasterIndikator/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from MasterIndikator where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});

//real code starts here 
app.post('/api/Periode', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into Periode values ('"+req.body.nama+"','"+req.body.create+"','"+req.body.update+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/Periode', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Periode', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.put('/api/Periode/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update Periode set nama='"+req.body.nama+"', last_update='"+req.body.update+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/Periode/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from Periode where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
//real code starts here 
app.post('/api/Indikator_Periode', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into Indikator_Periode values ('"+req.body.id_master+"','"+req.body.id_periode+"','"+req.body.bobot+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/Indikator_Periode', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Indikator_Periode', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.put('/api/Indikator_Periode/:id&:id2', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update Indikator_Periode set id_master='"+req.body.id_master+"', id_periode='"+req.body.id_periode+"', bobot='"+req.body.bobot+"' where id_master='"+req.params.id+"' and id_periode='"+req.params.id2+"'", function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/Indikator_Periode/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from Indikator_Periode where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
//real code starts here 
app.post('/api/SatuanKerja', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();    
        request.query("insert into SatuanKerja values ('"+req.body.id+"','"+req.body.id_jenis+"','"+req.body.id_induk+"','"+req.body.nama+"','"+req.body.email+"','"+req.body.create+"','"+req.body.update+"','"+req.body.expired+"','"+req.body.level+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/SatuanKerja', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from SatuanKerja', function (err, recordset) {
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

app.put('/api/SatuanKerja/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update SatuanKerja set id_induk_satker='"+req.body.id_induk+"', id_jns_satker='"+req.body.id_jenis+"',nama='"+req.body.nama+"',email='"+req.body.email+"', last_update='"+req.body.update+"', expired_date='"+req.body.expired+"', level_unit='"+req.body.level+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/SatuanKerja/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from SatuanKerja where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
//real code starts here 
app.get('/api/CapaianUnit', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Capaian_Unit', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

app.post('/api/CapaianUnit', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into Capaian_Unit values ('"+req.body.id_satker+"','"+req.body.DataDasar_id+"','"+req.body.waktu+"','"+req.body.capaian+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.put('/api/CapaianUnit/', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update Capaian_Unit set id_datadasar='"+req.body.id_datadasar+"', id_satker='"+req.body.id_satker+"', waktu='"+req.body.waktu+"', capaian='"+req.body.capaian+"' where id_datadasar='"+req.body.pid_datadasar+"'AND id_satker='"+req.body.pid_satker+"' AND waktu='"+req.body.pwaktu+"' AND capaian='"+req.body.pcapaian+"'", function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/CapaianUnit/', function (req, res) {
    console.log(req.body)
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("Delete from Capaian_Unit where id_datadasar='"+req.body.pid_datadasar+"'AND id_satker='"+req.body.psatker+"' AND waktu='"+req.body.pwaktu+"' AND capaian='"+req.body.pcapaian+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
//real code starts here 
app.post('/api/Indikator_SatuanKerja', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();    
        request.query("insert into Indikator_SatuanKerja values ('"+req.body.id_periode+"','"+req.body.id_master+"','"+req.body.id_satker+"','"+req.body.bobot+"','"+req.body.target+"','"+req.body.capaian+"','"+req.body.update+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/Indikator_SatuanKerja', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Indikator_SatuanKerja', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});


app.put('/api/Indikator_SatuanKerja/:id&:id1&:id2', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update Indikator_SatuanKerja set id_periode='"+req.body.id_periode+"', id_master='"+req.body.id_master+"' ,id_satker='"+req.body.id_satker+"', bobot='"+req.body.bobot+"', target='"+req.body.target+"', capaian='"+req.body.capaian+"', last_update='"+req.body.update+"'  where id_periode='"+req.params.id+"' AND id_master='"+req.params.id1+"' AND id_satker='"+req.params.id2+"'", function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/Indikator_SatuanKerja/:id&:id1&:id2', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from Indikator_SatuanKerja where id_periode='"+req.params.id+"' AND id_master='"+req.params.id1+"' AND id_satker='"+req.params.id2+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});

app.get('/api/Log_Indikator_SatuanKerja', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from indikator_satuankerja_log', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});
//real code starts here 
app.post('/api/Aspek', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("insert into Aspek values ('"+req.body.aspek+"','"+req.body.komponen+"')", function (err) {
            if (err) console.log(err)
        });
    });
  });

app.get('/api/Aspek', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query('select * from Aspek', function (err, recordset) {
            if (err) console.log(err)
            res.send(recordset.recordset);
        });
    });
});

app.put('/api/Aspek/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("update Aspek set aspek='"+req.body.aspek+"', komponen_aspek='"+req.body.komponen+"' where id="+req.params.id, function (err) {
            if (err) console.log(err)
        });
    });
});

app.delete('/api/Aspek/:id', function (req, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query("delete from Aspek where id='"+req.params.id+"'", function (err) {
            if (err) console.log(err)
        });
        console.log('Deleted!')
    });
});
//only Others
app.get('/', function (req, res) {
  res.send('Hello World');
});
/*
var server = app.listen(port, hostname, function () {
    console.log('Server is running..');
});*/
https.createServer({
    key: fs.readFileSync(__dirname+'/carwima.github.io.key', 'utf8'),
    cert: fs.readFileSync(__dirname+'/carwima.github.io.cert', 'utf8')
  }, app)
  .listen(port, hostname, function () {
    console.log('Example app listening on port 3000! Go to https://'+hostname+':'+port+'/')
  })