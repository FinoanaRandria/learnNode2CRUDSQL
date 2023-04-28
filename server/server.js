const express = require("express");

const mysql = require("mysql");
const myConnection = require("express-myconnection");
const bodyparser = require("body-parser");
const connection = require("express-myconnection");
const app = express();
const port = 3003;

const optionBd = {
  host: "localhost",
  user: "root",
  password: "",
  port: 3306, //port resever a mysql
  database: "node_bd",
};

//defition du middleware pour la connexion avec la bd

app.set("view engine", "ejs");
app.use(myConnection(mysql, optionBd, "pool"));
//extraction des donne du formulaire
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))

//
//une fois que la connexion soit faite express connexion va ajouter une nouvelle methode a req  getConnexion


//methode get pour recuperer des ressouces venant du servers
app.get("/", (req, res) => {
  req.getConnection((err, connection) => {
    if (err) {
      console.log(err);
    } else {
      // le [] c'est ici ou on stocke les valeur prepare ici c'est vide car y en a pas
      connection.query("SELECT * FROM notes", [], (err, resultat) => {
        if (err) {
          console.log(err);
        } else {
             console.log(resultat);
          res.status(200).render("index", { resultat });
   
           res.end()
        }
      });
    }
  });
});

//methode post pour envoyer des information au servers

app.post('/notes',(req,res)=>{
     const id = req.body.id =="" ? null : req.body.id;
     const titre = req.body.titre
     const description = req.body.description
        
     let reqSql = 
        id === null ? "INSERT INTO notes(id,titre,description) VALUES(?,?,?)" : "UPDATE notes SET titre =? , description =?  WHERE id =?"

let donnes = id ===null ? [null,titre,description]: [titre,description,id]

     req.getConnection((err, connection) => {
        if (err) {
          console.log(err);
        } else {
          // le [] c'est ici ou on stocke les valeur prepare ici c'est vide car y en a pas
          //ici le ?? siginfie les valeur prepare😆
          connection.query(reqSql,donnes, (err, resultat) => {
            if (err) {
              console.log(err);
            } else {
                 console.log(resultat);
              res.status(300).redirect('/');
       
               
            }
          });
        }
      });

})




app.delete('/notes/:id', (req,res)=>{
          
   const id = req.params.id

          req.getConnection((err,connection)=>{
              if(err){
                 console.log(err);
              }else{

                   connection.query("DELETE FROM notes WHERE id=?",[id],(err,resultat)=>{
                    if(err){
                        console.log(err);
                     }else{
                             res.status(200).json({routeRacine:"/"})
                     }
                   })
              }


          })
})



app.listen(port, console.log(`Server is runing on ${port}`));
