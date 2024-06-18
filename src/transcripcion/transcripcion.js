const { AssemblyAI } = require('assemblyai');
const fs = require('fs');
const path = require('path');

const { generateMinutes } = require('./orderdata');
// const { updateEstatus } = require('../monitoreo/monitoreo');

if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const client = new AssemblyAI({
    apiKey: process.env.API_KEY_ASSEMBLYAI,
});


const readFiles = async (nombre_archivo, fecha) => {
    const pendingPath = path.join(__dirname, '../../toprocess');

    const files = fs.readdirSync(pendingPath);
    await Promise.all(
        files.map(async file => {
            const pathFile = path.resolve(pendingPath, file);
    
            const params = {
                audio: pathFile,
                language_code: 'es',
                speaker_labels: true,
                speakers_expected: 10
            }
    
            await transcribe(params, nombre_archivo, fecha, file);
        })
    );

    // updateEstatus({nombre_archivo: nombre_archivo, estado: 'completed'});
}

const transcribe = async (params, nombre_archivo, fecha, file) => {
    console.log("trans", file);
    try {
        let transcript = await client.transcripts.submit(params);

        const transcriptResult = await client.transcripts.waitUntilReady(transcript.id, {
            // How frequently the transcript is polled in ms. Defaults to 3000.
            pollingInterval: 1000,
        });

        // console.log(transcriptResult.words);
        console.log(transcriptResult.status);
        if(transcriptResult.status === 'completed'){

            const minutes = await generateMinutes(transcriptResult.words);
            const name = file.split('.')[0];
            const data = {
                sesion : {
                    nombre_sesion: nombre_archivo,
                    fecha: fecha,
                    duracion: '01:30:00'
                },
                transcripcion: minutes
            }

            const dataString = JSON.stringify(data, null, 2);

            await fs.writeFileSync(`${name}.txt`, dataString);

            await moveFiles(params.audio);
        }
    
    } catch (error) {
        console.log(error);
    }
} 


const moveFiles = async (pathFile) => {

    const completedPath = path.join(__dirname, '../../done_files');

    const file = path.basename(pathFile);

    fs.renameSync(pathFile, `${completedPath}/${file}`);
    
}

module.exports = { transcribe, readFiles, moveFiles };