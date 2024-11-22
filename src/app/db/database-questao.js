import {sql} from './db.js';

export class DatabaseQuestao{
    async getQuestoes(){
        const questoes = await sql`SELECT * FROM questao`;
    return questoes;
    }

    async criarQuestao(questao) {
        const { titulo, descricao, tipo } = questao;
    
        try {
            const [novaQuestao] = await sql`
                INSERT INTO questao (titulo, descricao, tipo) 
                VALUES (${titulo}, ${descricao}, ${tipo})
                RETURNING id
            `;
            return novaQuestao.id;
        } catch (error) {
            console.error('Erro ao criar questão:', error.message);
            throw new Error('Erro ao inserir questão no banco de dados.');
        }
    }

    async criarOpcao(opcao, questao_id){
        const { descricao, pontuacao} = opcao;
        try {
            const [novaOpcao] = await sql`
                INSERT INTO opcao (descricao, pontuacao, questao_id) 
                VALUES (${descricao}, ${pontuacao}, ${questao_id})
                RETURNING id
            `;
            return novaOpcao.id;
        } catch (error) {
            console.error('Erro ao criar opção:', error.message);
            throw new Error('Erro ao inserir opção no banco de dados.');
        }
    }

    async alterarQuestao(id, questao){
        const {titulo, descricao, tipo} = questao;
        await sql`UPDATE formulario SET titulo = ${titulo}, descricao = ${descricao}, tipo=${tipo} WHERE id=${id}`;
    }

    async deletarQuestao(id){
        await sql`DELETE FROM questao WHERE id=${id}`;
    }
}