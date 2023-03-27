const express = require('express');
const dateRouter = require("./dateRoutes");

const routes = (app) => {
    app.get("/", (req, res) => {
        res.status(200).send({ message: "page running" });
    });

    app.use(
        express.json(),
        dateRouter
    );
};

module.exports = routes