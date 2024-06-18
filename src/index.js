const { getEstatus, createEstatus, updateEstatus } = require("./monitoreo/monitoreo");
const { transcribe, readFiles } = require("./transcripcion/transcripcion");

var cron =  require('node-cron');
const fs = require('fs');
const path = require('path');

const regex = /\d{4}-\d{2}-\d{2}/;

const task = cron.schedule('*/10 * * * * *', () => {
    console.log('running a task every 10 seconds');
    main();
});

// task.start();

async function main() {
    const {ok, data} = await getEstatus();
    if(!ok){
        const pendingPath = path.join(__dirname, '../toprocess');
        const files = fs.readdirSync(pendingPath);

        if(files.length === 0){
            console.log('No hay archivos pendientes');
            return;
        }

        const nombre_archivo = files[0].split('.')[0];
        const fecha = nombre_archivo.match(regex)[0];
        // const nombre_sesion = nombre_archivo.replace(`SB-${fecha}-`, '');

        const response = await createEstatus({nombre_archivo: nombre_archivo, estado: 'pending'});

        if(response.ok){
            readFiles(nombre_archivo, fecha);
        }
    }
}

main();

// async function start(){
//     task.stop();
// }