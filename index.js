// TODO Dodawanie kolekcj checkt
// TODO Aktualizowanie Jednego Pola checkt
// TODO Aktualizowanie Całego Dokumentu checkt
// TODO Pobieranie Danych z Kolekcji - całego Dokumentu checkt
// TODO Pobieranie Danych z Kolekcji - Jednego Pola UNCHECKT
var mongodb = require('mongodb').MongoClient;

module.exports = function Mongod(dbname)
{
    var _DBNAME = dbname;
    var _DB;
    var Client;

    var URL = 'mongodb://localhost:27017/'+_DBNAME;

    //Nawiązuje połączenie z Bazą Mongo
    //cb() (callback) EMPTY
    this.connect = function connect(cb)
    {
        mongodb.connect(URL, function(err, db)
        {

            if(!err)
            {
                console.log('connected to mongoDB, no errors');
                _DB = db;
                Client = _DB.db(_DBNAME);
                cb();
            }
            else
            {
                console.log('cannot connect to DB '+ err);
            }
        });
    };

    this.isConnected = function isConnected()
    {
        return _DB.isConnected(_DBNAME);
    };

    // Pobiera cały pierwszy dokument z kolekcji który zgadza się z filtrem
    // FROM (string) Nazwa kolekcji
    // WHERE (object) id lub inne pola dokumentu // FILTR
    // cb() (callback) zwraca potwierdzenie
    this.getFirstData = function getFirstData(FROM, WHERE, cb)
    {

        return Client.collection(FROM).findOne(WHERE,function(err, result)
        {
            cb(result);
        });

    };

    // Pobiera cały wszystkie dokumenty z kolekcji które zgadzają się z filtrem
    // FROM (string) Nazwa kolekcji
    // WHERE (object) id lub inne pola dokumentu // FILTR
    // cb() (callback) zwraca potwierdzenie
    this.getData = function getData(FROM, WHERE, cb)
    {

        return Client.collection(FROM).find(WHERE).toArray(function(err, result)
        {
            cb(result);
        });

    };

    //Aktualizuje cały dokument
    // COLLECTION (string) nazwa kolekcji
    // WHERE (object) id lub inne pole dokumentu który ma zaktualizowc
    // WHAT (object) co ma zaktualizować
    // OPTS (object) opcje podczas aktualizacji <- dokumentacja mongoDB function findOneAndUpdate();
    // cb(err, result) (callback) zwraca error i potwierdzenie
    this.updateFirstData = function updateFirstData(COLLECTION,WHERE,WHAT,OPTS,cb)
    {
        var collection = Client.collection(COLLECTION);
        collection.findOneAndUpdate(WHERE,WHAT,OPTS,function (err, result)
        {
            cb(result);
        });
    };

    // Aktualizuje tylko wybrane pola w dokumencie
    // COLLECTION (string) nazwa kolekcji
    // WHERE (object) id lub inne pole dokumentu który ma zaktualizowc
    // WHAT (object) co ma zaktualizować
    this.updateOne = function updateOne(COLLECTION,WHERE,WHAT,cb)
    {
        var collection = Client.collection(COLLECTION);

        var what = {$set:WHAT};

        collection.updateOne(WHERE,what,function(err, res)
        {
            if (err) console.log(err.message);
            cb(res.result.nModified);

        });
    };

    //Zamyka połączenie z bazą
    // cb() (callback) 0 argumentów
    this.close = function close(cb)
    {
        _DB.logout();
        _DB.close();
        cb();
    };

    // Tworzy nową kolekcję
    // NAME (string) Nazwa kolekcji
    // OPTS (object) <- Dokumentacja mongoDB
    this.createCollection = function createCollection(NAME,OPTS)
    {
        Client.createCollection(NAME,OPTS);
    };

    //zwraca nazwy wszystkich kolekcji w bazie
    // cb(kolekcje) (callback)
    this.listCollections = function listCollections(cb)
    {
        var col = [];
        Client.collections(function(err, collections)
        {
            collections.forEach(function (object)
            {
                col.push(object.s.name);

                if(collections.length === col.length)
                {
                    cb(col);
                }
            });
        });

    }
};