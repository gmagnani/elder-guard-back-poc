import {sql} from './db.js';

export class DatabaseFormulario{
    async getFormularios(){
        const formularios = await sql`SELECT * FROM formulario`;
    return formularios;
    }

    async getFormulario(formularioId) {        
        const [formulario] = await sql`SELECT * FROM formulario WHERE id=${formularioId}`;
        if (!formulario || !formulario.questao_id) {
            console.error('Questão ID não encontrado no formulário!');
            return null;
        }
        const [questao] = await sql`SELECT * FROM questao WHERE id=${formulario.questao_id}`;
        const resultado = {
            id: formulario.id,
            nome: formulario.nome,
            descricao: formulario.descricao,
            questao: {
                titulo: questao.titulo,
                descricao: questao.descricao,
                tipo: questao.tipo,
                opcoes: [],
            },
        };
        if (questao.tipo === 'opcoes') {
            const opcoes = await sql`SELECT descricao, pontuacao FROM opcao WHERE questao_id=${formulario.questao_id}`;
            resultado.questao.opcoes = opcoes.map(opcao => ({
                descricao: opcao.descricao,
                valor: opcao.pontuacao,
            }));
        }
    
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