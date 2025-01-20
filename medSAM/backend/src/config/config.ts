import 'dotenv/config'

export const config = {
    port: process.env.PORT || 5000,     // port where application will run
    uploadDir: process.env.UPLOAD_DIR || 'uploads',     // folder where all files will be uploaded
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),      // max size of image upload supported
    localhostFrontend: process.env.FRONTEND_PORT|| 3000
}