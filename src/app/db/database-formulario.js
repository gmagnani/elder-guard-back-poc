import {sql} from '../db/db';

export class DatabaseFormulario{
    async getFormularios(){
        const formularios = await sql`SELECT * FROM formulario`;
    return formularios;
    }
    async criarFormulario(formulario, questaoId){
        const {nome, tipo, descricao, ordem, } = formulario;
        await sql`INSERT INTO formulario (nome, tipo, descricao, ordem, questao_id) VALUES(${nome}, ${tipo}, ${descricao}, ${ordem},${questaoId} )`;
    }

    async alterarFormulario(id, formulario){
        const {nome, tipo, descricao, ordem} = formulario;
        await sql`UPDATE formulario SET nome = ${nome}, tipo = ${tipo}, descricao = ${descricao}, ordem=${ordem} WHERE id=${id}`;
    }

    async deletarFormulario(id){
        await sql`DELETE FROM formulario WHERE id=${id}`;
    }
}