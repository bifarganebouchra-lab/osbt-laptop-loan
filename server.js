console.log("SERVER.JS EST BIEN LANCÉ");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "stage"
});

db.connect((err) => {
    if (err) {
        console.error("Erreur connexion Mysql:", err);
        return;
    } else {
        console.log("Connecté avec succes à mysql");
    }
});

app.get("/", (req, res) => {
    res.send("Server node fonctionne");
});


// voir tous les emprunts
app.get("/loans", (req, res) => {

    console.log("Route /loans appelée");

    db.query("SELECT * FROM dev10", (err, results) => {
        if (err) {
            console.error("Erreur SQL :", err);
            return res.status(500).send("Erreur SQL");
        } else {
            res.json(results);
        }
    });

});


// ajouter un emprunt
app.post("/loans", (req, res) => {

    const { student_name, pc_number } = req.body;

    const sql = `
    INSERT INTO db20 (student_name, pc_number, status)
    VALUES (?, ?, 'demande')
    `;

    db.query(sql, [student_name, pc_number], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Erreur SQL");
        }

        res.send("Demande envoyée avec succès");

    });

});


// retour du pc
app.put("/loans/:id/return", (req, res) => {

    const loanId = req.params.id;
    const { return_state, return_note } = req.body;
    const returnDate = new Date();

    const sql = `
    UPDATE db20
    SET
    return_date = ?,
    return_state = ?,
    return_note = ?,
    status = 'returned'
    WHERE id = ?
    `;

    db.query(sql, [returnDate, return_state, return_note, loanId], (err, result) => {

        if (err) {
            console.error(err);
            res.status(500).send("Erreur lors du retour");
        } else {
            res.send("PC retourné avec succès !");
        }

    });

});


// 🟢 route pour le formulaire HTML
app.post("/retour", (req, res) => {

    const { nom, numeropc, numerocharje } = req.body;

    const sql = `
    INSERT INTO db20
    (student_name, pc_number, charger_number, status)
    VALUES (?, ?, ?, 'demande')
    `;

    db.query(sql, [nom, numeropc, numerocharje], (err, result) => {

        if (err) {
            console.error(err);
            return res.status(500).send("Erreur SQL");
        } else {
            res.send("Demande enregistrée");
        }

    });

});


app.listen(3000, () => {
    console.log("Serveur lancé sur http://localhost:3000");
});





