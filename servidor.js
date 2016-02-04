'use strict';

const http = require( 'http' ),
fs   = require('fs'),
port = 3000;

try{
   fs.accessSync( 'arquivos', fs.F_OK );
}catch (e){
   fs.mkdirSync( 'arquivos' );
}

http.createServer( function( req, res ){

   var path = 'arquivos' + req.url;

   try{
      fs.accessSync( path, fs.R_OK );

      if( fs.lstatSync( path ).isDirectory() ){
         res.writeHeader( 200, { "Content-Type": "text/html;charset=utf-8" } );
         try{
            var indexPath = path + '/index.html';
            res.write( fs.readFileSync( indexPath, 'utf-8' ) );
         }catch(e){
            var files = fs.readdirSync(path);
            files.forEach(file =>{
               res.write('<a href="' + req.url + '/' + file + '">' + file + '</a><br>' );
            });
         }
      }else{
         var typeFile = path.split(".");
         switch(typeFile[typeFile.length-1]){
            case 'css':
               res.writeHeader(200, {"Content-Type": "text/css"});
               break;
            case 'html':
               res.writeHeader(200, {"Content-Type": "text/html;charset=utf-8"});
               break;
            case 'jpg':
               res.writeHeader(200, {"Content-Type": "image/jpeg"});
               break;
            case 'png':
               res.writeHeader(200, {"Content-Type": "image/png"});
               break;
            case 'gif':
               res.writeHeader(200, {"Content-Type": "image/gif"});
               break;
          }
          res.write(fs.readFileSync(path));
      }
   } catch(e){
      res.writeHeader(404, {"Content-Type": "text/html;charset=utf-8"});
      res.write( fs.readFileSync( 'arquivos/not_found.html' ) );
   }

   res.end();

}).listen(port, () => {
    console.log('Waiting in port: ' + port );
});
