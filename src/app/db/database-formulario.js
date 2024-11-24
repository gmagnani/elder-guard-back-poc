import {sql} from './db.js';

export class DatabaseFormulario{
    async getFormularios(){
        const formularios = await sql`SELECT * FROM formulario`;
    return formularios;
    }

    async getFormulario(formularioId){
        const formulario = await sql`SELECT * FROM formulario WHERE id=${formularioId}`;
        const questao = await sql`SELECT * FROM questao WHERE id=${formulario.questao_id}`;
        if(questao.tipo == 'opcoes'){
            const resultado = await sql`SELECT * FROM formulario form, questao quest, opcao op WHERE quest.id=${formulario.questao_id} AND op.questao_id=${formulario.questao_id}`;
            return resultado;
        }
        const resultado = await sql`SELECT * FROM formulario form, questao quest WHERE quest.id=${formulario.questao_id} `;
            return resultado;

    }

    async criarFormulario(formulario, questaoId) {
        const { nome, tipo, descricao, ordem } = formulario;
        try {
            const query = `
                INSERT INTO formulario (nome, tipo, descricao, ordem, questao_id) 
                VALUES ('${nome}', '${tipo}', '${descricao}', ${ordem}, ${questaoId})
            `;
            console.log('Query:', query);
            await sql`
                INSERT INTO formulario (nome, tipo, descricao, ordem, questao_id) 
                VALUES (${nome}, ${tipo}, ${descricao}, ${ordem} , ${questaoId})
            `;
            return { mensagem: 'Formulário criado com sucesso.' };
        } catch (error) {
            console.error('Erro ao criar formulário:', error.message);
            throw new Error('Erro ao inserir formulário no banco de dados.');
        }
    }

    async alterarFormulario(id, formulario){
        const {nome, tipo, descricao, ordem} = formulario;
        await sql`UPDATE formulario SET nome = ${nome}, tipo = ${tipo}, descricao = ${descricao}, ordem=${ordem} WHERE id=${id}`;
    }

    async deletarFormulario(id){
        await sql`DELETE FROM formulario WHERE id=${id}`;
    }
}