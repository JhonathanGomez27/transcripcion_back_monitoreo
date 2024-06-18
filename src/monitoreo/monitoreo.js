const { monitoreo } = require("../database/monitoreoPg.JS");

const getEstatus = async (req, res) => {
    try {
        const result = await monitoreo.query("SELECT * FROM public.estatussesiones WHERE estado = 'pending'");
        
        // console.log(result.rows);
        if(result.rows.length > 0){
            return {ok: true, data: result.rows};
        }else{
            return {ok: false, data: 'No hay datos'};
        }
        // res.status(200).json(estatus);
    } catch (error) {
        return {ok: false, data: error};
    }
}

const createEstatus = async (data) => {
    try {
        const estatus = data;

        const result = await monitoreo.query("INSERT INTO public.estatussesiones (nombre_archivo, estado) VALUES($1, $2) RETURNING *", [estatus.nombre_archivo, estatus.estado]);
        
        if(result.rows.length > 0){
            return {ok: true, data: result.rows[0]};
        }else{
            return {ok: false, data: 'No se pudo insertar'};
    
        }
        // res.status(200).json(estatus);
    } catch (error) {
        return {ok: false, data: error};
    }
}

const updateEstatus = async (data) => {
    try {
        const estatus = data;

        const result = await monitoreo.query("UPDATE public.estatussesiones SET estado = $1 WHERE nombre_archivo = $2 RETURNING *", [estatus.estado, estatus.nombre_archivo]);
        
        if(result.rows.length > 0){
            return {ok: true, data: result.rows[0]};
        }else{
            return {ok: false, data: 'No se pudo actualizar'};
    
        }
        // res.status(200).json(estatus);
    } catch (error) {
        return {ok: false, data: error};
    }

}

module.exports = { getEstatus, createEstatus, updateEstatus };