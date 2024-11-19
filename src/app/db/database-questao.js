import {sql} from '../db/db';

export class DatabaseQuestao{
    async getQuestoes(){
        const questoes = await sql`SELECT * FROM questao`;
    return questoes;
    }

    async criarQuestao(questao){
        const {titulo, descricao, tipo} = questao;
        
        const [novaQuestao] = await sql`
        INSERT INTO questao (titulo, descricao, tipo) 
        VALUES (${titulo}, ${descricao}, ${tipo})
        RETURNING id
    `;
    return novaQuestao.id;
    }

    async alterarQuestao(id, questao){
        const {titulo, descricao, tipo} = questao;
        await sql`UPDATE formulario SET titulo = ${titulo}, descricao = ${descricao}, tipo=${tipo} WHERE id=${id}`;
    }

    async deletarQuestao(id){
        await sql`DELETE FROM questao WHERE id=${id}`;
    }
}