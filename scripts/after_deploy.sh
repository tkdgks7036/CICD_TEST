#!/bin/sh
Repo=/home/ubuntu/CICD_TEST
$Repo

sudo npm ci
npm start
pm2 restart app.js