import {sql} from './db.js';

export class DatabaseFormularioResposta{
    async responderFormulario(formularioId, pontuacao) {
        
        try {
                       
            await sql`
                INSERT INTO formularioresposta (pontuacao,formulario_id) 
                VALUES (${pontuacao}, ${formularioId})
            `;
            return { mensagem: 'Resposta gravada com sucesso.' };
        } catch (error) {
            console.error('Erro ao responder formulário:', error.message);
            throw new Error('Erro ao inserir formulário resposta no banco de dados.');
        }
    }
}