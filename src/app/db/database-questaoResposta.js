import {sql} from './db.js';

export class DatabaseQuestaoResposta{
    async responderQuestao(questaoResposta, formularioId){
        const {resposta, pontuacao, questao_id} = questaoResposta;
        const questaoRespondidaId = sql`
                                            INSERT INTO questaoresposta(resposta, pontuacao, questao_id, formulario_id)
                                            VALUES (${resposta}, ${pontuacao}, ${questao_id}, ${formularioId})
                                            RETURNING id
                                        `
        return questaoRespondidaId;
    }
}