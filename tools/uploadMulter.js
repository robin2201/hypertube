/**
 * Created by rberthie on 4/23/17.
 */
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const base64 = require('base64url')

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            fs.accessSync('./public/uploads')
        } catch (e) {
            fs.mkdirSync('./public/uploads')
        }
        cb(null, './public/uploads')
    },
    limits: {
        files: 1,
        fileSize: 1024 * 1024
    },
    filename: (req, file, cb) => {
        let randomName = base64(crypto.randomBytes(42))
        cb(null, randomName + path.extname(file.originalname))
    }
})

let upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg' && ext !== '.JPG') {
            return cb(new Error('Only images are allowed'))
        }
        cb(null, true)
    }
}).single('image')


module.exports = upload;
