import {sql} from './db.js';

export class DatabaseFormulario{
    async getFormularios(){
        const formularios = await sql`SELECT * FROM formulario`;
    return formularios;
    }

    async criarFormulario(formulario, questaoId) {
        const { nome, tipo, descricao, ordem } = formulario;
        console.log('Dados recebidos para criar formulário:');
        console.log('Nome:', nome);
        console.log('Tipo:', tipo);
        console.log('Descrição:', descricao);
        console.log('Ordem:', ordem);
        console.log('Questão ID:', questaoId);
    
        try {
            await sql`
                INSERT INTO formulario (nome, tipo, descricao, ordem, questao_id) 
                VALUES (${nome}, ${tipo}, ${descricao}, ${ordem} , ${questaoId})
            `;
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