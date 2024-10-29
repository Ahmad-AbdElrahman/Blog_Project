const multer = require('multer');
const path = require('path');

// Set storage for the uploaded images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});

// Set file filter to accept only images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (mimeType && extname) {
        return cb(null, true);
    }
    cb("Error: Images Only!");
};

// Limit file size to 5 MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
    fileFilter: fileFilter
});

// 
// Check Login
const authMiddleware = (req, res, next) => {
    const token= req.cookies.token;

    if(!token) {
        return res.status(401).json( { message: 'Unauthorized' } );
    }

    try{
        const decoded = jwt.verify(token, jwtSecret);
        req.userId = decoded.userId;
        next()
    } catch(error) {
        return res.status(401).json( { message: 'Unauthorized' } );
    }
}

module.exports = upload;